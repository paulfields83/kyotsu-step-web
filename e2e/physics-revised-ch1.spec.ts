import {test,expect} from '@playwright/test'
import { textbookMathLatex } from '../src/domain/textbookMathDisplay'

test.setTimeout(150_000)

const api='https://kyotsu-step-db-merged-preview.onrender.com'
const codeToId=[
  'physics-a-displacement-velocity-revised',
  'physics-1b-velocity-composition-revised',
  'physics-1c-relative-velocity-revised',
  'physics-1d-acceleration-revised',
  'physics-1e-horizontal-projectile-revised',
  'physics-1f-oblique-projectile-revised',
  'physics-1g-gravity-drag-terminal-velocity-revised',
]


test('physics textbook and practice share the screenshot module headings with honest placeholders',async({page})=>{
  await page.goto('/#/learn',{waitUntil:'domcontentloaded'})
  await page.getByRole('button',{name:/物理/}).first().click()
  const textbook=page.getByTestId('physics-textbook-module-picker')
  await expect(textbook).toBeVisible({timeout:110_000})
  const groups=[
    {id:'mechanics',heading:'力学',count:5},
    {id:'heat',heading:'熱',count:1},
    {id:'waves',heading:'波動',count:3},
    {id:'electromagnetism',heading:'電磁気',count:4},
    {id:'atomic',heading:'原子',count:2},
  ]
  for(const group of groups){
    const section=textbook.getByTestId('physics-category-'+group.id)
    await expect(section.locator('h3')).toHaveText(group.heading)
    await expect(section.locator('button')).toHaveCount(group.count)
  }
  await expect(textbook.locator('.v2-physics-module-button')).toHaveCount(15)
  const textbookFirst=textbook.getByTestId('physics-module-textbook-physics-1')
  await expect(textbookFirst).toBeEnabled()
  await expect(textbook.getByTestId('physics-module-textbook-physics-heat-gas-molecules')).toBeDisabled()
  await expect(page.locator('.v2-course-card').filter({hasText:'物体の運動（改訂版）'})).toBeVisible()
  const second=textbook.getByTestId('physics-module-textbook-physics-2')
  await expect(second).toBeEnabled()
  await second.click()
  await expect(page.locator('.v2-course-card').filter({hasText:'剛体にはたらく力'})).toBeVisible()
  await textbookFirst.click()
  await expect(page.locator('.v2-course-card').filter({hasText:'物体の運動（改訂版）'}).locator('.v2-lesson-list > a')).toHaveCount(3)

  await page.getByRole('button',{name:/問題練習/}).click()
  const practice=page.getByTestId('physics-practice-module-picker')
  await expect(practice).toBeVisible()
  await expect(practice.locator('.v2-physics-module-button')).toHaveCount(15)
  await expect(practice.locator('.v2-physics-module-button:not(:disabled)')).toHaveCount(0)
  await expect(page.locator('.v2-practice-card')).toHaveCount(0)
})

test('physics textbook public catalog exposes exactly 7 revised Chapter-1 units and archives originals',async({request})=>{
  const response=await request.get(api+'/api/textbooks',{timeout:110_000})
  expect(response.ok()).toBeTruthy()
  const all=await response.json()
  const ch1=all.filter((unit:{unitId:string})=>codeToId.includes(unit.unitId))
  expect(ch1.map((unit:{unitId:string})=>unit.unitId)).toEqual(codeToId)
  expect(all.some((unit:{unitId:string})=>unit.unitId==='physics-a-displacement-velocity')).toBe(false)
  expect(all.some((unit:{unitId:string})=>/^physics-1[b-g]-/.test(unit.unitId)&&!unit.unitId.endsWith('-revised'))).toBe(false)
  expect(all.some((unit:{unitId:string})=>unit.unitId==='physics-2a-rigid-body-force-action')).toBe(true)
  const total=ch1.reduce((n:number,unit:{sections:Array<{items:unknown[]}>})=>
    n+unit.sections.reduce((k,section)=>k+section.items.length,0),0)
  expect(total).toBe(108)
  const figures=ch1.flatMap((unit:{sections:Array<{figures:Array<{src:string}>}>})=>unit.sections.flatMap(section=>section.figures))
  expect(figures).toHaveLength(18)
  for(const figure of figures){
    const asset=await request.get(figure.src,{timeout:60_000})
    expect(asset.ok(),figure.src).toBeTruthy()
    expect((await asset.body()).length,figure.src).toBeGreaterThan(2500)
  }
  const old=await request.get(api+'/api/textbooks/physics-a-displacement-velocity',{timeout:110_000})
  expect(old.ok()).toBeTruthy()
})

