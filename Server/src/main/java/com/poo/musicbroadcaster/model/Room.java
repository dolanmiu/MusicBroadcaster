package com.poo.musicbroadcaster.model;

import java.util.LinkedList;
import java.util.Queue;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.poo.musicbroadcaster.model.client.RoomMessage;

public class Room {

	private Queue<Media> songQueue;
	private Media currentMedia;
	private PlaybackStatus playbackStatus;
	private SongTimer songTimer;
	private String roomId;
	
	private SimpMessagingTemplate simpMessagingTemplate;
	
	public Room(String roomId, SimpMessagingTemplate simpMessagingTemplate) {
		this.roomId = roomId;
		this.simpMessagingTemplate = simpMessagingTemplate;
		
		this.playbackStatus = PlaybackStatus.STOPPED;
		this.songQueue = new LinkedList<Media>();
		this.songTimer = new SongTimer();
	}
	
	public Queue<Media> getSongQueue() {
		return this.songQueue;
	}
	
	public Media getCurrentMedia() {
		return this.currentMedia;
	}
	
	public void setCurrentMedia(Media media) {
		this.currentMedia = media;
		this.songTimer.setMedia(media, () -> {
			this.currentMedia = this.songQueue.poll();
			this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, this.currentMedia);
			if (this.currentMedia != null) {
				this.setCurrentMedia(this.currentMedia);
			}
		});
	}
	
	public PlaybackStatus getPlaybackStatus() {
		return this.playbackStatus;
	}
	
	public void setTime(long time) {
		this.songTimer.seek(time);
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, new RoomMessage("seek:" + time));
	}
	
	public void setPlaybackStatus(PlaybackStatus playbackStatus) {
		this.playbackStatus = playbackStatus;
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, new RoomMessage(playbackStatus.toString()));
	}
	
	public void addMedia(Media media) {
		this.songQueue.add(media);
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, new RoomMessage("media-added: please retreive new song queue"));
	}
	
	public void removeMedia(Media media) {
		this.songQueue.remove(media);
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, new RoomMessage("media-removed: please retreive new song queue"));
	}
}
