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

/** The theme control: in the nav on desktop, in the menu sheet on phones. */
async function themeControl(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    return page.locator('#mobile-menu').getByRole('radiogroup', { name: 'Theme' });
  }
  return page.getByRole('navigation', { name: 'Primary' }).getByRole('radiogroup', { name: 'Theme' });
}

test('theme follows the system and remembers an explicit choice', async ({ page, isMobile }) => {
  const root = page.locator('html');

  await page.goto('/');
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(root).toHaveAttribute('data-theme-pref', 'system');
  let control = await themeControl(page, isMobile);
  await expect(control.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'true');

  await control.getByRole('radio', { name: 'Dark' }).click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(control.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');

  await page.reload();
  // Applied by the head script before hydration.
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(root).toHaveAttribute('data-theme-pref', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');

  control = await themeControl(page, isMobile);
  await control.getByRole('radio', { name: 'System' }).click();
  await page.reload();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('theme follows a dark system setting with no stored choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
});

test('screenshot viewer opens, closes on Escape and returns focus', async ({ page }) => {
  await page.goto('/#spotr');
  const open = page.getByRole('button', { name: /^View full size:/ });
  await open.click();
  const viewer = page.getByRole('dialog');
  await expect(viewer).toBeVisible();
  await expect(viewer.getByRole('button', { name: 'Close image' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveCount(0);
  await expect(open).toBeFocused();
});

test('contact form reports missing fields inline', async ({ page }) => {
  await page.goto('/#contact');
  const form = page.locator('#contact form');
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByLabel('Name')).toBeFocused();
  await expect(form.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByText('Enter your name.')).toBeVisible();

  await form.getByLabel('Email').fill('not-an-email');
  await form.getByLabel('Name').fill('Ada');
  await expect(form.getByText('Enter your name.')).toHaveCount(0);
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByText('Enter an email address, like name@example.com.')).toBeVisible();
});

for (const [theme, path] of [
  ['light', '/'],
  ['dark', '/'],
  ['light', '/privacy'],
  ['dark', '/privacy'],
] as const) {
  test(`no automatically detectable accessibility violations on ${path} in ${theme} theme`, async ({ page }) => {
    if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
}
