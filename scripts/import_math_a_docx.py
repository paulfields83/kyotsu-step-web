import json
import re
import shutil
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

SECTIONS = {
    "1　集合と要素の個数": ("s1-sets", "1-1", "集合と要素の個数", "第1節 1 集合と要素の個数"),
    "2　場合の数": ("s1-counting", "1-2", "場合の数", "第1節 2 場合の数"),
    "3　和の法則": ("s1-sum-rule", "1-3", "和の法則", "第1節 3 和の法則"),
    "4　積の法則": ("s1-product-rule", "1-4", "積の法則", "第1節 4 積の法則"),
    "第1節　節末問題（自力確認）": ("s1-review", "1-R", "第1節　節末問題（自力確認）", "第1節 節末問題"),
    "1　順列": ("s2-permutation", "2-1", "順列", "第2節 1 順列"),
    "2　円順列と重複順列": ("s2-circular-repetition", "2-2", "円順列と重複順列", "第2節 2 円順列と重複順列"),
    "3　組合せ": ("s2-combination", "2-3", "組合せ", "第2節 3 組合せ"),
    "4　同じものを含む順列": ("s2-duplicate-permutation", "2-4", "同じものを含む順列", "第2節 4 同じものを含む順列"),
}

ASSET_NAMES = {
    "media/image1.png": "venn-diagram.png",
    "media/image2.png": "tree-diagram.png",
    "media/image3.png": "circular-permutation.png",
    "media/image4.png": "octagon.png",
    "media/image5.png": "shortest-path.png",
    "media/image6.png": "parallelogram-lines.png",
}

IMAGE_IDS = {
    "media/image1.png": "venn-diagram",
    "media/image2.png": "tree-diagram",
    "media/image3.png": "circular-permutation",
    "media/image4.png": "octagon",
    "media/image5.png": "shortest-path",
    "media/image6.png": "parallelogram-lines",
}


def text_of(element, relmap):
    chunks = []
    for node in element.iter():
        if node.tag == f"{{{NS['w']}}}t":
            chunks.append(node.text or "")
        elif node.tag == f"{{{NS['a']}}}blip":
            rid = node.attrib.get(f"{{{NS['r']}}}embed")
            chunks.append(f"[[IMAGE:{relmap.get(rid)}]]")
    return "".join(chunks).strip()


def read_body(docx_path):
    with zipfile.ZipFile(docx_path) as zf:
        root = ET.fromstring(zf.read("word/document.xml"))
        rels = ET.fromstring(zf.read("word/_rels/document.xml.rels"))
        relmap = {rel.attrib["Id"]: rel.attrib.get("Target") for rel in rels}
        body = root.find("w:body", NS)
        elements = []
        for child in body:
            if child.tag == f"{{{NS['w']}}}p":
                text = text_of(child, relmap)
                if text:
                    elements.append(("p", text))
            elif child.tag == f"{{{NS['w']}}}tbl":
                rows = []
                for tr in child.findall("w:tr", NS):
                    rows.append([text_of(tc, relmap) for tc in tr.findall("w:tc", NS)])
                elements.append(("table", rows))
    return elements


def parse_answer_tables(elements):
    answers = {}
    in_answers = False
    current = None
    for kind, value in elements:
        if kind == "p" and value == "解答一覧":
            in_answers = True
            continue
        if not in_answers:
            continue
        if kind == "p" and value in {meta[3] for meta in SECTIONS.values()}:
            current = value
            answers[current] = {}
            continue
        if kind == "table" and current:
            for row in value:
                for cell in row:
                    if not cell or "=" not in cell:
                        continue
                    number, answer = cell.split("=", 1)
                    if number.strip() and answer.strip():
                        answers[current][number.strip()] = answer.strip()
    return answers


def answer_type(answer):
    if re.fullmatch(r"[0-9]+", answer):
        return "number"
    if any(mark in answer for mark in ("n(", "C", "P", "!", "^", "−", "+")):
        return "formula"
    return "text"


def validator(answer):
    if re.fullmatch(r"[0-9]+", answer):
        return "number"
    if any(mark in answer for mark in ("n(", "C", "!")):
        return "math-equivalent"
    if any(mark in answer for mark in ("−", "+")):
        return "exact"
    return "normalized-text"


def split_parts(text, section_id):
    parts = []
    cursor = 0
    numbers = []
    for match in re.finditer(r"【([0-9]+)】", text):
        if match.start() > cursor:
            parts.append({"type": "text", "text": text[cursor:match.start()]})
        number = match.group(1)
        parts.append({"type": "choice", "itemId": f"math-a-{section_id}-{int(number):03d}"})
        numbers.append(number)
        cursor = match.end()
    if cursor < len(text):
        parts.append({"type": "text", "text": text[cursor:]})
    return parts, numbers


