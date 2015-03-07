package com.poo.musicbroadcaster.model.timer;


public class SeekableStopWatch extends SimpleStopWatch {
	private long seekOffset;
	
	public SeekableStopWatch() {
		this.seekOffset = 0;
	}
	
	@Override
	public long getTimeRun() {
		System.out.println("before seek offset: " + super.getTimeRun() + ", seek offset: " + this.seekOffset);
		return super.getTimeRun() + this.seekOffset;
	}

	public void seekTo(long seek) {
		long seekDifference = seek - this.getTimeRun();
		this.seekOffset += seekDifference;
	}
	
	
}
