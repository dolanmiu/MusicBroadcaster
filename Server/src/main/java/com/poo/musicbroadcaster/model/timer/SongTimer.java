package com.poo.musicbroadcaster.model.timer;

import java.util.Date;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ScheduledFuture;

import org.springframework.scheduling.TaskScheduler;

import com.poo.musicbroadcaster.model.Media;

public class SongTimer implements ISongTimer {
	private ScheduledFuture<?> songFinishScheduledFuture;
	private ScheduledFuture<?> songTickScheduledFuture;

	private TaskScheduler scheduledExecutorService;

	private long mediaLength;
	private long remainingTime;

	private Runnable songFinishtask;
	private Runnable tickTask;
	private long tickInterval;
	
	private StopWatch stopWatch;

	public SongTimer(TaskScheduler taskScheduler, StopWatch stopWatch) {
		this.scheduledExecutorService = taskScheduler;
		this.stopWatch = stopWatch;
	}

	private void resetEndSongTask() {
		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}
		this.songFinishScheduledFuture = this.scheduledExecutorService.schedule(this.songFinishtask, new Date(System.currentTimeMillis() + this.remainingTime));
	}

	private void resetPeriodicTask() {
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
		this.stopWatch.reset();
	}

	@Override
	public boolean play() throws InterruptedException, ExecutionException {
		if (this.mediaLength == 0) {
			return false;
		}

		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}
		
		this.stopWatch.start();
		this.remainingTime = this.mediaLength - this.stopWatch.getTimeRun();
		this.resetEndSongTask();
		this.resetPeriodicTask();
		System.out.println("Playing with this much remaining: " + this.remainingTime);
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
		this.stopWatch.pause();
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
		return this.stopWatch.getTimeRun();
	}

	@Override
	public void setTickTask(long tickInterval, Runnable tickTask) {
		this.tickInterval = tickInterval;
		this.tickTask = () -> {
			tickTask.run();
			//this.remainingTime -= tickInterval;
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