test('physics home and textbook pages reuse Math chapter rows then original topic tiles',async({page})=>{
  await page.goto('/#/learn',{waitUntil:'domcontentloaded'})
  await page.getByRole('button',{name:/物理/}).first().click()
  const card=page.locator('.v2-course-card').filter({hasText:'物体の運動（改訂版）'})
  await expect(card).toBeVisible({timeout:110_000})
  await expect(card.locator('.v2-lesson-list > a')).toHaveCount(3)
  await expect(card.getByRole('link',{name:/第1節.*運動を表す/})).toBeVisible()
  await expect(card.getByRole('link',{name:/第2節.*速度の変化/})).toBeVisible()
  await expect(card.getByRole('link',{name:/第3節.*力と運動/})).toBeVisible()
  const groupCodes=[
    {target:'represent',unit:codeToId[0],count:3},
    {target:'change',unit:codeToId[3],count:3},
    {target:'force',unit:codeToId[6],count:1},
  ]
  for(const group of groupCodes){
    await page.goto('/#/learning/textbook/'+group.unit+'?target=physics-revised-ch01-'+group.target,{waitUntil:'domcontentloaded'})
    const buttons=page.locator('.textbook-section-nav button')
    await expect(buttons).toHaveCount(group.count,{timeout:110_000})
    await expect(page.locator('.session-header h1')).toContainText('物体の運動（改訂版）')
    await expect(page.locator('.textbook-section-heading h2')).not.toBeEmpty()
    await expect(page.locator('.katex-error')).toHaveCount(0)
  }
})


test('all seven source-authored physics topics load their own first guided step through the three existing chapter rows',async({page})=>{
  const cases=[
    {group:'represent',index:0,id:codeToId[0],first:'a1',title:'変位と速度'},
    {group:'represent',index:1,id:codeToId[1],first:'b1',title:'速度の合成と分解'},
    {group:'represent',index:2,id:codeToId[2],first:'c2',title:'相対速度'},
    {group:'change',index:0,id:codeToId[3],first:'d1',title:'加速度'},
    {group:'change',index:1,id:codeToId[4],first:'e1',title:'水平投射'},
    {group:'change',index:2,id:codeToId[5],first:'f1',title:'斜方投射'},
    {group:'force',index:0,id:codeToId[6],first:'g0',title:'重力加速度'},
  ]
  for(const source of cases){
    const route='/#/learning/textbook/'+source.id+
      '?target=physics-revised-ch01-'+source.group+
      '&topic='+encodeURIComponent(source.id)
    await page.goto(route,{waitUntil:'domcontentloaded'})
    const navigation=page.locator('.textbook-section-nav button')
    await expect(navigation.nth(source.index)).toHaveAttribute('aria-pressed','true',{timeout:110_000})
    await expect(page.locator('.textbook-section-heading h2')).toContainText(source.title)
    await expect(page.getByTestId('textbook-item-'+source.first)).toBeVisible()
    await expect(page.locator('.katex-error')).toHaveCount(0)
    await expect(page.locator('.textbook-section')).not.toContainText('�')
  }
})

test('revised physics follows GOLDEN 集合と命題: wrong first choice immediately reveals answer and unlocks text',async({page,request})=>{
  const unitId=codeToId[0]
  const endpoint=api+'/api/textbooks/'+unitId+'/items/a1/answer'
  const bad=await request.post(endpoint,{data:{value:'速さ'},timeout:110_000})
  expect(bad.ok()).toBeTruthy()
  expect(await bad.json()).toMatchObject({correct:false,resolved:true,correctAnswer:'位置'})

  await page.goto('/#/learning/textbook/'+unitId+'?target=physics-revised-ch01-represent',{waitUntil:'domcontentloaded'})
  const blank=page.getByTestId('textbook-item-a1')
  await expect(blank).toBeVisible({timeout:110_000})
  await expect(page.getByText('位置の変化を表す',{exact:true})).toHaveCount(0)

  await blank.click()
  const panel=page.getByTestId('inline-choice-panel-a1')
  await expect(panel).toBeVisible()
  await panel.getByRole('button',{name:/ヒントを見る/}).click()
  await expect(panel.locator('.reading-hint-steps li')).toHaveCount(1)
  await panel.locator('.reading-choice-option').filter({hasText:'速さ'}).click()
  await expect(page.getByTestId('resolved-a1')).toBeVisible()
  await expect(page.getByTestId('answer-reveal-a1')).toContainText('位置')
  await expect(panel.locator('.reading-choice-option--wrong')).toContainText('速さ')
  await expect(panel.locator('.textbook-choice--correct')).toContainText('位置')
  await expect(panel.locator('.reading-choice-option').first()).toBeDisabled()
  await expect(page.getByText('位置の変化を表す',{exact:true})).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('resolved-a1')).toBeVisible()
  await expect(page.getByTestId('resolved-a1')).toContainText('速さ')
  await expect(page.getByTestId('resolved-a1')).toContainText('位置')
})


