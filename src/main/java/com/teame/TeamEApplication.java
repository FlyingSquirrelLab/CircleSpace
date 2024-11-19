package com.teame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TeamEApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeamEApplication.class, args);
	}

}