def is_formula(text):
    if "【" in text:
        return False
    if any(ch in text for ch in ("：", "。", "、")):
        return False
    return bool(re.search(r"[=^!]|C\(|P|\bn[CP]r\b|通り", text)) and len(text) < 80


def build(docx_path, out_dir):
    elements = read_body(docx_path)
    answer_tables = parse_answer_tables(elements)
    content = []
    for kind, value in elements:
        if kind == "p" and value == "解答一覧":
            break
        if kind == "p":
            content.append(value)

    unit = {
        "schemaVersion": "1.0",
        "unitId": "math-1a-counting-permutation",
        "revision": 1,
        "status": "published",
        "subject": "math-1a",
        "title": "数学A 場合の数と順列・組合せ",
        "subtitle": "第1章「場合の数と確率」第1節・第2節",
        "source": {
            "type": "reference",
            "label": "塾_数学A_教科書学習モード_第1節・第2節_完全版.docx",
            "rightsNote": "ユーザー提供のWord母版から構造化。",
        },
        "objectives": [
            "集合を使って数える対象を整理する。",
            "和の法則・積の法則を意味から使い分ける。",
            "順列・円順列・重複順列・組合せ・同じものを含む順列を判断する。",
        ],
        "sections": [],
    }
    all_answers = {"unitId": unit["unitId"], "answers": {}}
    current = None
    figure_pending = None
    block_no = 1

    for text in content:
        if text in ("塾　数学A・教科書学習モード", "第1章「場合の数と確率」第1節 場合の数 ／ 第2節 順列・組合せ", "第1節　場合の数", "第2節　順列・組合せ"):
            continue
        if text in SECTIONS:
            sid, number, title, answer_key = SECTIONS[text]
            current = {
                "id": sid,
                "number": number,
                "title": title,
                "figures": [],
                "readingFlow": [{"id": f"{sid}-h-001", "type": "heading", "text": title}],
                "items": [],
            }
            unit["sections"].append(current)
            block_no = 2
            for display_number, answer in answer_tables.get(answer_key, {}).items():
                item_id = f"math-a-{sid}-{int(display_number):03d}"
                current["items"].append({
                    "id": item_id,
                    "label": display_number,
                    "prompt": f"{title} 【{display_number}】",
                    "answerType": answer_type(answer),
                })
                all_answers["answers"][item_id] = {
                    "validator": validator(answer),
                    "answer": answer,
                    "acceptedAnswers": [],
                }
            continue
        if not current:
            continue
        if text.startswith("[[IMAGE:"):
            target = text.removeprefix("[[IMAGE:").removesuffix("]]")
            asset_id = IMAGE_IDS[target]
            figure_pending = {
                "id": asset_id,
                "src": f"assets/{ASSET_NAMES[target]}",
                "alt": asset_id.replace("-", " "),
            }
            continue
        if figure_pending:
            figure_pending["caption"] = text
            figure_pending["alt"] = text
            current["figures"].append(figure_pending)
            current["readingFlow"].append({"id": f"{current['id']}-fig-{len(current['figures']):03d}", "type": "figure", "figureId": figure_pending["id"]})
            figure_pending = None
            continue
        if text.startswith("教科書 ") or text.startswith("研究　") or text.startswith("節末"):
            current["readingFlow"].append({"id": f"{current['id']}-h-{block_no:03d}", "type": "heading", "text": text})
        elif is_formula(text):
            current["readingFlow"].append({"id": f"{current['id']}-f-{block_no:03d}", "type": "formula", "parts": [{"type": "math", "latex": text}]})
        else:
            parts, _numbers = split_parts(text, current["id"])
            current["readingFlow"].append({"id": f"{current['id']}-p-{block_no:03d}", "type": "paragraph", "parts": parts})
        block_no += 1

    target = Path(out_dir) / "backend" / "data" / "textbooks" / "math-1a" / "counting-permutation"
    assets = target / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(docx_path) as zf:
        for source, name in ASSET_NAMES.items():
            with zf.open(f"word/{source}") as src, (assets / name).open("wb") as dst:
                shutil.copyfileobj(src, dst)
    (target / "unit.json").write_text(json.dumps(unit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (target / "answers.json").write_text(json.dumps(all_answers, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: import_math_a_docx.py input.docx repo_root")
    build(Path(sys.argv[1]), Path(sys.argv[2]))
