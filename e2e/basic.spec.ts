import { test, expect } from '@playwright/test'

test.describe('Agroecology Planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Agroecology Planner/i)
    await expect(page.locator('h1')).toContainText('Agroecologia Planner')
  })

  test('should display the canvas', async ({ page }) => {
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  test('should open element library', async ({ page }) => {
    const libraryButton = page.getByRole('button', { name: /biblioteca/i })
    await libraryButton.click()

    await expect(page.getByText(/Biblioteca de Elementos/i)).toBeVisible()
  })

  test('should select a tool', async ({ page }) => {
    const squareTool = page.getByRole('button', { name: /quadrado/i })
    await squareTool.click()

    await expect(squareTool).toHaveClass(/border-amber-500/)
  })

  test('should toggle grid', async ({ page }) => {
    const gridButton = page.getByRole('button', { name: /grid/i })
    await gridButton.click()

    // Grid should be toggled
    await expect(gridButton).toHaveClass(/bg-amber-500/)
  })

  test('should change canvas dimensions', async ({ page }) => {
    const widthInput = page.getByLabel(/width/i)
    await widthInput.fill('100')

    await expect(widthInput).toHaveValue('100')
  })

  test('should export canvas', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /export/i })

    // Setup download listener
    const downloadPromise = page.waitForEvent('download')
    await exportButton.click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/garden-\d+\.png/)
  })

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check if focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()

    // Mobile navigation should be visible
    const mobileNav = page.locator('[class*="mobile"]')
    await expect(mobileNav).toBeVisible()
  })

  test('should support dark mode', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /theme/i })
    await themeButton.click()

    // Check if dark class is applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('should handle undo/redo', async ({ page }) => {
    // Add an element first
    const squareTool = page.getByRole('button', { name: /quadrado/i })
    await squareTool.click()

    const canvas = page.locator('canvas')
    await canvas.click({ position: { x: 100, y: 100 } })

    // Undo
    const undoButton = page.getByRole('button', { name: /undo/i })
    await undoButton.click()

    // Redo
    const redoButton = page.getByRole('button', { name: /redo/i })
    await expect(redoButton).toBeEnabled()
  })
})
