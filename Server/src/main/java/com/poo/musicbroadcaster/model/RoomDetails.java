package com.poo.musicbroadcaster.model;

import java.util.LinkedList;
import java.util.Queue;

public class RoomDetails {

	private Queue<Media> songQueue;
	private float currentSongTime;
	private Media currentSong;
	private PlaybackStatus playbackStatus;
	
	public RoomDetails() {
		this.playbackStatus = PlaybackStatus.STOPPED;
		this.songQueue = new LinkedList<Media>();
	}
	
	public Queue<Media> getSongQueue() {
		return this.songQueue;
	}
	
	public float getCurrentSongTime() {
		return this.currentSongTime;
	}
	
	public Media getCurrentSong() {
		return this.currentSong;
	}
	
	public PlaybackStatus getPlaybackStatus() {
		return this.playbackStatus;
	}
	
	public void setPlaybackStatus(PlaybackStatus playbackStatus) {
		this.playbackStatus = playbackStatus;
	}
}
