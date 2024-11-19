package com.teame.promo;

import lombok.extern.log4j.Log4j2;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
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
public class PromoDataParser {
    @Lazy
    private WebDriver driver;
    private String url = "https://everytime.kr/418760";
    private final PromoRepository promoRepository;

    @Autowired
    public PromoDataParser(PromoRepository promoRepository) {
        this.promoRepository = promoRepository;
    }

    /*
          ┌───────────── 초 (0 - 59)
          │ ┌───────────── 분 (0 - 59)
          │ │ ┌───────────── 시간 (0 - 23)
          │ │ │ ┌───────────── 일 (1 - 31)
          │ │ │ │ ┌───────────── 월 (1 - 12)
          │ │ │ │ │ ┌───────────── 요일 (0 - 7) (일요일=0 또는 7)
          │ │ │ │ │ │
          * * * * * *
       */
//  @Scheduled(cron = "0 0 3 * * ?", zone = "Asia/Seoul")
    public void runSeleniumTask() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("src/main/resources/output.txt", true))) {
            initializeDriver();

            int maxPage = 10;
            int cnt=0;
            outerLoop:
            for(int page=1; page<=maxPage; page++){
                navigateToClubPage(url+"/p/"+page);
                List<WebElement> articleLinks = driver.findElements(By.cssSelector("a.article"));
                for (WebElement articleLink : articleLinks) {
                    String linkHref = articleLink.getAttribute("href");
                    if (linkHref != null && linkHref.startsWith(url)) {
                        if(!parseArticle(linkHref, writer)){
                            log.info("Reached the most recent data in the database.");
                            break outerLoop;
                        }
                        cnt++;
                    }
                }
            }


            log.info("Successfully " +cnt +" parsed data at " +
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
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("Accept-Language=en-US,en;q=0.9");
        options.addArguments("Referer=https://everytime.kr");
        driver = new ChromeDriver(options);

        driver.get("https://everytime.kr");

        String resourcePath = "cookies.data";
        try (InputStream resourceStream = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            if (resourceStream == null) {
                log.info("Resource not found in classpath: " + resourcePath);
            } else {
                loadCookiesFromStream(driver, resourceStream);
            }
        } catch (Exception e) {
            log.info("Error loading cookies: " + e.getMessage());
        }

        driver.get(url);
        try {
            Thread.sleep(2000);
            if (!driver.getCurrentUrl().equals(url)) {
                Wait<WebDriver> wait = new FluentWait<>(driver)
                        .withTimeout(Duration.ofSeconds(30))
                        .pollingEvery(Duration.ofSeconds(1));
                wait.until(ExpectedConditions.urlToBe(url));
                saveCookies(driver, new File("src/main/resources/cookies.data"));
            }
        } catch (Exception e) {
            log.info("Error saving cookies: " + e.getMessage());
        }
    }

    private void navigateToClubPage(String pageUrl) {
        try {
            driver.get(pageUrl);
            Wait<WebDriver> wait = new FluentWait<>(driver)
                    .withTimeout(Duration.ofSeconds(30))
                    .pollingEvery(Duration.ofSeconds(1))
                    .ignoring(NoSuchElementException.class);

            wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("a.article")));
        } catch (Exception e) {
            log.info("Error navigating to club page: " + e.getMessage());
        }
    }

    private boolean parseArticle(String articleUrl, BufferedWriter writer) {
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
                String title = paragraphTitle.get(0).getText();
                String dateTime = paragraphTime.get(0).getText();
                int year = LocalDate.now().getYear();
                LocalDateTime postedTime;

                try {
                    if (dateTime.contains("/")) {
                        // 날짜와 시간이 함께 있는 형식 (예: "11/06 08:44")
                        postedTime = LocalDateTime.of(
                                year,
                                Integer.parseInt(dateTime.substring(0, 2)),  // 월
                                Integer.parseInt(dateTime.substring(3, 5)),  // 일
                                Integer.parseInt(dateTime.substring(6, 8)),  // 시
                                Integer.parseInt(dateTime.substring(9, 11))  // 분
                        );
                    } else if (dateTime.contains("분 전")) {
                        // "XX분 전" 형식 처리
                        int minutesAgo = Integer.parseInt(dateTime.replace("분 전", "").trim());
                        postedTime = LocalDateTime.now().minusMinutes(minutesAgo);
                    } else if (dateTime.contains("방금")) {
                        // "방금"인 경우 현재 시간으로 설정
                        postedTime = LocalDateTime.now();
                    } else {
                        // 예상하지 못한 형식인 경우 로그를 남기고 현재 시간으로 처리
                        log.info("Unknown date format: " + dateTime);
                        postedTime = LocalDateTime.now();
                    }
                } catch (Exception e) {
                    log.info("Error parsing dateTime: " + dateTime + ", " + e.getMessage());
                    postedTime = LocalDateTime.now(); // 오류 발생 시 현재 시간으로 처리
                }


                StringBuilder body = new StringBuilder();
                for (WebElement paragraph : paragraphBody) {
                    String filteredText = paragraph.getText();
                    body.append(filteredText).append("\n");
                }
                if (checkInDB(title, postedTime)) {
                    return false;
                }
//                writeArticleDataToTextFile(writer, title, postedTime, body.toString());
                if(!checkDuplicate(title, body.toString())) {
                    writeArticleDataToDB(writer, title, postedTime, body.toString());
                }
            }

            driver.navigate().back();
        } catch (Exception e) {
            log.info("Error while processing article: " + e.getMessage());
        }
        return true;
    }

    // text file로 저장. DB에 넣기 전, 디버깅으로 사용
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


    // DB 중복 데이터 여부 확인
    private boolean checkDuplicate(String title, String body){
        return promoRepository.existsByTitleANDBody(title, body);
    }


    private boolean checkInDB(String title, LocalDateTime postedTime){
        int year = postedTime.getYear();
        int month = postedTime.getMonthValue();
        int day = postedTime.getDayOfMonth();
        return promoRepository.existsByTitleAndDate(title, year, month, day);
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

    private static void loadCookiesFromStream(WebDriver driver, InputStream inputStream) throws IOException {
        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                String[] cookieDetails = line.split(";");
                Cookie.Builder cookieBuilder = new Cookie.Builder(cookieDetails[0], cookieDetails[1])
                        .domain(cookieDetails[2])
                        .path(cookieDetails[3])
                        .isSecure(Boolean.parseBoolean(cookieDetails[5]));

//                if (!"null".equals(cookieDetails[4]) && !cookieDetails[4].isEmpty()) {
//                    cookieBuilder.expiresOn(new Date(Long.parseLong(cookieDetails[4])));
//                }
                driver.manage().addCookie(cookieBuilder.build());
            }
        }
    }
}