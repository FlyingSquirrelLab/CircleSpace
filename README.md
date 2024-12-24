# CircleSpace

CircleSpace is an innovative university club platform designed to centralize and simplify the process of discovering and managing club-related information. It integrates advanced web crawling, real-time updates, and a user-friendly interface to enhance student engagement and foster a vibrant university club ecosystem.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
    - [Main Features](#main-features)
    - [Technical Features](#technical-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Challenges](#challenges)
- [Future Improvements](#future-improvements)
- [References](#references)

## Overview
University clubs play a crucial role in student life, but finding reliable and comprehensive information about them is often a challenge. Existing platforms like "Everytime" and "CampusPick" provide fragmented details, leading to inefficiencies for students.

CircleSpace solves these issues by:
- Systematically categorizing clubs by type and activity field.
- Providing real-time updates through web crawling and integration with social platforms.
- Offering a secure and intuitive platform for students to explore, join, and engage with clubs.

## Features

### Main Features
- **Club Discovery**: Browse clubs by type, category, and university affiliation.
- **Club Details**: View recruitment schedules, membership fees, contact information, and reviews.
- **Application Management**: Apply to clubs with a personalized introduction and manage applications.
- **Real-Time Updates**: Retrieve promotional posts daily via web crawling.
- **Personalized Experience**: Recommendations based on user preferences and favorite clubs.

### Technical Features
- **Secure Login**: JWT-based authentication with university email verification.
- **Web Crawling**: Automated daily updates using Selenium.
- **Efficient API Design**: Token-based AxiosInstance for smooth frontend-backend communication.
- **Deployment**: Hosted on AWS EC2 with CI/CD pipeline using GitHub Actions.

## Technology Stack
- **Frontend**: React (Vite-based), Axios, Figma for UI/UX design.
- **Backend**: Spring Boot, Spring Security, Spring Data JPA.
- **Database**: MySQL (AWS RDS).
- **Web Crawling**: Selenium with ChromeDriver.
- **Deployment**: AWS EC2 with Nginx and SSL configuration.

## Architecture
CircleSpace follows a full-stack architecture with the following key components:
- **Frontend**: SPA built with React for fast and responsive user experiences.
- **Backend**: Spring Boot for business logic and API management.
- **Database**: Efficiently structured MySQL database hosted on AWS RDS.
- **Web Crawling**: Selenium-based daily scraping of promotional posts.
- **Deployment**: CI/CD pipeline using GitHub Actions for seamless updates.

```

## Installation

### Prerequisites
- Java 21+ (Temurin recommended)
- Node.js 18+ and npm
- MySQL database
- AWS account for RDS and EC2 setup

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/FlyingSquirrelLab/TeamE.git
   cd TeamE
   ```

2. **Setup Backend**:
    - Update `src/main/resources/application.properties` or `.env` with database and AWS credentials.
    - Build the backend:
      ```bash
      ./gradlew build
      ```

3. **Setup Frontend**:
    - Navigate to the `frontend` folder:
      ```bash
      cd frontend
      npm install
      npm run build
      ```

4. **Deploy**:
    - Use the provided CI/CD pipeline or manually copy the `.jar` file to the server.
    - Deploy the application on AWS EC2 and configure Nginx for reverse proxy.

## Usage
1. Start the application:
   ```bash
   java -jar backend/build/libs/circlespace.jar
   ```
2. Access the platform in your browser at `http://localhost:8080`

## Challenges
- **Web Crawling**: Handling dynamic web elements and session cookies.
- **Deployment**: Transitioning from Elastic Beanstalk to EC2 for stable crawling operations.
- **Scalability**: Supporting multiple universities while managing authentication tokens securely.

## Future Improvements
- Broaden integration with additional university platforms.
- Automate moderation for club registrations to enhance scalability.
- Expand support for inter-university clubs and decentralized management.

## References
1. [Selenium Documentation](https://www.selenium.dev/documentation/)
2. [React and Vite Documentation](https://vitejs.dev/)
3. [Spring Boot Documentation](https://spring.io/projects/spring-boot)

## Preview
![image](https://github.com/user-attachments/assets/3af15b9d-e688-429b-b45b-583d9795f7ff)
![image](https://github.com/user-attachments/assets/8c27d589-f57f-4f9b-b0c5-ccfc0b433704)
![image](https://github.com/user-attachments/assets/20b05077-22a7-4fbf-921a-3a0c4309bfad)

![image](https://github.com/user-attachments/assets/3a7d0c24-3c49-4f3b-8b72-826e05c70634)
![image](https://github.com/user-attachments/assets/c05993c3-0afd-46dd-a898-18724d668c39)

![image](https://github.com/user-attachments/assets/ce8fb1f8-6c32-43fb-9ea2-05029c4758d6)


![image](https://github.com/user-attachments/assets/b4e5f2ec-025c-4bc5-884b-a434ca19a339)



![image](https://github.com/user-attachments/assets/0f71bdc8-987b-44cd-94fc-ea8dc7d61946)
![image](https://github.com/user-attachments/assets/fca93dc8-e542-4e18-a528-79537d0bc9c7)
![image](https://github.com/user-attachments/assets/72f8df70-be1b-49e4-8cdb-0aadefa2595c)




