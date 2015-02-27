package com.poo.musicbroadcaster.model;

import java.util.Date;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ScheduledFuture;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

public class SongTimer implements ISongTimer {
	// ScheduledExecutorService scheduledExecutorService;
	ScheduledFuture<?> songFinishScheduledFuture;
	ScheduledFuture<?> songTickScheduledFuture;

	TaskScheduler scheduledExecutorService = new ConcurrentTaskScheduler();

	private long mediaLength;
	private long remainingTime;

	private Runnable songFinishtask;
	private Runnable tickTask;
	private long tickInterval;

	public SongTimer() {
		// this.scheduledExecutorService = Executors.newScheduledThreadPool(5);
		// this.scheduledExecutorService = new ThreadPoolTaskScheduler();
	}

	private void resetEndSongTask() {
		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}
		this.songFinishScheduledFuture = this.scheduledExecutorService.schedule(this.songFinishtask, new Date(System.currentTimeMillis() + this.remainingTime));
	}

	private void resetPeriodicTask() {
		System.out.println("Resetting periodic timer task");
		if (this.songTickScheduledFuture != null) {
			this.songTickScheduledFuture.cancel(true);
		}
		this.songTickScheduledFuture = this.scheduledExecutorService.scheduleAtFixedRate(this.tickTask, this.tickInterval);
	}

	@Override
	public void setMedia(Media media, Runnable task) {
		if (media == null) {
			this.mediaLength = 0;
		} else {
			this.mediaLength = media.getLength();
		}
		this.songFinishtask = task;
		this.remainingTime = this.mediaLength;
		this.resetEndSongTask();
	}

	@Override
	public boolean play() throws InterruptedException, ExecutionException {
		if (this.mediaLength == 0) {
			return false;
		}

		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}

		System.out.println("Playing with this much remaining: " + this.remainingTime);
		this.resetEndSongTask();
		System.out.println("Creating seek periodic send task");
		this.resetPeriodicTask();
		return true;
	}

	@Override
	public boolean pause() {
		if (this.songFinishScheduledFuture == null || this.mediaLength == 0) {
			return false;
		}

		System.out.println("Killing seek periodic send task");
		this.songTickScheduledFuture.cancel(true);
		this.songFinishScheduledFuture.cancel(false);

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
		this.resetEndSongTask();
		System.out.println("Seeked with this much remaining: " + this.remainingTime);
		return true;
	}

	@Override
	public long getSeek() {
		return this.mediaLength - this.remainingTime;
	}

	@Override
	public void setTickTask(long tickInterval, Runnable tickTask) {
		this.tickInterval = tickInterval;
		this.tickTask = () -> {
			tickTask.run();
			this.remainingTime -= tickInterval;
		};
	}

	@Override
	public boolean stop() {
		if (this.songTickScheduledFuture != null) {
			this.songTickScheduledFuture.cancel(true);
			return true;
		} else {
			return false;
		}
	}
}
