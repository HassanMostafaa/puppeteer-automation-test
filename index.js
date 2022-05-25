const path = require("path").dirname(__filename);
const puppeteer = require("puppeteer");
const prompt = require("prompt-sync")({ sigint: true });

const formatedDate = () => {
  // because for some reason const d = new Date("2015-03-25"); didnt work
  const d = new Date();
  const month = d.getMonth();
  const year = d.getFullYear();
  const day = d.getDate();
  const fullDate = `${day}-${month + 1}-${year}`;
  return fullDate;
};

(async function takeScreenshot() {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1080 },
      headless: true,
    });
    console.log("LOADING... This process might take a few seconds");
    const page = await browser.newPage();
    await page.goto("https://my.te.eg/user/login");
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    // for automatically enter a fixed account replace next line with landline num and pass in a string
    const landlineNum = prompt("Landline Number: ");
    const landlinePass = prompt("Landline Password: ", { echo: "*" });
    //const landlinePass = prompt.hide("Landline Password: "); for extra security
    // const landlineNum = "landline number";
    // const landlinePass = "landline password";

    await page.type("#login-service-number-et", ` ${landlineNum}`, {
      delay: 10,
    });
    await page.type("#login-password-et", `${landlinePass}`, { delay: 10 });
    await page.click("#login-login-btn");
    // check for a way to wait for page to load insted of 5 seconds
    await page.waitForTimeout(5000);
    await page.screenshot({
      path: `./screen-shots/${formatedDate()}.png`,
    });
    await browser.close();
    //open screen-shots folder !
    require("child_process").exec(`explorer.exe "${path}\\screen-shots"`);
    console.log(
      `DONE \nScreenshot saved to ./screen-shots Folder with today's date ${formatedDate()}.png`
    );
  } catch (error) {
    console.error(error);
  }
})();
