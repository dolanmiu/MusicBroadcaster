package com.poo.musicbroadcaster.model.timer;

import java.util.Date;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.scheduling.TaskScheduler;

import com.poo.musicbroadcaster.model.Media;
import com.google.common.base.Stopwatch;


enum PlayState {
	STARTED, PAUSED;
}

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
	
	private PlayState playState;

	public SongTimer(TaskScheduler taskScheduler, Stopwatch stopWatch) {
		this.scheduledExecutorService = taskScheduler;
		this.stopWatch = stopWatch;
		this.lastSeek = 0;
		this.playState = PlayState.PAUSED;
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
	
	private void stopStopWatch() {
		if (this.stopWatch.isRunning()) {
			this.stopWatch.stop();
		}
	}
	
	private void startStopWatch() {
		if (!this.stopWatch.isRunning()) {
			this.stopWatch.start();
		}
	}

	@Override
	public void setMedia(Media media, Runnable task) {
		if (media == null) {
			this.mediaLength = 0;
		} else {
			this.mediaLength = media.getLength();
		}
		this.songFinishtask = () -> {
			task.run();
			this.songTickScheduledFuture.cancel(true);
			this.stopStopWatch();
		};
		System.out.println("Resetting stopwatch");
		this.seek(0);
	}

	@Override
	public boolean play() throws InterruptedException, ExecutionException {
		if (this.playState == PlayState.STARTED) {
			return false;
		}
		this.playState = PlayState.STARTED;
		
		if (this.mediaLength == 0) {
			return false;
		}

		if (this.songFinishScheduledFuture != null) {
			this.songFinishScheduledFuture.cancel(false);
		}
		
		this.startStopWatch();

		this.resetEndSongTask(this.mediaLength - this.getSeek());
		this.resetPeriodicTask();
		System.out.println("Playing at seek: " + this.getSeek());
		return true;
	}

	@Override
	public boolean pause() {
		if (this.playState == PlayState.PAUSED) {
			return false;
		}
		this.playState = PlayState.PAUSED;
		
		if (this.songFinishScheduledFuture == null || this.mediaLength == 0) {
			return false;
		}

		System.out.println("Killing seek periodic send task");
		this.songTickScheduledFuture.cancel(true);
		this.songFinishScheduledFuture.cancel(false);
		this.stopStopWatch();
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

		if (this.playState == PlayState.STARTED) {
			this.startStopWatch();
		}
		
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
			this.stopWatch.reset();
			return true;
		} else {
			return false;
		}
	}
}
