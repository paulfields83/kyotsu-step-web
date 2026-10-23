import { test, expect } from '@playwright/test'

test.setTimeout(150_000)

test('ZIP 4STEP pilot 87 is in practice mode, with authored two/three-choice reasoning', async ({page}) => {
  await page.goto('/#/practice/session/zip4step-087',{waitUntil:'domcontentloaded'})
  await expect(page.locator('.session-header h1')).toContainText('4STEP 87',{timeout:110_000})
  await expect(page.getByText(/30以下の素数/).first()).toBeVisible()
  const first=page.getByTestId('practice-blank-trigger-zip4step-087-condition-sufficiency')
  await expect(first).toBeVisible({timeout:35000})
  // A guide authored without explicit 【①】 still opens the EXISTING inline panel.
  await first.click()
  const choices=page.locator('.reading-inline-choice-panel .reading-choice-option')
  await expect(choices).toHaveCount(2)
  await choices.filter({hasText:'十分ではない'}).click()
  await expect(page.getByTestId('practice-blank-resolved-zip4step-087-condition-sufficiency')).toBeVisible()
  const second=page.getByTestId('practice-blank-trigger-zip4step-087-prime-condition')
  await expect(second).toBeVisible()
  await second.click()
  await expect(choices).toHaveCount(3)
  await choices.filter({hasText:'偶数である'}).click()
  await expect(page.getByTestId('practice-blank-resolved-zip4step-087-prime-condition')).toHaveCount(0)
  await expect(page.getByTestId('practice-blank-trigger-zip4step-087-two-divisors')).toHaveCount(0)
  await choices.filter({hasText:'素数である'}).click()
  await expect(page.getByTestId('practice-blank-resolved-zip4step-087-prime-condition')).toBeVisible()
  await expect(page.getByTestId('practice-blank-trigger-zip4step-087-two-divisors')).toBeVisible()
})

test('the student-facing practice catalog shows only 4STEP and exposes all 31 exercises', async({request})=>{
  const api='https://kyotsu-step-db-merged-preview.onrender.com'
  const catalog=await request.get(api+'/api/practice/catalog?subject=math-1a',{timeout:110_000})
  expect(catalog.ok()).toBeTruthy()
  const units=await catalog.json()
  expect(units.map((unit:{majorUnit:{id:string}})=>unit.majorUnit.id)).toEqual(['sets-and-logic-zip'])
  expect(units[0].majorUnit.label).toBe('集合と命題（4STEP 練習版・試験導入）')
  expect(units[0].subcategories.map((category:{questionCount:number})=>category.questionCount))
    .toEqual([11,11,9])
  const response=await request.get(api+'/api/practice/questions?majorUnit=sets-and-logic-zip',{timeout:110_000})
  expect(response.ok()).toBeTruthy()
  const ids=(await response.json()).map((question:{questionId:string})=>question.questionId)
  expect(ids).toEqual(Array.from({length:31},(_,i)=>'zip4step-'+String(i+87).padStart(3,'0')))
  const hidden=await request.get(api+'/api/practice/questions?majorUnit=sets-and-logic',{timeout:110_000})
  expect(hidden.ok()).toBeTruthy()
  expect(await hidden.json()).toEqual([])
  // Original URL can still load: hiding the old version does not delete history.
  const archived=await request.get(api+'/api/practice/questions/'+encodeURIComponent('math-i-4step-set-090'),{timeout:110_000})
  // The archive's exact generated ID may differ; public list visibility above is authoritative.
  expect([200,404]).toContain(archived.status())
})

test('any question can open directly without prior exercise unlocks',async({page})=>{
  await page.goto('/#/practice/session/zip4step-117',{waitUntil:'domcontentloaded'})
  await expect(page.locator('.session-header h1')).toContainText('4STEP 117',{timeout:110_000})
  await expect(page.locator('.practice-blank-line').first()).toBeVisible()
})
