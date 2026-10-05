const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  // Set the cookie
  await page.setCookie({
    name: 'ruangkode_session',
    value: 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImNtdXYxZTBpbzAwMDIwa3N5N2lieW96d28iLCJlbWFpbCI6InRlc3Q1QHRlc3QuY29tIiwibmFtZSI6IlRlc3QgVXNlciAyIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3OTExOTE4NjYsImV4cCI6MTc5MTc5NjY2Nn0.j2OkQ6TF_kkrWsbCIgnINmidpR3j0NhaV3oTY3zJxTI',
    domain: 'localhost',
    path: '/'
  });

  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  
  await browser.close();
})();
