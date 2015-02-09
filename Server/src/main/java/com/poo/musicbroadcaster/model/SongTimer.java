package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class SongTimer implements ISongTimer {
	ScheduledExecutorService scheduledExecutorService;
	ScheduledFuture<?> scheduledFuture;

	private long lastPlayTime;
	private Media media;
	private long remainingTime;

	private Runnable task;

	public SongTimer() {
		this.scheduledExecutorService = Executors.newScheduledThreadPool(5);
	}

	@Override
	public void setMedia(Media media, Runnable task) {
		this.media = media;
		this.task = task;
		this.remainingTime = media.getLength();
	}

	@Override
	public boolean play() throws InterruptedException, ExecutionException {
		if (this.media == null) {
			return false;
		}

		if (this.scheduledFuture != null) {
			this.scheduledFuture.cancel(false);
		}
		
		this.lastPlayTime = System.currentTimeMillis();
		System.out.println("Playing with this much remaining: " + this.remainingTime);
		this.scheduledFuture = this.scheduledExecutorService.schedule(this.task, this.remainingTime, TimeUnit.MILLISECONDS);
		return true;
	}

	@Override
	public boolean pause() {
		if (this.scheduledFuture  == null || this.media == null) {
			return false;
		}
		
		this.scheduledFuture.cancel(false);
		long pauseTime = System.currentTimeMillis();
		long timeElapsed = pauseTime - this.lastPlayTime;
		this.remainingTime = this.media.getLength() - timeElapsed;
		return true;
	}

	@Override
	public boolean seek(long time) {
		if (this.media == null) {
			return false;
		}
		
		long tempTime = this.media.getLength() - time;
		if (tempTime < 0 || time < 0) {
			return false;
		}
		
		this.remainingTime = tempTime;
		if (this.scheduledFuture != null) {
			this.scheduledFuture.cancel(false);
		}
		this.scheduledFuture = this.scheduledExecutorService.schedule(this.task, this.remainingTime, TimeUnit.MILLISECONDS);
		System.out.println("Seeked with this much remaining: " + this.remainingTime);
		return true;
	}
}
