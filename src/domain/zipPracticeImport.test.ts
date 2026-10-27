import { describe,expect,it } from 'vitest'
import {loadedPracticeUnits} from '../../backend/src/practiceData'
import {zipPracticeCatalog,zipPracticeQuestions,zipPracticeSourceNumbers} from '../../backend/src/zipPracticeImport'
import {publicPracticeQuestion} from '../../backend/src/publicPractice'

describe('ZIP 4STEP guided practice mode public 31-question import',()=>{
  it('preserves the 31 authored 87–117 questions without replacing legacy 36',()=>{
    expect(zipPracticeQuestions).toHaveLength(31)
    expect(zipPracticeSourceNumbers).toEqual(Array.from({length:31},(_,i)=>i+87))
    expect(zipPracticeQuestions.filter(q=>q.subcategory==='sets')).toHaveLength(11)
    expect(zipPracticeQuestions.filter(q=>q.subcategory==='propositions')).toHaveLength(11)
    expect(zipPracticeQuestions.filter(q=>q.subcategory==='proofs')).toHaveLength(9)
    const legacy=loadedPracticeUnits.find(u=>u.catalog.majorUnit.id==='sets-and-logic')!
    expect(legacy.questions.filter(q=>q.status==='published')).toHaveLength(36)
    expect(loadedPracticeUnits.find(u=>u.catalog.majorUnit.id===zipPracticeCatalog.majorUnit.id)?.questions).toHaveLength(31)
  })
  it('publishes every 4STEP question independently, without requiring earlier questions',()=>{
    expect(zipPracticeQuestions.filter(q=>q.status==='published').map(q=>q.questionId))
      .toEqual(Array.from({length:31},(_,i)=>'zip4step-'+String(i+87).padStart(3,'0')))
    expect(zipPracticeQuestions.filter(q=>q.status==='review')).toHaveLength(0)
    const pilot=zipPracticeQuestions.find(q=>q.questionId==='zip4step-087')!
    expect(pilot.blanks).toHaveLength(10)
    expect(pilot.stem.map(block=>block.type)).toContain('latex')
    const publicPilot=publicPracticeQuestion(pilot)
    for(const blank of publicPilot.blanks){
      expect(blank.options.length).toBeGreaterThanOrEqual(2)
      expect('correctOptionIds' in blank).toBe(false)
      expect('explanation' in blank).toBe(false)
      for(const option of blank.options) expect('wrongReason' in option).toBe(false)
    }
  })
  it('preserves original thinking-node order, answers and guided paragraphs across all sources',()=>{
    for(const question of zipPracticeQuestions){
      const stepIds=new Set(question.solutionSteps.map(step=>step.id))
      const ids=question.solutionSteps.flatMap(step=>step.blankIds)
      expect(new Set(ids).size,question.questionId).toBe(question.blanks.length)
      expect(new Set(question.blanks.map(blank=>blank.id))).toEqual(new Set(ids))
      expect(question.blanks.every(blank=>stepIds.has(blank.stepId))).toBe(true)
      expect(question.blanks.every(blank=>blank.correctOptionIds.length===1)).toBe(true)
      expect(question.blanks.every(blank=>blank.options.some(option=>blank.correctOptionIds.includes(option.id)))).toBe(true)
    }
  })
})
