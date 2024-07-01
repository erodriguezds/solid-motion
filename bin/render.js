import puppeteer from 'puppeteer-core';
import { readdir, unlink } from "fs/promises"
import { promisify } from "util"
import { exec as execSync } from "child_process";

const exec = promisify(execSync);

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
  const totalFrames = result.totalFrames;
  const screenshotPrefix = `screenshot-${Date.now()}`;
  console.log("Starting...");
  for(let i = 0; i < totalFrames; i++){
    console.log(`\rProcessing frame ${i + 1}/${totalFrames}`);
    await page.goto(`http://localhost:3001/?frame=${i}`);
    // Capture screenshot
    await page.screenshot({
      path: `output/screenshot-${i.toString().padStart(5, "0")}.png`,
    });
  }

  console.log("Creating video...");
  const { stdout, stderr } = await exec('ffmpeg -framerate 30 -i output/screenshot-%05d.png -pix_fmt yuv420p -r 30 output/video.mp4');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);

  // delete files
  const path = './output/'
  let regex = /[.]png$/
  const files = await readdir(path);
  const pngFiles = files.filter(file => regex.test(file)).forEach(fileName => {
    console.log("Deleting screenshot: ", fileName);
    unlink(path + fileName);
  });


  // Close the browser instance
  await browser.close();
}

main();
