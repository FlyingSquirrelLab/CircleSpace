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
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.io.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Log4j2
@Service
public class PromoService {
  @Lazy
  private WebDriver driver;
  private String url = "https://everytime.kr/418760";

  public void runSeleniumTask() {try (BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/output.txt", true))) {
    driver = new ChromeDriver();
    try {
      driver.get("https://everytime.kr");

      // 쿠키가 있는 경우 동아리 페이지로 이동
      File cookieFile = new File("src/main/resources/cookies.data");
      if (!cookieFile.exists()) {
        cookieFile.createNewFile();
      }

      loadCookies(driver, cookieFile);
      driver.get("https://everytime.kr/418760");
      Thread.sleep(1000);
      // 쿠키가 없는 경우 로그인 페이지로 이동
      if (!driver.getCurrentUrl().equals("https://everytime.kr/418760")) {
        // 로그인 폼 자동화
//        WebElement idField = driver.findElement(By.name("id")); // 아이디 입력 필드 찾기
//        WebElement passwordField = driver.findElement(By.name("password")); // 비밀번호 입력 필드 찾기
//        idField.sendKeys(""); // 사용자 아이디 입력
//        passwordField.sendKeys(""); // 사용자 비밀번호 입력
//        WebElement submitButton = driver.findElement(By.cssSelector("input[type='submit']")); // 제출 버튼 찾기
//        submitButton.click(); // 제출 버튼 클릭

        // 쿠키 없을 시 최초 1회 수동 로그인(30초 이내에 진행)
        Wait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(30))
                .pollingEvery(Duration.ofSeconds(1));

        wait.until(ExpectedConditions.urlToBe("https://everytime.kr/418760"));

        saveCookies(driver, cookieFile);
      }



      List<WebElement> articleLinks = driver.findElements(By.cssSelector("a.article"));


      for (WebElement articleLink : articleLinks) {
        String linkHref = articleLink.getAttribute("href");
        if (!linkHref.startsWith(url)) {
          continue;
        }

        try {
          String articleUrl = articleLink.getAttribute("href");
          driver.get(articleUrl);

          List<WebElement> paragraphTitle = driver.findElements(By.cssSelector("h2.large"));
          List<WebElement> paragraphBody = driver.findElements(By.cssSelector("p.large"));

          String title = paragraphTitle.isEmpty() ? "No title found"
                  : paragraphTitle.get(0).getText().replaceAll("[^\\p{L}\\p{N}\\p{P}\\s]", "");

          StringBuilder body = new StringBuilder();
          for (WebElement paragraph : paragraphBody) {
            String filteredText = paragraph.getText().replaceAll("[^\\p{L}\\p{N}\\p{P}\\s]", "");
            body.append(filteredText).append("\n");
          }

          writer.write("Title: " + title + "\n");
          writer.write("Body:\n" + body + "\n");
          writer.write("--------------------------------------------------\n");


          driver.navigate().back();

        } catch (Exception innerEx) {
          log.info("Error while processing article: " + innerEx.getMessage());
        }
      }
      log.info("Successfully parsed data at " +
              LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      driver.quit();
    }
  } catch (IOException e) {
    e.printStackTrace();
  }
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
