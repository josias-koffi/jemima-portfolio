import { expect, test } from '@playwright/test'

// Smoke test local : `docker compose up -d`, contenu importé, puis `pnpm test:e2e`.

test('accueil : hero, liste des projets, à propos', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1.hero__name')).toHaveAttribute('aria-label', /Jémima/)
  await expect(page.locator('.work__item').first()).toBeVisible()
  await expect(page.locator('#a-propos')).toBeVisible()
  await expect(page.locator('.hero .status')).toContainText(/alternance/i)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})

test('page projet et projet suivant', async ({ page }) => {
  await page.goto('/')
  const first = page.locator('.work__link').first()
  const title = await first.locator('.work__title').innerText()
  await first.click()
  await expect(page.locator('h1.project__title')).toHaveText(title)
  await expect(page.locator('.case__title').first()).toHaveText('Le défi')
  await expect(page.locator('a.next')).toBeVisible()
})

test('404 avec le gabarit du site', async ({ page }) => {
  const res = await page.goto('/cette-page-nexiste-pas')
  expect(res?.status()).toBe(404)
  await expect(page.locator('.notfound')).toBeVisible()
})
