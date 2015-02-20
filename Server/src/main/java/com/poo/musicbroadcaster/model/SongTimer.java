package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class SongTimer implements ISongTimer {
	ScheduledExecutorService scheduledExecutorService;
	ScheduledFuture<?> songFinishScheduledFuture;
	ScheduledFuture<?> songTickScheduledFuture;

	private long lastPlayTime;
	private long mediaLength;
	private long remainingTime;

	private Runnable task;
	private Runnable tickTask;
	private long tickInterval;

	public SongTimer(long tickInterval) {
		this.tickInterval = tickInterval;
		this.scheduledExecutorService = Executors.newScheduledThreadPool(5);
	}

	@Override
	public void setMedia(Media media, Runnable task) {
		if (media == null) {
			this.mediaLength = 0;
		} else {
			this.mediaLength = media.getLength();
		}
		this.task = () -> {
			task.run();
			if (this.songTickScheduledFuture != null) {
				this.songTickScheduledFuture.cancel(false);
			}
		};
		this.remainingTime = this.mediaLength;
	}

	@Override
	public boolean play() throws InterruptedException, ExecutionException {
		if (this.mediaLength == 0) {
			return false;
		}

		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}

		this.lastPlayTime = System.currentTimeMillis();
		System.out.println("Playing with this much remaining: " + this.remainingTime);
		this.songFinishScheduledFuture = this.scheduledExecutorService.schedule(this.task, this.remainingTime, TimeUnit.MILLISECONDS);
		if (this.tickTask != null) {
			this.songTickScheduledFuture = this.scheduledExecutorService.scheduleAtFixedRate(this.tickTask, 0, this.tickInterval, TimeUnit.MILLISECONDS);
		}
		return true;
	}

	@Override
	public boolean pause() {
		if (this.songTickScheduledFuture != null) {
			System.out.println("Killing seek periodic send task");
			this.songTickScheduledFuture.cancel(false);
		}
		
		if (this.songFinishScheduledFuture == null || this.mediaLength == 0) {
			return false;
		}

		this.songFinishScheduledFuture.cancel(false);

		long pauseTime = System.currentTimeMillis();
		long timeElapsed = pauseTime - this.lastPlayTime;
		this.remainingTime = this.mediaLength - timeElapsed;
		return true;
	}

	@Override
	public boolean seek(long time) {
		if (this.mediaLength == 0) {
			return false;
		}

		long tempTime = this.mediaLength - time;
		if (tempTime < 0 || time < 0) {
			return false;
		}

		this.remainingTime = tempTime;
		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}
		this.songFinishScheduledFuture = this.scheduledExecutorService.schedule(this.task, this.remainingTime, TimeUnit.MILLISECONDS);
		System.out.println("Seeked with this much remaining: " + this.remainingTime);
		return true;
	}

	@Override
	public long getSeek() {
		long seekRequestTime = System.currentTimeMillis();
		long timeElapsed = seekRequestTime - this.lastPlayTime;
		this.remainingTime = this.mediaLength - timeElapsed;
		return this.mediaLength - this.remainingTime;
	}

	@Override
	public void setTickTask(Runnable task) {
		this.tickTask = task;
	}
}
