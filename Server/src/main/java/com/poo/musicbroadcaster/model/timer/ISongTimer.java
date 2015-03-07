package com.poo.musicbroadcaster.model.timer;

import java.util.concurrent.ExecutionException;

import com.poo.musicbroadcaster.model.Media;

public interface ISongTimer {
	void setMedia(Media media, Runnable task);

	boolean play() throws InterruptedException, ExecutionException;

	boolean pause();
	
	boolean stop();

	boolean seek(long time);

	long getSeek();
	
	void setTickTask(Runnable tickTask, long tickInterval);
}
