import {describe,expect,it} from 'vitest'
import katex from 'katex'
import {zipPracticeQuestions} from '../../backend/src/zipPracticeImport'
import {publicPracticeQuestion} from '../../backend/src/publicPractice'

const mojibake=/\uFFFD|ãƒ|ã‚|ï¿½|â€|Â(?:©|®|·)/u
const control=/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u

describe('ZIP 31 practice questions source-to-student display audit',()=>{
  it('validates all authored LaTeX in questions and reasoning flow with KaTeX',()=>{
    let formulas=0
    for(const question of zipPracticeQuestions){
      const publicQuestion=publicPracticeQuestion(question)
      const content=[...publicQuestion.stem,...publicQuestion.solutionSteps.flatMap(step=>step.content)]
      for(const block of content){
        const text=block.type==='latex'?block.latex:block.text
        expect(text,question.questionId+' '+block.id).not.toMatch(mojibake)
        expect(text,question.questionId+' '+block.id).not.toMatch(control)
        if(block.type!=='latex')continue
        formulas++
        expect(()=>katex.renderToString(block.latex,{throwOnError:true,strict:'ignore'}),question.questionId+' '+block.id+' '+block.latex).not.toThrow()
      }
    }
    expect(formulas).toBeGreaterThan(30)
  })
  it('detects corrupted choices, missing text and duplicated answer choices',()=>{
    let total=0
    const suspicious:string[]=[]
    for(const question of zipPracticeQuestions){
      for(const blank of question.blanks){
        total++
        expect(blank.options.length,question.questionId+'/'+blank.id).toBeGreaterThanOrEqual(2)
        expect(blank.options.length,question.questionId+'/'+blank.id).toBeLessThanOrEqual(4)
        const normalized=blank.options.map(opt=>opt.label.normalize('NFKC').replace(/\s+/g,'').trim())
        if(new Set(normalized).size!==normalized.length)suspicious.push(question.questionId+'/'+blank.id)
        for(const option of blank.options){
          expect(option.label,question.questionId+'/'+blank.id).not.toMatch(mojibake)
          expect(option.label,question.questionId+'/'+blank.id).not.toMatch(control)
          expect(option.label.trim().length,question.questionId+'/'+blank.id).toBeGreaterThan(0)
        }
        expect(blank.prompt,question.questionId+'/'+blank.id).not.toMatch(mojibake)
        expect(blank.explanation,question.questionId+'/'+blank.id).not.toMatch(mojibake)
      }
    }
    expect(suspicious,'identical options: '+suspicious.join(', ')).toEqual([])
    expect(total).toBeGreaterThan(150)
  })
  it('does not publicly expose correct IDs, wrong reasons or model answers',()=>{
    for(const question of zipPracticeQuestions){
      const published=publicPracticeQuestion(question)
      expect(published.status).toBe('published')
      for(const blank of published.blanks){
        expect('correctOptionIds' in blank).toBe(false)
        expect('explanation' in blank).toBe(false)
        for(const option of blank.options)expect('wrongReason' in option).toBe(false)
      }
    }
  })
})
