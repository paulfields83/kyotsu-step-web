import type { PracticeQuestion } from './practiceSchema'

function normalizeLatex(value: string) {
  const slash = String.fromCharCode(92)
  return value.split(slash + slash).join(slash).replace(/□/g, slash + 'square ')
}

function publicContentBlocks(blocks: PracticeQuestion['stem']) {
  return blocks.map((block) => block.type === 'latex'
    ? { ...block, latex: normalizeLatex(block.latex) }
    : block)
}

/**
 * The ZIP authoring pack stores nearly all correct alternatives first.
 * Randomize the visible ORDER, never the values or IDs used for grading.
 * Use a stable per-question/per-blank permutation to avoid the positions
 * jumping around when students expand the original inline-choice panel.
 */
function stablePracticeChoiceOrder<T extends {id:string}>(options:T[],seedText:string):T[] {
  let seed=2166136261
  for(let i=0;i<seedText.length;i++){
    seed=Math.imul(seed ^ seedText.charCodeAt(i),16777619)>>>0
  }
  const ordered=[...options]
  for(let i=ordered.length-1;i>0;i--){
    seed^=seed<<13
    seed^=seed>>>17
    seed^=seed<<5
    const j=(seed>>>0)%(i+1)
    ;[ordered[i],ordered[j]]=[ordered[j],ordered[i]]
  }
  return ordered
}

export function publicPracticeQuestion(question: PracticeQuestion) {
  return {
    ...question,
    stem: publicContentBlocks(question.stem),
    solutionSteps: question.solutionSteps.map((step) => ({
      ...step,
      content: publicContentBlocks(step.content),
    })),
    blanks: question.blanks.map((blank) => ({
      id: blank.id,
      stepId: blank.stepId,
      prompt: blank.prompt,
      answerType: blank.answerType,
      options: (question.questionId.startsWith('zip4step-')
        ? stablePracticeChoiceOrder(blank.options,question.questionId+'/'+blank.id)
        : blank.options
      ).map(({ wrongReason: _wrongReason, ...option }) => option),
    })),
  }
}

export function publicPracticeSummary(question: PracticeQuestion) {
  return {
    questionId: question.questionId,
    revision: question.revision,
    subject: question.subject,
    course: question.course,
    majorUnit: question.majorUnit,
    subcategory: question.subcategory,
    problemType: question.problemType,
    title: question.title,
    difficulty: question.difficulty,
    source: question.source,
  }
}
