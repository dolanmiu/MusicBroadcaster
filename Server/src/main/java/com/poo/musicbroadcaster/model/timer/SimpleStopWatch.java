package com.poo.musicbroadcaster.model.timer;

public class SimpleStopWatch {

	private long startTime;
	private long lastPauseTime;
	private long lastPlayTime;

	private long totalPauseTime;
	
	private boolean started;
	
	private PlayState playState;
	
	private long timeSnapshot;

	public SimpleStopWatch() {
		this.lastPauseTime = 0;
		this.lastPlayTime = 0;
		this.totalPauseTime = 0;
		this.startTime = 0;
		this.started = false;
	}

	public void reset() {
		this.lastPauseTime = 0;
		this.lastPlayTime = 0;
		this.totalPauseTime = 0;
		this.startTime = 0;
		this.started = false;
	}

	public void pause() {
		this.playState = PlayState.PAUSED;
		this.lastPauseTime = System.currentTimeMillis();
		this.timeSnapshot = this.getTimeRun();
	}

	public void start() {
		this.playState = PlayState.STARTED;
		if (!this.started) {
			this.startTime = System.currentTimeMillis();
			this.started = true;
		}
		
		if (this.lastPauseTime == -1) {
			return;
		}

		this.lastPlayTime = System.currentTimeMillis();

		if (this.lastPauseTime == 0) {
			return;
		} else {
			this.totalPauseTime += this.lastPlayTime - this.lastPauseTime;
			this.lastPauseTime = -1;
		}
	}

	public long getTimeRun() {
		//System.out.println("Total pause time: " + this.totalPauseTime);
		if (this.playState == PlayState.PAUSED) {
			return this.timeSnapshot;
		}
		
		if (this.startTime == 0) {
			return 0;
		}
		return System.currentTimeMillis() - this.startTime - this.totalPauseTime;
	}
}
