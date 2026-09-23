import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const sections = [
  { label: 'Work', id: 'work' },
  { label: 'Infrastructure', id: 'infrastructure' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
];

const pageErrors = new WeakMap<Page, Error[]>();

// Keep the suite independent of third-party availability, and fail on any
// uncaught page error (hydration errors included).
test.beforeEach(async ({ page }) => {
  await page.route(/calendly\.com|formspree\.io/, (route) => route.abort());
  const errors: Error[] = [];
  pageErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)?.map((e) => e.message) ?? []).toEqual([]);
});

async function openNav(page: Page, isMobile: boolean) {
  if (!isMobile) return page.getByRole('navigation', { name: 'Primary' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  return page.locator('#mobile-menu');
}

test('primary navigation reaches every section', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Jayden Mistry' })).toBeVisible();

  for (const { label, id } of sections) {
    const nav = await openNav(page, isMobile);
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    if (isMobile) await expect(page.locator('#mobile-menu')).toHaveCount(0);
  }
});

test('mobile menu closes on Escape and returns focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('critical links resolve', async ({ page, request }) => {
  await page.goto('/');

  // Every in-page anchor has a target.
  const hashes = await page.locator('a[href^="#"]').evaluateAll((links) =>
    [...new Set(links.map((a) => a.getAttribute('href')!.slice(1)))],
  );
  for (const id of hashes) await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);

  // The résumé is served as a PDF, and every résumé link is tracked.
  const resume = await request.get('/resume.pdf');
  expect(resume.status()).toBe(200);
  expect(resume.headers()['content-type']).toContain('application/pdf');
  const resumeLinks = page.locator('a[href="/resume.pdf"]');
  expect(await resumeLinks.count()).toBeGreaterThan(0);
  for (const link of await resumeLinks.all()) {
    await expect(link).toHaveAttribute('data-umami-event', 'resume-click');
  }

  expect((await request.get('/this-page-does-not-exist')).status()).toBe(404);
});

test('theme defaults to light and remembers an explicit choice', async ({ page }) => {
  const root = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Dark mode' });

  await page.goto('/');
  await expect(root).not.toHaveAttribute('data-theme');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await toggle.click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  // Applied by the head script before hydration, then reflected by the toggle.
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(28, 27, 25)');

  await toggle.click();
  await page.reload();
  await expect(root).not.toHaveAttribute('data-theme');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(243, 240, 232)');
});

for (const theme of ['light', 'dark'] as const) {
  test(`no automatically detectable accessibility violations in ${theme} theme`, async ({ page }) => {
    if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/');
    if (theme === 'dark') await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    else await expect(page.locator('html')).not.toHaveAttribute('data-theme');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
}
