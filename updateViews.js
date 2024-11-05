const puppeteer = require('puppeteer');

async function fetchViewCount() {
  const url = 'https://www.youtube.com/watch?v=_LvFFNKtUn8';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });


  const viewCount = await page.evaluate(() => {
    const viewElement = document.querySelector('span.view-count');
    return viewElement ? viewElement.innerText : null;
  });

  await browser.close();
  return viewCount ? parseInt(viewCount.replace(/[^0-9]/g, '')) : 0;
}

async function updateTitle() {
  let viewCount = await fetchViewCount();
  console.log(`Current view count: ${viewCount}`);


  setInterval(async () => {
    viewCount = await fetchViewCount();
    console.log(`Updating view count: ${viewCount}`);
    process.title = `Video Views: ${viewCount}`;
  }, 20000);
}

updateTitle();
