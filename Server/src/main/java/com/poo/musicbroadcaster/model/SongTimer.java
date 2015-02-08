package com.poo.musicbroadcaster.model;

import java.util.Date;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class SongTimer {
	ScheduledExecutorService scheduledExecutorService;
	ScheduledFuture<?> scheduledFuture;
	
	private Date lastPlayTime;
	private Media media;
	private long remainingTime;

	public SongTimer() {
		this.scheduledExecutorService = Executors.newScheduledThreadPool(5);
	}
	
	public void setMedia(Media media) {
		this.media = media;
		this.remainingTime = media.getLength();
	}

	public void play() throws InterruptedException, ExecutionException {
		this.lastPlayTime = new Date();

		this.scheduledFuture = this.scheduledExecutorService.schedule(() -> {
			System.out.println("Executed!");
		}, this.remainingTime, TimeUnit.MILLISECONDS);
	}


	public void pause() {
		long pauseTime = new Date().getTime();
		long timeElapsed = pauseTime - this.lastPlayTime.getTime();
		this.remainingTime = media.getLength() - timeElapsed;
		
		this.scheduledFuture.cancel(false);
	}
}
