package com.poo.musicbroadcaster.model;

import java.util.LinkedList;
import java.util.Queue;

import org.springframework.messaging.simp.SimpMessageSendingOperations;

import com.poo.musicbroadcaster.model.client.RoomMessage;

public class Room {

	private Queue<Media> songQueue;
	private Media currentMedia;
	private PlaybackStatus playbackStatus;
	private ISongTimer songTimer;
	private String roomId;
	
	private SimpMessageSendingOperations simpMessagingTemplate;
	
	public Room(String roomId, ISongTimer songTimer, SimpMessageSendingOperations simpMessagingTemplate) {
		this.roomId = roomId;
		this.simpMessagingTemplate = simpMessagingTemplate;
		
		this.playbackStatus = PlaybackStatus.STOPPED;
		this.songQueue = new LinkedList<Media>();
		this.songTimer = songTimer;
	}
	
	public Queue<Media> getSongQueue() {
		return this.songQueue;
	}
	
	public Media getCurrentMedia() {
		return this.currentMedia;
	}
	
	private void setNextSong() {
		this.currentMedia = this.songQueue.poll();
		
		this.songTimer.setMedia(this.currentMedia, () -> {
			this.currentMedia = this.songQueue.poll();
			this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, this.currentMedia);
			if (this.currentMedia != null) {
				this.setNextSong();
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
		if (this.currentMedia == null) {
			this.setNextSong();
		}
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, new RoomMessage("media-added: please retreive new song queue"));
	}
	
	public void removeMedia(String media) {
		Media currentMedia = null;
		for (Media mediaInstance : this.songQueue) {
			if (mediaInstance.getId().equals(media)) {
				currentMedia = mediaInstance;
			}
		}
		if (currentMedia != null) {
			this.songQueue.remove(currentMedia);
			this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, new RoomMessage("media-removed: please retreive new song queue"));
		}
	}
}
