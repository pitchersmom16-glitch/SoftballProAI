import { test, expect } from '@playwright/test';

test('login -> see onboarding wizard -> reach dashboard (mock unlock)', async ({ page }) => {
  // Auto-login via the dev auto-login route
  await page.goto('/auth');
  await page.waitForLoadState('networkidle');

  // Ensure we're authenticated in the browser by setting role to player
  await page.evaluate(async () => {
    await fetch('/api/user/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: 'player' }),
    });
  });

  // Visit the onboarding page and assert the onboarding title is visible
  await page.goto('/player/onboarding');
  await expect(page.locator('[data-testid="text-onboarding-title"]')).toBeVisible({ timeout: 5000 });

  // Now mock the onboarding API to return dashboardUnlocked so the gate allows dashboard
  await page.route('**/api/player/onboarding', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ dashboardUnlocked: true, baselineComplete: true, baselineVideoCount: 4, baselineVideosRequired: 4 }),
    });
  });

  // Navigate to dashboard and verify main dashboard content appears
  await page.goto('/dashboard');
  await expect(page.locator('text=My Journey')).toBeVisible({ timeout: 5000 });
});
