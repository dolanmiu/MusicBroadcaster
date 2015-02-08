package com.poo.musicbroadcaster.model;

import java.util.TimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class SongEndTimerTask extends TimerTask {

	private String roomId;
	
	@Autowired 
	private SimpMessagingTemplate simpMessagingTemplate;
	
	public SongEndTimerTask(String roomId) {
		this.roomId = roomId;
	}
	
	@Override
	public void run() {
    	System.out.println("Song ended");
    	//simpMessagingTemplate.convertAndSend("/room/" + this.roomId, null);
	}

}
