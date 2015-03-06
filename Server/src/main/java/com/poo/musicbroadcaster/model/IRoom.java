package com.poo.musicbroadcaster.model;

import java.util.Queue;
import java.util.concurrent.ExecutionException;

import com.poo.musicbroadcaster.model.user.IUserManager;

public interface IRoom {
	PlaybackStatus getPlaybackStatus();

	void setSeek(long time);
	
	long getSeek();

	void play() throws InterruptedException, ExecutionException;

	void pause();

	void addMedia(Media media);

	void removeMedia(String media);

	Queue<Media> getPlaylist();
	
	Media getCurrentMedia();
	
	boolean isEmpty();
	
	IUserManager getUserManager();
}
