import { expect, test } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD
const liveEventID = process.env.E2E_LIVE_EVENT_ID
const eventID = process.env.E2E_EVENT_ID

test.describe('Live event Realtime', () => {
  test.skip(
    !adminEmail || !adminPassword || !liveEventID || !eventID,
    'Set E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_LIVE_EVENT_ID, and E2E_EVENT_ID to run this test.',
  )

  test('publishes an admin resume action to an open live page', async ({ browser }) => {
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    const liveContext = await browser.newContext()
    const livePage = await liveContext.newPage()

    await adminPage.goto('/admin/login')
    await adminPage.getByLabel('Email').fill(adminEmail!)
    await adminPage.getByLabel('Password').fill(adminPassword!)
    await adminPage.getByRole('button', { name: /login|sign in/i }).click()
    await adminPage.waitForURL(/\/admin/)

    await livePage.goto(`/live/${eventID!}`)

    await adminPage.goto(`/admin/collections/live-event/${liveEventID}`)
    const resumeButton = adminPage.getByRole('button', { name: 'Resume' })
    const pauseButton = adminPage.getByRole('button', { name: 'Pause' })

    if (await pauseButton.isVisible()) {
      await pauseButton.click()
      await expect(livePage.getByText(/\(paused\)/)).toBeVisible({ timeout: 10_000 })
    }

    await expect(livePage.getByText(/\(paused\)/)).toBeVisible({ timeout: 10_000 })
    await expect(livePage.getByText(/Level: (?!-)/)).toBeVisible()
    await expect(adminPage.getByText('Not available')).not.toBeVisible()
    await expect(resumeButton).toBeEnabled({ timeout: 10_000 })
    await resumeButton.click()
    await expect(livePage.getByText(/\(running\)/)).toBeVisible({ timeout: 10_000 })

    const liveLevel = livePage.locator('h2').filter({ hasText: 'Level:' })
    const initialLevelLabel = (await liveLevel.textContent())?.split(' · ')[0]
    const nextButton = adminPage.getByRole('button', { name: 'Next level' })
    const previousButton = adminPage.getByRole('button', { name: 'Previous level' })

    await expect(nextButton).toBeEnabled()
    await nextButton.click()
    await expect(liveLevel).not.toContainText(initialLevelLabel!)

    await expect(previousButton).toBeEnabled()
    await previousButton.click()
    await expect(liveLevel).toContainText(initialLevelLabel!)

    await pauseButton.click()
    await expect(livePage.getByText(/\(paused\)/)).toBeVisible({ timeout: 10_000 })

    await adminContext.close()
    await liveContext.close()
  })
})
