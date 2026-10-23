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

test('ZIP practice source is isolated from textbook mode and old published 36', async({request})=>{
  const api='https://kyotsu-step-db-merged-preview.onrender.com'
  const catalog=await request.get(api+'/api/practice/catalog?subject=math-1a',{timeout:110_000})
  expect(catalog.ok()).toBeTruthy()
  const units=await catalog.json()
  const imported=units.find((unit:{majorUnit:{id:string}})=>unit.majorUnit.id==='sets-and-logic-zip')
  const legacy=units.find((unit:{majorUnit:{id:string}})=>unit.majorUnit.id==='sets-and-logic')
  expect(imported?.subcategories.map((x:{questionCount:number})=>x.questionCount)).toEqual([1,0,0])
  expect(legacy).toBeTruthy()
  const response=await request.get(api+'/api/practice/questions?majorUnit=sets-and-logic-zip',{timeout:110_000})
  expect(response.ok()).toBeTruthy()
  expect((await response.json()).map((question:{questionId:string})=>question.questionId)).toEqual(['zip4step-087'])
})
