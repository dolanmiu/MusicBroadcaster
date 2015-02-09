package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;

public interface ISongTimer {
	public void setMedia(Media media, Runnable task);

	public void play() throws InterruptedException, ExecutionException;

	public void pause();

	public void seek(long time);
}
