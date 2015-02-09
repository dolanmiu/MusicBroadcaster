package com.poo.musicbroadcaster.model;

import java.util.Objects;
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
	public void play() throws InterruptedException, ExecutionException {
		Objects.requireNonNull(this.task);
		Objects.requireNonNull(this.media);

		this.lastPlayTime = System.currentTimeMillis();
		System.out.println("Playing with this much remaining: " + this.remainingTime);
		this.scheduledFuture = this.scheduledExecutorService.schedule(this.task, this.remainingTime, TimeUnit.MILLISECONDS);
	}

	@Override
	public void pause() {
		this.scheduledFuture.cancel(false);
		long pauseTime = System.currentTimeMillis();
		long timeElapsed = pauseTime - this.lastPlayTime;
		this.remainingTime = media.getLength() - timeElapsed;
		System.out.println("Paused with this much remaining: " + this.remainingTime);
	}

	@Override
	public void seek(long time) {
		this.scheduledFuture.cancel(false);
		this.remainingTime = media.getLength() - time;
		this.scheduledFuture = this.scheduledExecutorService.schedule(this.task, this.remainingTime, TimeUnit.MILLISECONDS);
		System.out.println("Seeked with this much remaining: " + this.remainingTime);
	}
}
