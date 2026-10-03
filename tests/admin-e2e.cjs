/**
 * FILE: tests/admin-e2e.cjs
 * WHAT IT DOES
 *   Drives the real admin in a browser against a pretend GitHub (tests/mockGithub.cjs).
 *   No real token needed. It checks login, editing, uploads, publishing (one commit with
 *   exactly the changed files), conflicts, undo, validation and failure cases.
 *
 * RUN IT
 *   npm run build && npx vite preview --port 4173 &      (serve the built site)
 *   npm i -D playwright   (once)      then:   npm run test:e2e
 */
const { chromium } = require('playwright');
const { createMockGithub } = require('./mockGithub.cjs');

const SITE = process.env.SITE_URL || 'http://localhost:4173/';
const results = [];
const consoleErrors = [];

function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `   -> ${detail}`}`);
}

async function newAdminPage(browser, mock, { viewport = { width: 1280, height: 900 } } = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('dialog', (d) => d.accept()); // auto-OK confirm() questions
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('Failed to load resource') && consoleErrors.push(m.text()));
  await mock.attach(page);
  await page.goto(`${SITE}#/admin`);
  return page;
}

async function login(page, mock, { remember = false } = {}) {
  await page.fill('#token', mock.GOOD_TOKEN);
  if (remember) await page.check('text=Remember me');
  await page.click('button:has-text("Log in")');
  await page.waitForSelector('.adm-top');
}

const goTo = (page, label) => page.click(`.adm-nav button:has-text("${label}")`);
const publishButton = (page) => page.locator('.adm-publish button.adm-btn--primary');

