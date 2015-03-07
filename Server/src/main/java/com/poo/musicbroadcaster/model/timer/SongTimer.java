package com.poo.musicbroadcaster.model.timer;

import java.util.Date;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.scheduling.TaskScheduler;

import com.poo.musicbroadcaster.model.Media;
import com.google.common.base.Stopwatch;

public class SongTimer implements ISongTimer {
	private ScheduledFuture<?> songFinishScheduledFuture;
	private ScheduledFuture<?> songTickScheduledFuture;

	private TaskScheduler scheduledExecutorService;

	private long mediaLength;

	private Runnable songFinishtask;
	private Runnable tickTask;
	private long tickInterval;
	
	private Stopwatch stopWatch;
	
	private long lastSeek;

	public SongTimer(TaskScheduler taskScheduler, Stopwatch stopWatch) {
		this.scheduledExecutorService = taskScheduler;
		this.stopWatch = stopWatch;
		this.lastSeek = 0;
	}

	private void resetEndSongTask(long remainingTime) {
		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}
		this.songFinishScheduledFuture = this.scheduledExecutorService.schedule(this.songFinishtask, new Date(System.currentTimeMillis() + remainingTime));
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

		this.resetEndSongTask(this.mediaLength - this.getSeek());
		this.resetPeriodicTask();
		System.out.println("Playing at seek: " + this.getSeek());
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
		this.stopWatch.stop();
		return true;
	}

	@Override
	public boolean seek(long time) {
		if (this.mediaLength == 0) {
			return false;
		}

		long remainingTime = this.mediaLength - time;
		if (remainingTime < 0 || time < 0) {
			return false;
		}

		this.resetEndSongTask(remainingTime);
		this.lastSeek = time;
		this.stopWatch.reset();
		System.out.println("Seeked to: " + this.getSeek());
		return true;
	}

	@Override
	public long getSeek() {
		return this.stopWatch.elapsed(TimeUnit.MILLISECONDS) + this.lastSeek;
	}

	@Override
	public void setTickTask(Runnable tickTask, long tickInterval) {
		this.tickInterval = tickInterval;
		this.tickTask = () -> {
			tickTask.run();
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
