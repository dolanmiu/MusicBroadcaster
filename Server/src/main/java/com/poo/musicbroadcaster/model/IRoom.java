package com.poo.musicbroadcaster.model;

import java.util.Queue;
import java.util.concurrent.ExecutionException;

public interface IRoom {
	PlaybackStatus getPlaybackStatus();

	void setSeek(long time);

	void play() throws InterruptedException, ExecutionException;

	void pause();

	void addMedia(Media media);

	void removeMedia(String media);

	Queue<Media> getPlaylist();
	
	Media getCurrentMedia();
}
