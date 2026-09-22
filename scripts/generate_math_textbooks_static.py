#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
import re
import unicodedata
from collections import OrderedDict
from pathlib import Path

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "backend" / "data" / "textbooks" / "math-1a" / "source"
OUT = ROOT / "backend" / "data" / "textbooks" / "math-1a"

def resolve_source(name: str) -> Path:
    wanted = unicodedata.normalize("NFC", name)
    for path in SOURCE.glob("*.docx"):
        if unicodedata.normalize("NFC", path.name) == wanted:
            return path
    raise FileNotFoundError(name)

CONFIGS = [
    ("塾_数学I_第1章_数と式_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-numbers-expressions", "数学I 数と式", "塾 数学I 第1章「数と式」教科書学習モード完全版"),
    ("塾_数学I_第2章_2次関数_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-quadratic-functions", "数学I 2次関数", "塾 数学I 第2章「2次関数」教科書学習モード完全版"),
    ("塾_数学I_第4章_図形と計量_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-geometry-measurement", "数学I 図形と計量", "塾 数学I 第4章「図形と計量」教科書学習モード完全版"),
    ("塾_数学I_第5章_データの分析_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-data-analysis", "数学I データの分析", "塾 数学I 第5章「データの分析」教科書学習モード完全版"),
    ("塾_数学A_序章_集合_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-math-a-sets", "数学A 集合", "塾 数学A 序章「集合」教科書学習モード完全版"),
    ("塾_数学A_第2章_図形の性質_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-geometric-properties", "数学A 図形の性質", "塾 数学A 第2章「図形の性質」教科書学習モード完全版"),
    ("塾_数学A_第3章_数学と人間の活動_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx",
     "math-1a-human-activities", "数学A 数学と人間の活動", "塾 数学A 第3章「数学と人間の活動」教科書学習モード完全版"),
]

def iter_blocks(doc: DocumentType):
    for child in doc.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, doc)
        elif isinstance(child, CT_Tbl):
            yield Table(child, doc)

def blocks(path: Path):
    doc = Document(path)
    out = []
    for block in iter_blocks(doc):
        if isinstance(block, Paragraph):
            text = block.text.strip()
            if text:
                out.append({"kind": "p", "style": block.style.name if block.style else "", "text": text})
        else:
            rows = [[cell.text.strip() for cell in row.cells] for row in block.rows]
            if any(any(cell for cell in row) for row in rows):
                out.append({"kind": "table", "rows": rows})
    return out

def clean(text: str):
    text = text.replace("\u00a0", " ").strip()
    text = re.sub(r'\{b\.B\("([^"]+)"\)\}', r'\1', text)
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()

def normalize_label(text: str):
    text = clean(text)
    text = re.sub(r'^第\s*[0-9０-９]+\s*節\s*', '', text)
    text = re.sub(r'^第\s*[0-9０-９]+\s*章\s*', '', text)
    text = re.sub(r'^序章\s*', '', text)
    text = re.sub(r'^[0-9０-９]+(?:\.[0-9０-９]+)?\s*', '', text)
    text = re.sub(r'[\s　・／/（）()「」『』：:,.，。\-−–—]', '', text)
    return unicodedata.normalize("NFKC", text).lower()

def parse_pairs(text: str):
    text = clean(text)
    pattern = re.compile(r'(?:^|\s)(\d+)\s*=\s*(.*?)(?=(?:\s+\d+\s*=)|$)')
    return [(m.group(1), m.group(2).strip()) for m in pattern.finditer(text) if m.group(2).strip()]

def answer_groups(path: Path):
    source = blocks(path)
    start = next(i + 1 for i, b in enumerate(source) if b["kind"] == "p" and clean(b["text"]).startswith("解答一覧"))
    groups = []
    current = None
    for block in source[start:]:
        if block["kind"] == "p":
            text = clean(block["text"])
            style = block.get("style", "")
            if style == "Heading 1":
                break
            if style == "Heading 2":
                current = {"label": text, "answers": OrderedDict()}
                groups.append(current)
                continue
            pairs = parse_pairs(text)
            if pairs and current:
                for key, value in pairs:
                    current["answers"][key] = value
        else:
            for row in block["rows"]:
                pairs = parse_pairs(" ".join(cell for cell in row if cell))
                if pairs and current:
                    for key, value in pairs:
                        current["answers"][key] = value
    return groups

