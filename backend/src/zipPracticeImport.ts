import {
  PracticeCatalogSchema, PracticeQuestionSchema,
  type PracticeCatalog, type PracticeQuestion,
} from './practiceSchema'
import { mathPracticePilotSource } from './zipPracticeSource/pilot'
import { mathPracticeSetsBatchASource } from './zipPracticeSource/setsBatchA'
import { mathPracticePropositionsBatchBSource } from './zipPracticeSource/propositionsBatchB'
import { mathPracticeProofsBatchCSource } from './zipPracticeSource/proofsBatchC'
import type { MathPracticeSourceBlock, MathPracticeSourceQuestion } from './zipPracticeSource/source'

// All 31 authored 4STEP exercises are directly selectable in practice mode.
// Each question keeps its own sequential in-question reasoning flow; there is
// no dependency or unlock requirement between different question numbers.
// This is PRACTICE MODE ONLY. There is no textbook-mode import.
const sources:MathPracticeSourceQuestion[] = [
  ...mathPracticePilotSource,...mathPracticeSetsBatchASource,
  ...mathPracticePropositionsBatchBSource,...mathPracticeProofsBatchCSource,
].sort((a,b)=>a.problemNo-b.problemNo)

export const zipPracticeCatalog:PracticeCatalog=PracticeCatalogSchema.parse({
  schemaVersion:'1.0',subject:'math-1a',course:'math-i',
  majorUnit:{id:'sets-and-logic-zip',label:'集合と命題（4STEP 練習版・試験導入）',order:4},
  subcategories:([
    {id:'sets',label:'集合を整理する'},
    {id:'propositions',label:'条件から命題を読む'},
    {id:'proofs',label:'命題を証明する'},
  ] as const).map((s,i)=>({
    id:s.id,label:s.label,order:i+1,
    problemTypes:[{id:'guided-reasoning',label:'考えながら解く',order:1}],
  })),
})
function block(id:string,value:MathPracticeSourceBlock):PracticeQuestion['stem'][number] {
  return value.type==='latex'
    ? {id,type:'latex',latex:value.latex,display:value.display??'block'}
    : {id,type:'text',text:value.text}
}
function convert(original:MathPracticeSourceQuestion):PracticeQuestion {
  const id='zip4step-'+String(original.problemNo).padStart(3,'0')
  const sourceBlanks=new Map(original.blanks.map(blank=>[blank.id,blank]))
  const guided=original.guide.filter(node=>node.type==='blank').map(node=>node.blankId)
  if(sourceBlanks.size!==original.blanks.length || guided.length!==original.blanks.length
     || new Set(guided).size!==guided.length || guided.some(key=>!sourceBlanks.has(key)))
    throw Error('ZIP blank and guide mismatch: '+id)
  type Step=PracticeQuestion['solutionSteps'][number]
  const steps:Step[]=[]
  let current:Step|undefined
  let contentIndex=0
  for(const node of original.guide){
    if(node.type==='content'){
      current={
        id:id+'-step-'+(steps.length+1),
        dependsOn:[],basis:[],
        purpose:node.blocks.map(b=>b.type==='text'?b.text:b.latex).join(' ').slice(0,500),
        operation:'原稿の案内と設問を確認',
        content:node.blocks.map(b=>block(id+'-guide-'+(++contentIndex),b)),
        blankIds:[],
      }
      steps.push(current)
    }else{
      const blank=sourceBlanks.get(node.blankId)!
      if(!current){
        current={
          id:id+'-step-'+(steps.length+1),dependsOn:[],basis:[],
          purpose:blank.prompt,operation:'原稿の設問を判断',
          content:[{id:id+'-guide-'+(++contentIndex),type:'text',text:blank.prompt}],
          blankIds:[],
        }
        steps.push(current)
      }
      current.blankIds.push(id+'-'+blank.id)
    }
  }
  if(!steps.length)throw Error('ZIP missing guided steps: '+id)
  const blanks=original.blanks.map(blank=>{
    const correct=blank.choices.filter(choice=>choice.correct)
    if(correct.length!==1)throw Error('ZIP blank has non-unique correct choice: '+id+'/'+blank.id)
    const blankId=id+'-'+blank.id
    const stepId=steps.find(step=>step.blankIds.includes(blankId))?.id
    if(!stepId)throw Error('ZIP blank not attached to a step: '+blankId)
    return {
      id:blankId,stepId,prompt:blank.prompt,answerType:'single-choice' as const,
      options:blank.choices.map(choice=>({
        id:blankId+'-'+choice.id,label:choice.label,
        ...(choice.wrongReason?{wrongReason:choice.wrongReason}:{}),
      })),
      correctOptionIds:[blankId+'-'+correct[0].id],
      explanation:blank.explanation,
    }
  })
  if(original.section==='functions')throw Error('Function source in 集合と命題: '+id)
  return PracticeQuestionSchema.parse({
    schemaVersion:'1.0',questionId:id,revision:1,
    status:'published',
    subject:'math-1a',course:'math-i',majorUnit:zipPracticeCatalog.majorUnit.id,
    subcategory:original.section,problemType:'guided-reasoning',
    title:'4STEP '+original.problemNo+'｜'+original.title,
    difficulty:'basic',
    source:{type:'reference',label:'4STEP 問題'+original.problemNo,
      rightsNote:'ZIP 2026-10-04 authored 4STEP practice source. Original problem references preserved; stage-dependent visual presentation remains subject to quality review.'},
    stem:original.problem.map((b,i)=>block(id+'-problem-'+(i+1),b)),
    solutionSteps:steps,blanks,
    fullExplanation:original.fullExplanation,
    interaction:{reveal:'sequential',options:'inline-expand',
      substituteCorrectAnswer:true,lockFutureSteps:true},
  })
}
export const zipPracticeQuestions=sources.map(convert)
export const zipPracticeSourceNumbers=sources.map(source=>source.problemNo)
