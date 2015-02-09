package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;

public interface IRoom {
	public void sendSongQueue();

	public PlaybackStatus getPlaybackStatus();

	public void setSeek(long time);

	public void play() throws InterruptedException, ExecutionException;

	public void pause();

	public void addMedia(Media media);

	public void removeMedia(String media);

}
