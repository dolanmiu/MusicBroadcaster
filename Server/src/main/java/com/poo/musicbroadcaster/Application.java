package com.poo.musicbroadcaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import com.poo.musicbroadcaster.factory.IRoomFactory;
import com.poo.musicbroadcaster.factory.RoomFactory;

@ComponentScan
@EnableAutoConfiguration
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	// or @Bean(name = "nameOfYourBean")
	public IRoomFactory getRoomFactory() {
		return new RoomFactory();
	}
	
	@Bean
	public RoomService getRoomService() {
		return new RoomService();
	}
	
	@Bean
	public TaskScheduler getTaskScheduler() {
		return new ThreadPoolTaskScheduler();
	}
}