def content_segments(path: Path):
    source = blocks(path)
    end = next(i for i, b in enumerate(source) if b["kind"] == "p" and clean(b["text"]).startswith("解答一覧"))
    segments = []
    current = None
    for block in source[:end]:
        if block["kind"] == "p" and block.get("style") == "Heading 1":
            text = clean(block["text"])
            if re.match(r'^(?:第\s*\d+\s*節|第\s*\d+\s*章|序章|章末)', text):
                current = {"heading": text, "blocks": []}
                segments.append(current)
            continue
        if current:
            current["blocks"].append(block)
    return segments

def section_title(heading: str):
    text = clean(heading)
    if text.startswith("章末"):
        return text
    text = re.sub(r'^第\s*\d+\s*節\s*', '', text)
    text = re.sub(r'^第\s*\d+\s*章\s*', '', text)
    text = re.sub(r'^序章\s*', '', text)
    return text.strip()

def section_number(heading: str):
    match = re.match(r'^第\s*(\d+)\s*節', clean(heading))
    return match.group(1) if match else None

def authoring_text(text: str):
    text = clean(text)
    if not text:
        return True
    prefixes = [
        "この教材の使い方", "Standard 誘導", "Standard誘導", "出典", "対象範囲",
        "制作確認用", "教材走査メモ", "この一覧は App 本文用ではなく", "走査頁",
    ]
    if any(text.startswith(prefix) for prefix in prefixes):
        return True
    if "教科書 p." in text and len(text) < 50:
        return True
    if re.match(r'^Guide\s*(?:PDF\s*)?p\.?\s*\d', text, re.I):
        return True
    return False

def answer_type(answer: str):
    answer = clean(answer)
    if re.fullmatch(r'[+−-]?\d+(?:\.\d+)?', answer):
        return "number"
    if re.search(r'[=≦≧<>⇒⇔⊂⊃∩∪√²³^!/%]|[a-zA-Z]\d*|[₀-₉]', answer):
        return "formula"
    return "text"

def validator(answer: str):
    return "number" if answer_type(answer) == "number" else "normalized-text"