test('revised physics: all source Unicode-math option values typeset without broken glyphs',async({request})=>{
  const response=await request.get(api+'/api/textbooks',{timeout:110_000})
  expect(response.ok()).toBeTruthy()
  const units=(await response.json()) as Array<{
    unitId:string, sections:Array<{items:Array<{id:string,choices:string[]}>}>
  }>
  const subjects=units.filter(unit=>codeToId.includes(unit.unitId))
  let mathChoices=0
  for(const unit of subjects){
    for(const section of unit.sections){
      for(const item of section.items){
        for(const choice of item.choices){
          if(!/[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜΔθ√²³]/u.test(choice))continue
          if(/[ぁ-んァ-ヶ一-龯]/u.test(choice)){
            expect(choice).toMatch(/だけ$/u)
            expect(textbookMathLatex(choice.replace(/だけ$/u,'')),unit.unitId+' '+item.id+' '+choice).not.toBeNull()
            continue
          }
          const converted=textbookMathLatex(choice)
          expect(converted,unit.unitId+' '+item.id+' '+choice).not.toBeNull()
          expect(converted,unit.unitId+' '+item.id+' '+choice).not.toMatch(/[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]/u)
          mathChoices++
        }
      }
    }
  }
  expect(mathChoices).toBeGreaterThan(80)
})


test('A3 actual deployed browser options display four vector formulas without square glyphs',async({page})=>{
  await page.goto('/#/learning/textbook/'+codeToId[0]+'?target=physics-revised-ch01-represent',{waitUntil:'domcontentloaded'})
  for(const [id,choice] of [['a1','位置'],['a2','位置の変化']] as const){
    await page.getByTestId('textbook-item-'+id).click()
    await page.locator('.reading-choice-option[data-choice-value='+JSON.stringify(choice)+']').click()
    await expect(page.getByTestId('resolved-'+id)).toBeVisible()
  }
  const third=page.getByTestId('textbook-item-a3')
  await expect(third).toBeVisible({timeout:110_000})
  await third.click()
  const panel=page.getByTestId('inline-choice-panel-a3')
  const buttons=panel.locator('.reading-choice-option')
  await expect(buttons).toHaveCount(4)
  const snapshot=await buttons.evaluateAll(nodes=>nodes.map(n=>({
    choice:n.getAttribute('data-choice-value'),
    text:n.textContent,
    mathCount:n.querySelectorAll('.katex-html').length,
    visible:n.querySelector('.katex-html')?.textContent?.slice(0,100),
    html:n.querySelector('strong')?.innerHTML.slice(0,450),
  })))
  console.log('A3_REAL_DEPLOYED_RENDER',JSON.stringify(snapshot))
  expect(snapshot.map(x=>x.choice).every(x=>x && /[⃗̄]/u.test(x))).toBeTruthy()
  for(const entry of snapshot){
    expect(entry.mathCount,entry.choice??'missing option').toBeGreaterThan(0)
    expect(entry.visible,entry.choice??'missing option').not.toMatch(/[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]|[☒□�]/u)
  }
  await expect(panel.locator('.katex-error')).toHaveCount(0)

  // Reproduce the EXACT ChatGPT referral URL visible in the reported screenshot.
  // A separate query-string cache key must not keep an old untypeset JS bundle.
  await page.goto('/?utm_source=chatgpt.com#/learning/textbook/'+codeToId[0]+
    '?target=physics-revised-ch01-represent',{waitUntil:'domcontentloaded'})
  await expect(page.getByTestId('textbook-item-a3')).toBeVisible({timeout:110_000})
  await page.getByTestId('textbook-item-a3').click()
  const referralPanel=page.getByTestId('inline-choice-panel-a3')
  await expect(referralPanel.locator('.reading-choice-option .katex-html')).toHaveCount(4)
  await expect(referralPanel.locator('.katex-error')).toHaveCount(0)
})

test('revised physics D1 guided hints typeset vector notation as readable math',async({page})=>{
  const unitId=codeToId[3]
  await page.goto('/#/learning/textbook/'+unitId+'?target=physics-revised-ch01-change&topic='+unitId,{waitUntil:'domcontentloaded'})
  const first=page.getByTestId('textbook-item-d1')
  await expect(first).toBeVisible({timeout:110_000})
  await first.click()
  const panel=page.getByTestId('inline-choice-panel-d1')
  await expect(panel).toBeVisible()
  const hintButton=panel.getByRole('button',{name:/ヒントを見る/})
  await hintButton.click()
  await hintButton.click()
  const hints=panel.locator('.reading-hint-steps li')
  await expect(hints).toHaveCount(2)
  await expect(hints.nth(1).locator('.katex').first()).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('revised physics answer choice is interactive and does not expose private keys',async({page})=>{
  await page.goto('/#/learning/textbook/'+codeToId[0]+'?target=physics-revised-ch01-represent',{waitUntil:'domcontentloaded'})
  const first=page.getByTestId('textbook-item-a1')
  await expect(first).toBeVisible({timeout:110_000})
  await first.click()
  const panel=page.getByTestId('inline-choice-panel-a1')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.reading-choice-option')).toHaveCount(4)
  await panel.locator('.reading-choice-option').filter({hasText:'位置'}).click()
  await expect(page.getByTestId('resolved-a1')).toBeVisible()
})
