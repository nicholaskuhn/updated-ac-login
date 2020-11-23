import static org.junit.Assert.*;
import org.junit.*;
import org.openqa.selenium.By;
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
		driver.findElement(By.id("details-button")).click();
		driver.findElement(By.id("proceed-link")).click();
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

	@Test
	public void testUserLogin() {
		sleepThread(2000);
		driver.findElement(By.id("User1")).click();
		sleepThread(500);
		assertEquals("Successfully logged in!", getElementByEndingId("loginText").getText());
		sleepThread(5000);
		driver.findElement(By.id("User2")).click();
		sleepThread(500);
		assertEquals("Sorry, Nick is still logged in", getElementByEndingId("loginText").getText());
		sleepThread(5000);
		driver.findElement(By.id("User1")).click();
		sleepThread(500);
		assertEquals("Successfully logged out!", getElementByEndingId("loginText").getText());
		sleepThread(2500);
	}
	
	@Test
	public void testMuseumTab() {
		
	}

	public WebElement getElementByEndingId(String id) {
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