def safe_id(text: str):
    text = unicodedata.normalize("NFKC", text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text or "x"

def parts(text: str, item_id_for):
    text = clean(text)
    out = []
    cursor = 0
    for match in re.finditer(r'【(\d+)】', text):
        if match.start() > cursor:
            out.append({"type": "text", "text": text[cursor:match.start()]})
        out.append({"type": "choice", "itemId": item_id_for(match.group(1))})
        cursor = match.end()
    if cursor < len(text):
        out.append({"type": "text", "text": text[cursor:]})
    return [part for part in out if part.get("type") != "text" or part.get("text")]

def find_group(groups, heading: str):
    target = normalize_label(heading)
    best = None
    for group in groups:
        label = normalize_label(group["label"])
        score = 100 if target == label else 80 if target and label and (target in label or label in target) else len(set(target) & set(label))
        if best is None or score > best[0]:
            best = (score, group)
    return best[1] if best else None

def topic_group_index(title: str, groups, current: int):
    target = normalize_label(title)
    best = (-1, current)
    for index, group in enumerate(groups):
        label = normalize_label(group["label"])
        score = 100 if target == label else 80 if target and label and (target in label or label in target) else len(set(target) & set(label))
        if score > best[0]:
            best = (score, index)
    return best[1] if best[0] >= 10 else min(current, max(0, len(groups) - 1))

def build_unit(path: Path, unit_id: str, title: str, source_label: str, answer_scope: str = "section"):
    groups = answer_groups(path)
    segments = content_segments(path)
    actual = [segment for segment in segments if not clean(segment["heading"]).startswith("章末")]
    appendices = [segment for segment in segments if clean(segment["heading"]).startswith("章末")]
    sections = []
    all_answers = {}
    warnings = []

    for section_index, segment in enumerate(actual, start=1):
        sec_title = section_title(segment["heading"])
        sec_id = f"s{section_index}-{safe_id(unit_id.replace('math-1a-', ''))[:20]}"
        section_group = find_group(groups, segment["heading"])
        secnum = section_number(segment["heading"])
        section_groups = [g for g in groups if secnum and re.match(rf'^第\s*{re.escape(secnum)}\s*節', clean(g["label"]))] if answer_scope == "topic" else []

        topic_list = []
        pending = []
        current_topic = None
        for block in segment["blocks"]:
            if block["kind"] == "p" and block.get("style") == "Heading 2":
                current_topic = {"title": clean(block["text"]), "blocks": []}
                if pending:
                    current_topic["blocks"].extend(pending)
                    pending = []
                topic_list.append(current_topic)
            else:
                if current_topic is None:
                    pending.append(block)
                else:
                    current_topic["blocks"].append(block)
        if not topic_list:
            topic_list = [{"title": sec_title, "blocks": pending}]
        elif pending:
            topic_list[0]["blocks"] = pending + topic_list[0]["blocks"]

        if section_index == len(actual):
            for appendix in appendices:
                topic_list.append({"title": clean(appendix["heading"]), "blocks": appendix["blocks"], "appendix": appendix["heading"]})

        reading = []
        items = OrderedDict()
        section_answers = {}
        current_topic_group = 0

        for topic_index, topic in enumerate(topic_list, start=1):
            raw_title = clean(topic["title"])
            number_match = re.match(r'^(\d+(?:\.\d+)?)\s+(.+)$', raw_title)
            title_only = number_match.group(2) if number_match else raw_title
            if "節末問題" in title_only:
                title_only = re.sub(r'^第\s*\d+\s*節\s*', '', title_only)

            if "appendix" in topic:
                group = find_group(groups, topic["appendix"])
                group_tag = "end"
            elif answer_scope == "topic":
                idx = topic_group_index(raw_title, section_groups or groups, current_topic_group)
                group = (section_groups or groups)[idx]
                current_topic_group = max(current_topic_group, idx)
                group_tag = f"t{topic_index}"
            else:
                group = section_group
                group_tag = "main"

            reading.append({
                "id": f"{sec_id}-topic-{topic_index:02d}",
                "type": "topic",
                "text": f"{section_index}.{topic_index} {title_only}",
            })

            def item_id_for(number: str):
                item_id = f"{safe_id(unit_id)}-s{section_index}-{group_tag}-b{int(number):03d}"
                if item_id not in items:
                    answer = group["answers"].get(str(int(number))) if group else None
                    if answer is None:
                        warnings.append(f"{sec_title} / {title_only} missing answer 【{number}】")
                        answer = f"[未設定:{number}]"
                    items[item_id] = {
                        "id": item_id,
                        "label": str(int(number)),
                        "prompt": f"{title_only} 【{int(number)}】",
                        "acceptedAnswers": [],
                        "answerType": answer_type(answer),
                    }
                    section_answers[item_id] = {
                        "validator": validator(answer),
                        "answer": answer,
                        "acceptedAnswers": [],
                    }
                return item_id

            block_index = 0
            for block in topic["blocks"]:
                if block["kind"] == "p":
                    text = clean(block["text"])
                    if authoring_text(text) or text.startswith("※ 空欄"):
                        continue
                    block_index += 1
                    if re.match(r'^(教科書対応問|節末対応|問題文|研究|発展|確認問題)', text):
                        reading.append({"id": f"{sec_id}-t{topic_index:02d}-h{block_index:03d}", "type": "heading", "text": text})
                    else:
                        flow_parts = parts(text, item_id_for)
                        if flow_parts:
                            reading.append({"id": f"{sec_id}-t{topic_index:02d}-p{block_index:03d}", "type": "paragraph", "parts": flow_parts})
                else:
                    for row in block["rows"]:
                        text = clean(" ｜ ".join(cell for cell in row if clean(cell)))
                        if not text or authoring_text(text):
                            continue
                        block_index += 1
                        if re.match(r'^(読む|考える|最後の確認|注意|この節の固定レール)', text):
                            reading.append({"id": f"{sec_id}-t{topic_index:02d}-n{block_index:03d}", "type": "note", "text": text})
                        else:
                            flow_parts = parts(text, item_id_for)
                            if flow_parts:
                                reading.append({"id": f"{sec_id}-t{topic_index:02d}-p{block_index:03d}", "type": "paragraph", "parts": flow_parts})

        refs = {
            part["itemId"]
            for block in reading if block["type"] in ("paragraph", "formula")
            for part in block["parts"] if part["type"] == "choice"
        }
        items_list = [item for item_id, item in items.items() if item_id in refs]
        section_answers = {item_id: answer for item_id, answer in section_answers.items() if item_id in refs}
        sections.append({
            "id": sec_id,
            "number": str(section_index),
            "title": sec_title,
            "description": f"{sec_title}を、説明・判断・計算を飛ばさずに一つずつ確認する。",
            "figures": [],
            "readingFlow": reading,
            "items": items_list,
        })
        all_answers.update(section_answers)

    unit = {
        "schemaVersion": "1.0",
        "unitId": unit_id,
        "revision": 1,
        "status": "published",
        "subject": "math-1a",
        "title": title,
        "source": {
            "type": "reference",
            "label": source_label,
            "rightsNote": "ユーザー提供の学習モードWord母本をもとに、静的なバックエンド教材データへ構造化。",
        },
        "objectives": [f"「{section['title']}」の考え方を、本文と空欄を通して一段ずつ確認する。" for section in sections],
        "sections": sections,
    }
    return unit, {"unitId": unit_id, "answers": all_answers}, warnings

def shift_sections(unit, answer_book, offset: int):
    shifted = []
    answer_out = {}
    for old_index, section in enumerate(unit["sections"], start=1):
        new_index = old_index + offset
        new_section = copy.deepcopy(section)
        new_section["id"] = re.sub(r'^s\d+-', f's{new_index}-', new_section["id"])
        new_section["number"] = str(new_index)
        item_map = {}
        for item in new_section["items"]:
            old_id = item["id"]
            item["id"] = re.sub(r'-s\d+-', f'-s{new_index}-', old_id, count=1)
            item_map[old_id] = item["id"]
        for block in new_section["readingFlow"]:
            block["id"] = re.sub(r'^s\d+-', f's{new_index}-', block["id"])
            if block["type"] == "topic":
                block["text"] = re.sub(r'^\d+\.', f'{new_index}.', block["text"])
            if block["type"] in ("paragraph", "formula"):
                for part in block["parts"]:
                    if part["type"] == "choice":
                        part["itemId"] = item_map.get(part["itemId"], re.sub(r'-s\d+-', f'-s{new_index}-', part["itemId"], count=1))
        shifted.append(new_section)

    for item_id, answer in answer_book["answers"].items():
        match = re.search(r'-s(\d+)-', item_id)
        old_index = int(match.group(1))
        new_index = old_index + offset
        answer_out[re.sub(r'-s\d+-', f'-s{new_index}-', item_id, count=1)] = answer
    return shifted, answer_out

def apply_counting_correction(unit, answer_book):
    section = unit["sections"][0]
    target = None
    for block in section["readingFlow"]:
        if block["type"] != "paragraph":
            continue
        text = "".join(part.get("text", "") for part in block["parts"] if part["type"] == "text")
        if "40人中、毎日テレビ1時間以上16人" in text:
            target = block
            break
    if not target:
        raise RuntimeError("counting TV review paragraph not found")

    prefix = "math-1a-counting-probability-s1-t5"
    old_id = f"{prefix}-b023"
    new_items = [
        (f"{prefix}-union-max", "(1) 最大", "40"),
        (f"{prefix}-union-min", "(1) 最小", "31"),
        (f"{prefix}-both-max", "(2) 最大", "16"),
        (f"{prefix}-both-min", "(2) 最小", "7"),
    ]
    target["parts"] = [
        {"type": "text", "text": "40人中、毎日テレビ1時間以上16人、毎日スマートフォン1時間以上31人。(1) どちらかを1時間以上利用する人数の最大・最小、(2) 両方利用する人数の最大・最小を考える。集合の重なりを最小・最大にするとき、どちらの集合をもう一方へできるだけ"},
        {"type": "choice", "itemId": f"{prefix}-b021"},
        {"type": "text", "text": "か、できるだけ"},
        {"type": "choice", "itemId": f"{prefix}-b022"},
        {"type": "text", "text": "かを考える。その上で、(1) どちらかを1時間以上利用する人数は最大"},
        {"type": "choice", "itemId": new_items[0][0]},
        {"type": "text", "text": "人、最小"},
        {"type": "choice", "itemId": new_items[1][0]},
        {"type": "text", "text": "人。(2) 両方利用する人数は最大"},
        {"type": "choice", "itemId": new_items[2][0]},
        {"type": "text", "text": "人、最小"},
        {"type": "choice", "itemId": new_items[3][0]},
        {"type": "text", "text": "人。"},
    ]
    section["items"] = [item for item in section["items"] if item["id"] != old_id]
    answer_book["answers"].pop(old_id, None)
    for item_id, label, answer in new_items:
        section["items"].append({
            "id": item_id,
            "label": label,
            "prompt": "テレビとスマートフォンの集合の最大・最小",
            "acceptedAnswers": [],
            "answerType": "number",
        })
        answer_book["answers"][item_id] = {"validator": "number", "answer": answer, "acceptedAnswers": []}

def validate(unit, answer_book):
    ids = []
    refs = []
    for section in unit["sections"]:
        ids.extend(item["id"] for item in section["items"])
        for block in section["readingFlow"]:
            if block["type"] in ("paragraph", "formula"):
                refs.extend(part["itemId"] for part in block["parts"] if part["type"] == "choice")
    if len(ids) != len(set(ids)):
        raise RuntimeError(f"duplicate item ids in {unit['unitId']}")
    if set(ids) != set(refs):
        raise RuntimeError(f"readingFlow/item mismatch in {unit['unitId']}")
    if set(ids) != set(answer_book["answers"]):
        raise RuntimeError(f"answer/item mismatch in {unit['unitId']}")
    for item_id, answer in answer_book["answers"].items():
        if answer["answer"].startswith("[未設定:"):
            raise RuntimeError(f"missing answer {item_id} in {unit['unitId']}")

def write_unit(unit, answers):
    directory = OUT / unit["unitId"].replace("math-1a-", "")
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "unit.json").write_text(json.dumps(unit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (directory / "answers.json").write_text(json.dumps(answers, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def main():
    summaries = []
    for filename, unit_id, title, label in CONFIGS:
        unit, answers, warnings = build_unit(resolve_source(filename), unit_id, title, label, "section")
        if warnings:
            raise RuntimeError(f"{unit_id}: " + "; ".join(warnings))
        validate(unit, answers)
        write_unit(unit, answers)
        summaries.append((unit_id, len(unit["sections"]), sum(len(section["items"]) for section in unit["sections"])))

    first, first_answers, warnings = build_unit(
        resolve_source("塾_数学A_教科書学習モード_第1節・第2節_完全版.docx"),
        "math-1a-counting-probability",
        "数学A 場合の数と確率",
        "塾 数学A 第1章「場合の数と確率」第1・第2節 黄金母本",
        "topic",
    )
    latter, latter_answers, latter_warnings = build_unit(
        resolve_source("塾_数学A_第1章_第3節・第4節_確率_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx"),
        "math-1a-counting-probability",
        "数学A 場合の数と確率",
        "塾 数学A 第1章「場合の数と確率」第3・第4節 厳格誘導母本",
        "section",
    )
    if warnings or latter_warnings:
        raise RuntimeError("math-1a-counting-probability: " + "; ".join(warnings + latter_warnings))
    latter_sections, latter_answer_map = shift_sections(latter, latter_answers, 2)
    first["sections"].extend(latter_sections)
    first["source"] = {
        "type": "reference",
        "label": "塾 数学A 第1章「場合の数と確率」教科書学習モード完全版",
        "rightsNote": "ユーザー提供の第1・第2節黄金母本と第3・第4節厳格誘導母本を統合して静的なバックエンド教材データへ構造化。",
    }
    first["objectives"] = [f"「{section['title']}」の考え方を、本文と空欄を通して一段ずつ確認する。" for section in first["sections"]]
    first_answers["answers"].update(latter_answer_map)
    apply_counting_correction(first, first_answers)
    validate(first, first_answers)
    write_unit(first, first_answers)
    summaries.append((first["unitId"], len(first["sections"]), sum(len(section["items"]) for section in first["sections"])))

    print("Generated static math textbooks:")
    for unit_id, section_count, item_count in summaries:
        print(f"- {unit_id}: {section_count} sections / {item_count} items")

if __name__ == "__main__":
    main()
