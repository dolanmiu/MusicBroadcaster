package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;

public interface ISongTimer {
	void setMedia(Media media, Runnable task);

	boolean play() throws InterruptedException, ExecutionException;

	boolean pause();

	boolean seek(long time);

	long getSeek();
	
	void setTickTask(Runnable task);
}