(async () => {
  const browser = await chromium.launch();

  // ---------------------------------------------------------------- login
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await page.waitForSelector('#token'); // the admin loads lazily, wait for it
    check('login screen shows first', await page.locator('#token').isVisible());
    await page.fill('#token', 'wrong-token');
    await page.click('button:has-text("Log in")');
    await page.waitForSelector('.adm-error');
    check('bad token shows a friendly error', (await page.textContent('.adm-error')).includes('rejected this token'));
    await login(page, mock);
    check('good token opens the studio', await page.locator('.adm-nav').isVisible());
    check('token is sent as a Bearer header', mock.state.tokenSeen === `Bearer ${mock.GOOD_TOKEN}`);

    // not remembered: a second tab of the same browser must ask for the token again
    const otherTab = await page.context().newPage();
    await mock.attach(otherTab);
    await otherTab.goto(`${SITE}#/admin`);
    await otherTab.waitForSelector('#token');
    check('unticked "remember" is not kept in a new tab', await otherTab.locator('#token').isVisible());
    await page.context().close();
  }

  // ------------------------------------------------ remember + logout
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await login(page, mock, { remember: true });
    await page.reload();
    await page.waitForSelector('.adm-top');
    check('"remember me" survives a reload', true);
    await page.click('button:has-text("Log out")');
    await page.waitForSelector('#token');
    const left = await page.evaluate(() => localStorage.getItem('portfolio.admin.session'));
    check('log out clears the saved token', left === null);
    await page.context().close();
  }

  // ------------------------- edit + reorder + add + one-commit publish
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await login(page, mock);
    const hobbiesBefore = JSON.parse(mock.fileText('src/content/hobbies.json'));

    await goTo(page, 'Hobbies');
    await page.click('button:has-text("+ Add hobby")');
    await page.getByLabel('Title').fill('Test hobby');
    await page.click('button[aria-label="Move hobby down"] >> nth=0');

    await goTo(page, 'Projects');
    await page.click('.adm-item__title >> nth=0');
    await page.getByLabel('Title').fill('Renamed project');

    check('publish bar counts 2 changes', (await page.textContent('.adm-count')).startsWith('2 unpublished'));
    check('menu shows an unpublished dot', (await page.locator('.adm-dot').count()) === 2);

    await publishButton(page).click();
    await page.waitForSelector('.adm-ok', { timeout: 30000 });
    check('status ends at "Live"', (await page.textContent('.adm-ok')).includes('Live'));

    check('exactly ONE commit was made', mock.state.commits.length === 1);
    const id = mock.state.commits[0];
    check('commit changes only the 2 edited files', JSON.stringify(mock.changedIn(id)) === JSON.stringify(['src/content/hobbies.json', 'src/content/projects.json']), JSON.stringify(mock.changedIn(id)));
    check('commit message starts with "Admin: "', mock.commitInfo(id).message.startsWith('Admin: '));
    const hobbiesAfter = JSON.parse(mock.fileText('src/content/hobbies.json'));
    check('new hobby saved', hobbiesAfter.some((h) => h.title === 'Test hobby') && hobbiesAfter.length === hobbiesBefore.length + 1);
    check('reorder saved', hobbiesAfter[0].id === hobbiesBefore[1].id && hobbiesAfter[1].id === hobbiesBefore[0].id);
    check('project rename saved', JSON.parse(mock.fileText('src/content/projects.json'))[0].title === 'Renamed project');
    check('count resets after publishing', (await page.textContent('.adm-count')).startsWith('No unpublished'));

    // ---- undo
    const before = JSON.stringify(hobbiesBefore);
    await page.click('button:has-text("Undo last publish")');
    await page.waitForSelector('.adm-ok', { timeout: 30000 });
    check('undo restored the previous hobbies file', JSON.stringify(JSON.parse(mock.fileText('src/content/hobbies.json'))) === before);
    check('undo is its own commit', mock.state.commits.length === 2 && mock.commitInfo(mock.head()).message.includes('undo'));
    await page.context().close();
  }

  // ----------------------------- validation blocks publishing
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await login(page, mock);
    await goTo(page, 'Projects');
    await page.click('.adm-item__title >> nth=0');
    await page.getByLabel('Title').fill('');
    check('empty title is reported', (await page.locator('.adm-problems').textContent()).includes('title'));
    check('Publish is disabled while there are problems', await publishButton(page).isDisabled());
    await page.click('button:has-text("Discard")');
    check('Discard clears changes and problems', (await page.locator('.adm-problems').count()) === 0 && (await page.textContent('.adm-count')).startsWith('No unpublished'));
    await page.context().close();
  }

  // ------------------- resume PDF + custom icon (sanitised) + stickers
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await login(page, mock);

    await goTo(page, 'Resume');
    await page.setInputFiles('input[aria-label="Upload resume PDF"]', { name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%mock resume\n') });
    check('PDF is queued', (await page.textContent('.adm-note')).includes('New PDF ready'));
    await page.setInputFiles('input[aria-label="Upload resume PDF"]', { name: 'x.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a pdf at all') });
    check('fake PDF is rejected', (await page.textContent('.adm-error')).includes('real PDF'));

    await goTo(page, 'Icons');
    await page.getByLabel('Icon name').fill('Rocket Ship');
    await page.getByLabel('…or paste SVG code').fill('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><script>alert(1)</script><circle cx="10" cy="10" r="8" onclick="steal()"/><a href="javascript:evil()"><rect width="4" height="4"/></a></svg>');
    await page.click('button:has-text("Add pasted SVG")');
    check('custom icon is listed', (await page.locator('.adm-icon-list li').count()) === 1);

    await goTo(page, 'Hobbies');
    await page.click('.adm-item__title >> nth=0');
    await page.click('button:has-text("+ Icon")');
    check('custom icon appears in the picker', (await page.locator('.adm-icon-btn:has-text("rocket-ship")').count()) === 1);
    await page.click('.adm-icon-btn:has-text("rocket-ship")');

    await goTo(page, 'Stickers');
    const stickersBefore = await page.locator('.adm-sticker').count();
    await page.click('button:has-text("+ Add sticker")');
    const afterAdd = await page.locator('.adm-sticker').count();
    check('sticker added to the preview', afterAdd === stickersBefore + 1);
    const sticker = page.locator('.adm-sticker').last();
    const box = await sticker.boundingBox();
    const area = await page.locator('.adm-stickerbox').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(area.x + area.width * 0.7, area.y + area.height * 0.6, { steps: 6 });
    await page.mouse.up();

    await publishButton(page).click();
    await page.waitForSelector('.adm-ok', { timeout: 30000 });
    const id = mock.state.commits[0];
    const changed = mock.changedIn(id);
    check('one commit contains PDF + icon + json files', ['public/assets/icons/rocket-ship.svg', 'public/assets/resume/Ishaan-parmar-resume.pdf', 'src/content/hobbies.json', 'src/content/icons.json', 'src/content/stickers.json'].every((f) => changed.includes(f)), JSON.stringify(changed));
    check('PDF bytes saved intact', mock.fileBuffer('public/assets/resume/Ishaan-parmar-resume.pdf').toString().startsWith('%PDF-1.4'));
    const svg = mock.fileText('public/assets/icons/rocket-ship.svg');
    check('SVG was sanitised (no script / onclick / javascript:)', !/script|onclick|javascript:/i.test(svg) && svg.includes('<circle'), svg);
    const stickers = JSON.parse(mock.fileText('src/content/stickers.json')).profile;
    const last = stickers[stickers.length - 1];
    check('dragged sticker saved with % position', /%$/.test(String(last.pos.top)) && /%$/.test(String(last.pos.left)), JSON.stringify(last));
    check('icons.json lists the new icon', JSON.parse(mock.fileText('src/content/icons.json'))[0].file === 'assets/icons/rocket-ship.svg');
    await page.context().close();
  }

  // ----------------------------------------------------- conflicts
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await login(page, mock);
    await goTo(page, 'Projects');
    await page.click('.adm-item__title >> nth=0');
    await page.getByLabel('Title').fill('Edited here');
    mock.externalCommit('src/content/projects.json', '[]\n'); // someone else changed the same file
    await publishButton(page).click();
    await page.waitForSelector('.adm-publish .adm-error');
    check('clashing edit is detected', (await page.textContent('.adm-publish .adm-error')).includes('changed by someone else'));
    check('nothing was overwritten', mock.fileText('src/content/projects.json') === '[]\n');
    await page.context().close();
  }
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock);
    await login(page, mock);
    await goTo(page, 'Hobbies');
    await page.click('.adm-item__title >> nth=0');
    await page.getByLabel('Title').fill('Edited safely');
    mock.externalCommit('README.md', 'hello\n'); // unrelated change on main
    await publishButton(page).click();
    await page.waitForSelector('.adm-ok', { timeout: 30000 });
    check('unrelated change on main does not block publishing', JSON.parse(mock.fileText('src/content/hobbies.json'))[0].title === 'Edited safely' && mock.fileText('README.md') === 'hello\n');
    await page.context().close();
  }

  // ---------------------------------------- protected main + failed deploy
  {
    const mock = createMockGithub({ protectedMain: true });
    const page = await newAdminPage(browser, mock);
    await login(page, mock);
    await goTo(page, 'Hobbies');
    await page.click('.adm-item__title >> nth=0');
    await page.getByLabel('Title').fill('PR path');
    await publishButton(page).click();
    await page.waitForSelector('.adm-publish .adm-note:has-text("pull request")', { timeout: 20000 });
    check('protected main falls back to a pull request', true);
    await page.context().close();
  }
  {
    const mock = createMockGithub({ deployFails: true });
    const page = await newAdminPage(browser, mock);
    await login(page, mock);
    await goTo(page, 'Hobbies');
    await page.click('.adm-item__title >> nth=0');
    await page.getByLabel('Title').fill('Will fail to build');
    await publishButton(page).click();
    await page.waitForSelector('.adm-publish .adm-error', { timeout: 30000 });
    check('failed rebuild is reported clearly', (await page.textContent('.adm-publish .adm-error')).includes('rebuild failed'));
    await page.context().close();
  }

  // -------------------------------------------------------- mobile look
  {
    const mock = createMockGithub();
    const page = await newAdminPage(browser, mock, { viewport: { width: 390, height: 844 } });
    if (process.env.SHOTS) await page.screenshot({ path: `${process.env.SHOTS}/admin-m-login.png` });
    await login(page, mock);
    await goTo(page, 'Projects');
    await page.click('.adm-item__title >> nth=0');
    if (process.env.SHOTS) await page.screenshot({ path: `${process.env.SHOTS}/admin-m-projects.png` });
    check('no sideways scroll on mobile', !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
    await page.context().close();
  }

  // ------------------------------------------ public site is untouched
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const requested = [];
    page.on('request', (r) => requested.push(r.url()));
    await page.goto(SITE);
    await page.waitForSelector('.tile');
    check('public site does not load any admin code', !requested.some((u) => /AdminApp/.test(u)));
    check('public site never contacts GitHub', !requested.some((u) => u.includes('api.github.com')));
    await context.close();
  }

  check('no console errors / CSP violations', consoleErrors.length === 0, consoleErrors.slice(0, 4).join(' | '));
  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();
