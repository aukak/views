const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

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

app.get('/views', async (req, res) => {
  try {
    const viewCount = await fetchViewCount();
    res.json({ views: viewCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch view count' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
