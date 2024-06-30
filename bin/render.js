import puppeteer from 'puppeteer-core';

const VIEWPORTS = {
    IPHONE_11: {
        width: 414,
        height: 896,
    }
}

// Launch the browser and open a new blank page
async function main(){
    // Creating a browser instance
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome",
});

  // Creating a new page
  const page = await browser.newPage();

  // Adjusting width and height of the viewport
  await page.setViewport(VIEWPORTS.IPHONE_11);

  //const url = 'https://dev.to/makepad/use-emojis-in-your-commit-messages-1lag';
  const url = 'http://localhost:3001/?frame=-1';

  // Open URL in current page
  await page.goto(url);

  const result = await page.evaluate(() => {
    return window["COMPOSITION"];
  });
  console.log("Composition meta: ", result);

  // Capture screenshot
  await page.screenshot({
    path: 'demo.png',
  });

  // Close the browser instance
  await browser.close();
}

main();
