import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumClass {
	static WebDriver driver;

	@BeforeClass
	public static void initDriver() {
		String projectPath = System.getProperty("user.dir");
		System.setProperty("webdriver.chrome.driver", projectPath + "/drivers/chromedriver/chromedriver.exe");
		driver = new ChromeDriver();
		driver.get("https://nearizpe.heliohost.us/");
		getElementByEndingId("details-button").click();
		getElementByEndingId("proceed-link").click();
	}

	@AfterClass
	public static void tearDown() {
		driver.close();
		driver.quit();
	}

	/*
	 * Verify that nobody is logged in, all fields are empty, that the museum tab is
	 * selected, and that the fossil radio button is selected
	 */
	@Test
	public void testDefaultLayout() {
		assertEquals("rgba(255, 255, 255, 1)", getElementByEndingId("User1").getCssValue("background-color"));
		assertEquals("rgba(255, 255, 255, 1)", getElementByEndingId("User2").getCssValue("background-color"));
		assertEquals("true", getElementByEndingId("fossilRadio").getAttribute("checked"));
		assertEquals(null, getElementByEndingId("bugRadio").getAttribute("checked"));
		assertEquals(null, getElementByEndingId("fishRadio").getAttribute("checked"));
		assertEquals(null, getElementByEndingId("paintingRadio").getAttribute("checked"));
		assertEquals("", getElementByEndingId("itemNameBox").getAttribute("value"));
		assertTrue(attributeContainsText("museumTab", "class", "ui-state-active"));
		assertFalse(attributeContainsText("calendarTab", "class", "ui-state-active"));
		assertFalse(attributeContainsText("fileTab", "class", "ui-state-active"));
		sleepThread(8000);
		getElementByEndingId("calendarTab").click();
		assertEquals("", getElementByEndingId("calendarDate").getAttribute("value"));
		sleepThread(3000);
		getElementByEndingId("fileTab").click();
		assertEquals("", getElementByEndingId("fileToUpload").getAttribute("value"));
		sleepThread(3000);
	}

	/*
	 * Test if you can login/logout as a user and if it appropriately locks other
	 * users out from logging in while someone else is logged in
	 */
	@Test
	public void testUserLogin() {
		sleepThread(2000);
		getElementByEndingId("User1").click();
		sleepThread(500);
		assertEquals("Successfully logged in!", getElementByEndingId("loginText").getText());
		sleepThread(5000);
		getElementByEndingId("User2").click();
		sleepThread(500);
		assertEquals("Sorry, Nick is still logged in", getElementByEndingId("loginText").getText());
		sleepThread(5000);
		getElementByEndingId("User1").click();
		sleepThread(500);
		assertEquals("Successfully logged out!", getElementByEndingId("loginText").getText());
		sleepThread(2500);
	}

	/*
	 * Tests item insertion and auto completes
	 */
	@Test
	public void testMuseumTab() {
		// getElementByEndingId("itemNameBox").click();
		sleepThread(2000);
		getElementByEndingId("User1").click();
		sleepThread(2000);

		getElementByEndingId("itemNameBox").sendKeys("testFossil");
		sleepThread(1000);
		getElementByEndingId("addItemBtn").click();
		sleepThread(1000);
		getElementByEndingId("bugRadio").click();
		sleepThread(1000);
		getElementByEndingId("itemNameBox").clear();
		sleepThread(3000);

		getElementByEndingId("itemNameBox").sendKeys("testBug");
		sleepThread(1000);
		getElementByEndingId("addItemBtn").click();
		sleepThread(1000);
		getElementByEndingId("fishRadio").click();
		sleepThread(1000);
		getElementByEndingId("itemNameBox").clear();
		sleepThread(3000);

		getElementByEndingId("itemNameBox").sendKeys("testFish");
		sleepThread(1000);
		getElementByEndingId("addItemBtn").click();
		sleepThread(1000);
		getElementByEndingId("paintingRadio").click();
		sleepThread(1000);
		getElementByEndingId("itemNameBox").clear();
		sleepThread(3000);

		getElementByEndingId("itemNameBox").sendKeys("testPainting");
		sleepThread(1000);
		getElementByEndingId("addItemBtn").click();
		sleepThread(1000);
		getElementByEndingId("itemNameBox").clear();
		sleepThread(3000);

		getElementByEndingId("itemNameBox").sendKeys("Test");
		sleepThread(2000);
		assertTrue(doesTextExistInTable("Testfossil"));
		assertTrue(doesTextExistInTable("Testbug"));
		assertTrue(doesTextExistInTable("Testfish"));
		assertTrue(doesTextExistInTable("Testpainting"));

		getElementByEndingId("User1").click();
	}

	@Test
	public void testCalendarTab() {

		sleepThread(2000);
		getElementByEndingId("User1").click();
		sleepThread(2000);

		getElementByEndingId("calendarTab").click();
		sleepThread(2000);
		getElementByEndingId("calendarDate").sendKeys("11/25/2020");
		sleepThread(1000);
		getElementByEndingId("calendarDate").sendKeys(Keys.TAB);
		sleepThread(1000);
		getElementByEndingId("openEventBtn").sendKeys(Keys.ENTER);
		sleepThread(1000);
		getElementByEndingId("eventNameBox").sendKeys("Test Event");
		sleepThread(1000);
		getElementByEndingId("eventDescriptionBox").sendKeys("Test Description Redd");
		sleepThread(1000);
		getElementByEndingId("addEventBtn").click();
		sleepThread(3000);

		assertEquals("Test Event", driver.findElement(By.xpath("//*[@id=\"calendarEvents\"]/div/h3")).getText());
		assertEquals("https://nearizpe.heliohost.us/images/redd.png",
				driver.findElement(By.xpath("//*[@id=\"calendarEvents\"]/div/img")).getAttribute("src"));
		assertEquals("Test Description Redd",
				driver.findElement(By.xpath("//*[@id=\"calendarEvents\"]/div/p")).getText());

		getElementByEndingId("User1").click();
		sleepThread(1000);
	}

	public boolean doesTextExistInTable(String text) {
		WebElement table = getElementByEndingId("museumResults");
		List<WebElement> tableDatas = table.findElements(By.tagName("td"));
		for (WebElement data : tableDatas) {
			if (data.getText().equals(text))
				return true;
		}

		return false;
	}

	public static WebElement getElementByEndingId(String id) {
		return driver.findElement(By.id(id));
	}

	public boolean attributeContainsText(String id, String attribute, String text) {
		String[] values = getElementByEndingId(id).getAttribute(attribute).split("\\s");
		for (String s : values) {
			if (s.equals(text))
				return true;
		}
		return false;
	}

	public void sleepThread(int millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
