package com.teame.promo;

import lombok.extern.log4j.Log4j2;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.io.*;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Log4j2
@Service
public class PromoService {
  @Lazy
  private WebDriver driver;
  private String url = "https://everytime.kr/418760";
  private final PromoRepository promoRepository;

  @Autowired
  public PromoService(PromoRepository promoRepository) {
      this.promoRepository = promoRepository;
  }

  public void runSeleniumTask() {
    try (BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/output.txt", true))) {
      initializeDriver();
      navigateToClubPage();

      List<WebElement> articleLinks = driver.findElements(By.cssSelector("a.article"));
      for (WebElement articleLink : articleLinks) {
        String linkHref = articleLink.getAttribute("href");
        if (linkHref != null && linkHref.startsWith(url)) {
          parseArticle(linkHref, writer);
        }
      }
      log.info("Successfully parsed data at " +
              LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    } catch (IOException e) {
      log.info("Error initializing writer: " + e.getMessage());
    } finally {
      if (driver != null) {
        driver.quit();
      }
    }
  }

  private void initializeDriver() {
    driver = new ChromeDriver();
    driver.get("https://everytime.kr");

    File cookieFile = new File("src/main/resources/cookies.data");
    try {
      if (!cookieFile.exists()) {
        cookieFile.createNewFile();
      }
      loadCookies(driver, cookieFile);
    } catch (IOException e) {
      log.info("Error loading cookies: " + e.getMessage());
    }
  }

  private void navigateToClubPage() {
    driver.get(url);
    try {
      Thread.sleep(1000);
      if (!driver.getCurrentUrl().equals(url)) {
        Wait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(30))
                .pollingEvery(Duration.ofSeconds(1));
        wait.until(ExpectedConditions.urlToBe(url));
        saveCookies(driver, new File("src/main/resources/cookies.data"));
      }
    } catch (Exception e) {
      log.info("Error navigating to club page: " + e.getMessage());
    }
  }

  private void parseArticle(String articleUrl, BufferedWriter writer) {
    try {
      driver.get(articleUrl);

      Wait<WebDriver> wait = new FluentWait<>(driver)
              .withTimeout(Duration.ofSeconds(10))
              .pollingEvery(Duration.ofMillis(500))
              .ignoring(NoSuchElementException.class);

      List<WebElement> paragraphBody = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("p.large")));
      List<WebElement> paragraphTitle = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("h2.large")));
      List<WebElement> paragraphTime = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("div.profile time.large")));

      if (!paragraphTitle.isEmpty() && !paragraphTime.isEmpty() && !paragraphBody.isEmpty()) {
        String title = paragraphTitle.get(0).getText().replaceAll("[^\\p{L}\\p{N}\\p{P}\\s]", "");
        String dateTime = paragraphTime.get(0).getText();
        int year = LocalDate.now().getYear();
        LocalDateTime postedTime = LocalDateTime.of(
                year,
                Integer.parseInt(dateTime.substring(0, 2)),  // 월
                Integer.parseInt(dateTime.substring(3, 5)),  // 일
                Integer.parseInt(dateTime.substring(6, 8)),  // 시
                Integer.parseInt(dateTime.substring(9, 11))  // 분
        );

        StringBuilder body = new StringBuilder();
        for (WebElement paragraph : paragraphBody) {
          String filteredText = paragraph.getText().replaceAll("[^\\p{L}\\p{N}\\p{P}\\s]", "");
          body.append(filteredText).append("\n");
        }
//        writeArticleDataToTextFile(writer, title, postedTime, body.toString());
        writeArticleDataToDB(writer, title, postedTime, body.toString());

      }

      driver.navigate().back();
    } catch (Exception e) {
      log.info("Error while processing article: " + e.getMessage());
    }
  }

  private void writeArticleDataToTextFile(BufferedWriter writer, String title, LocalDateTime postedTime, String body) {
    try {
      writer.write("Title: " + title + "\n");
      writer.write("Posted Time: " + postedTime + "\n");
      writer.write("Body:\n" + body + "\n");
      writer.write("--------------------------------------------------\n");
    } catch (IOException e) {
      log.info("Error writing article data: " + e.getMessage());
    }
  }
  private void writeArticleDataToDB(BufferedWriter writer, String title, LocalDateTime postedTime, String body) {
    Promo newPromo = new Promo();
    newPromo.setTitle(title);
    newPromo.setPostedAt(postedTime);
    newPromo.setBody(body);

    promoRepository.save(newPromo);
  }


  // 쿠키 저장 메서드
  private static void saveCookies(WebDriver driver, File file) throws IOException {
    FileWriter fileWriter = new FileWriter(file);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
    Set<Cookie> cookies = driver.manage().getCookies();
    for (Cookie cookie : cookies) {
      bufferedWriter.write(cookie.getName() + ";" + cookie.getValue() + ";" + cookie.getDomain() + ";"
              + cookie.getPath() + ";" + cookie.getExpiry() + ";" + cookie.isSecure());
      bufferedWriter.newLine();
    }
    bufferedWriter.close();
  }

  // 쿠키 로드 메서드
  private static void loadCookies(WebDriver driver, File file) throws IOException {
    FileReader fileReader = new FileReader(file);
    BufferedReader bufferedReader = new BufferedReader(fileReader);
    String line;
    while ((line = bufferedReader.readLine()) != null) {
      String[] cookieDetails = line.split(";");
      Cookie cookie = new Cookie.Builder(cookieDetails[0], cookieDetails[1])
              .domain(cookieDetails[2])
              .path(cookieDetails[3])
              .expiresOn(null) // 만료 날짜를 처리할 필요가 있음
              .isSecure(Boolean.parseBoolean(cookieDetails[5]))
              .build();
      driver.manage().addCookie(cookie);
    }
    bufferedReader.close();
  }
}
