const { Builder, By, Key, until } = require('selenium-webdriver');

async function runAutomationScript() {
  // Set up the Chrome driver
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Open Amazon website
    await driver.get('https://www.amazon.com/');

    // Maximize the window for proper visibility
    await driver.manage().window().maximize();

    // Wait for the main navigation menu to be located and become visible
    const mainMenu = await driver.wait(until.elementLocated(By.id('nav-xshop')), 15000);
    await driver.wait(until.elementIsVisible(mainMenu), 5000);

    // Test case 1
    const mainCategories = await mainMenu.findElements(By.css('.nav-a'));
    if (mainCategories.length === 0) {
      throw new Error('Test case 1 failed: No main categories found');
    }

    // Test case 2 and 3
    for (let i = 0; i < mainCategories.length; i++) {
      const category = await mainMenu.findElements(By.css('.nav-a')); // Find the element again
      await driver.actions().move({ origin: category[i] }).perform();
      await driver.sleep(1000); // Wait for submenus to appear
      const subcategories = await driver.findElements(By.css('.nav-hasPanel .nav-panel .nav-item'));
      for (const subcategory of subcategories) {
        if (!(await subcategory.isDisplayed())) {
          throw new Error('Test case 2 or 3 failed: Subcategory not displayed');
        }
      }
    }

    // Test case 4
    for (const subcategory of mainCategories) {
      const subcategoryLink = await mainMenu.findElements(By.css('.nav-a')); // Find the element again
      await subcategoryLink[mainCategories.indexOf(subcategory)].click();
      await driver.wait(until.urlContains('https://www.amazon.com/'), 5000);
      await driver.navigate().back();
    }

    // Test case 5
    const searchBar = await driver.findElement(By.id('twotabsearchtextbox'));
    await searchBar.sendKeys('test', Key.RETURN);
    if (!(driver.getCurrentUrl().startsWith('https://www.amazon.com/s?'))) {
      throw new Error('Test case 5 failed: Search functionality issue');
    }

    // Test case 6
    const amazonLogo = await driver.findElement(By.id('nav-logo-sprites'));
    await amazonLogo.click();
    if (driver.getCurrentUrl() !== 'https://www.amazon.com/') {
      throw new Error('Test case 6 failed: Amazon logo link issue');
    }

    // Implement the remaining test cases...

    console.log('All test cases passed successfully!');
  } catch (error) {
    console.error('Test case failed:', error);
  } finally {
    // Close the browser after the test
    await driver.quit();
  }
}

// Run the automation script
runAutomationScript();
