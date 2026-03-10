const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  await page.goto('http://localhost:5173/classroom?room=abc1', { waitUntil: 'networkidle2' });
  
  // click join
  try {
    await page.type('input[placeholder="e.g. John Doe"]', 'TestStudent');
    await page.click('button.btn-primary');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Navigation failed:', e.message);
  }
  
  await browser.close();
})();
