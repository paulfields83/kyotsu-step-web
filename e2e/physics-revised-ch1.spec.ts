import {test,expect} from '@playwright/test'

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
