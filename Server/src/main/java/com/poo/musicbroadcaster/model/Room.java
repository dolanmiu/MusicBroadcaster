package com.poo.musicbroadcaster.model;

import java.util.Date;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Timer;

public class Room {

	private Queue<Media> songQueue;
	private long lastPlayedSongTime;
	private Media currentMedia;
	private PlaybackStatus playbackStatus;
	private Timer myTimer;
	private String roomId;

	
	public Room(String roomId) {
		this.roomId = roomId;
		this.playbackStatus = PlaybackStatus.STOPPED;
		this.songQueue = new LinkedList<Media>();
		
		this.myTimer = new Timer();
	}
	
	public Queue<Media> getSongQueue() {
		return this.songQueue;
	}
	
	public float getCurrentSongTime() {
		Date date = new Date();
		return this.lastPlayedSongTime - date.getTime();
	}
	
	public Media getCurrentMedia() {
		return this.currentMedia;
	}
	
	public void setCurrentMedia(Media media) {
		this.currentMedia = media;
		Date date = new Date();
		this.lastPlayedSongTime = date.getTime();
	    this.myTimer.schedule(new SongEndTimerTask(this.roomId), this.lastPlayedSongTime, media.getLength());
	    //this.myTimer.
	}
	
	public PlaybackStatus getPlaybackStatus() {
		return this.playbackStatus;
	}
	
	public void setPlaybackStatus(PlaybackStatus playbackStatus) {
		this.playbackStatus = playbackStatus;
	}
}
