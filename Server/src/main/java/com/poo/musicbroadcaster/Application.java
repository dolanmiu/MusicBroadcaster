package com.poo.musicbroadcaster;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

import com.poo.musicbroadcaster.factory.IRoomFactory;
import com.poo.musicbroadcaster.factory.RoomFactory;

@ComponentScan
@EnableAutoConfiguration
public class Application {
	
	@Autowired
	SimpMessagingTemplate simpMessagingTemplate;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public IRoomFactory getRoomFactory() {
		return new RoomFactory(simpMessagingTemplate, getTaskScheduler());
	}

	@Bean(name = "taskScheduler")
	public TaskScheduler getTaskScheduler() {
		return new ConcurrentTaskScheduler();
	}
}