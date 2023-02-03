import puppeteer from "puppeteer";
import {expect, jest, test} from '@jest/globals';

test("Headless test", async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 10});
    const page = await browser.newPage();
    await page.goto("http://localhost:8080/login");
    await page.waitForSelector("#login-field");
    await page.type('#login-field', "Максим Желнин", {delay: 10});
    await page.click('#save-but');

    await page.waitForSelector('#user-balance');
    await page.waitForSelector('#AAPLbuy');
    const beforeBalance = parseInt(await page.$eval("#user-balance", e => e.innerHTML));
    await page.type('#AAPLbuy', "5", {delay: 1000});
    await page.click('#AAPLbuyBut');
    const afterBalance = parseInt(await page.$eval("#user-balance", e => e.innerHTML));
    console.log(afterBalance + ' ' + beforeBalance);
    expect(afterBalance < beforeBalance).toBe(true);
}, 30000);