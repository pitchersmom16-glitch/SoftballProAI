import { test, expect } from '@playwright/test';

test('home -> sign in -> onboarding wizard appears', async ({ page, request }) => {
  // Start at the home page
  await page.goto('/');

  // Click the Sign In link on the landing page to trigger server auto-login
  await page.click('[data-testid="link-signin"]');
  await page.waitForLoadState('networkidle');

  // Ensure role is set to player so app shows player routes.
  // Use `page.evaluate` to call the API from the browser context so cookies/session are shared.
  const roleStatus = await page.evaluate(async () => {
    const resp = await fetch('/api/user/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ role: 'player' })
    });
    return resp.status;
  });
  if (roleStatus !== 200) {
    throw new Error(`Setting role failed (status=${roleStatus})`);
  }

  // Navigate to home again as authenticated player; OnboardingGate should redirect to /player/onboarding
  await page.goto('/');

  // Wait for onboarding wizard title to appear
  await expect(page.locator('[data-testid="text-onboarding-title"]')).toBeVisible({ timeout: 5000 });
});
