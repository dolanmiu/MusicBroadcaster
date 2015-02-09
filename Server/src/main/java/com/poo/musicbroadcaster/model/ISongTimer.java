package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;

public interface ISongTimer {
	public void setMedia(Media media, Runnable task);

	public boolean play() throws InterruptedException, ExecutionException;

	public boolean pause();

	public boolean seek(long time);
}
