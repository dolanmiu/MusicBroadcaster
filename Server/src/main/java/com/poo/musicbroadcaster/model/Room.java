package com.poo.musicbroadcaster.model;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ExecutionException;

import org.springframework.messaging.simp.SimpMessageSendingOperations;

import com.poo.musicbroadcaster.model.client.outbound.ErrorMessage;
import com.poo.musicbroadcaster.model.client.outbound.MediaMessage;
import com.poo.musicbroadcaster.model.client.outbound.MediaMessageType;
import com.poo.musicbroadcaster.model.client.outbound.OutBoundMessage;
import com.poo.musicbroadcaster.model.client.outbound.PlaybackMessage;
import com.poo.musicbroadcaster.model.client.outbound.PlaybackMessageType;
import com.poo.musicbroadcaster.model.client.outbound.PlaylistMessage;
import com.poo.musicbroadcaster.model.client.outbound.PlaylistMessageType;
import com.poo.musicbroadcaster.model.client.outbound.SeekMessage;

public class Room implements IRoom {

	private Queue<Media> songQueue;
	private Media currentMedia;
	private PlaybackStatus playbackStatus;
	private ISongTimer songTimer;
	private String roomId;

	private SimpMessageSendingOperations simpMessagingTemplate;

	public Room(String roomId, ISongTimer songTimer, SimpMessageSendingOperations simpMessagingTemplate) {
		this.roomId = roomId;
		this.simpMessagingTemplate = simpMessagingTemplate;
		this.songTimer = songTimer;

		this.playbackStatus = PlaybackStatus.STOPPED;
		this.songQueue = new LinkedList<Media>();
	}

	private void sendMessage(OutBoundMessage message) {
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, message);
	}

	private void setNextSong() {
		this.currentMedia = this.songQueue.poll();

		this.songTimer.setMedia(this.currentMedia, () -> {
			this.currentMedia = this.songQueue.poll();
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.NEXT));
			if (this.currentMedia != null) {
				this.setNextSong();
			} else {
				this.sendMessage(new PlaylistMessage(PlaylistMessageType.FINISHED));
			}
		});
	}

	@Override
	public PlaybackStatus getPlaybackStatus() {
		return this.playbackStatus;
	}

	@Override
	public void setSeek(long time) {
		boolean result = this.songTimer.seek(time);
		if (result) {
			this.sendMessage(new SeekMessage(time));
		} else {
			this.sendMessage(new ErrorMessage("Time is invalid"));
		}
	}

	@Override
	public void play() throws InterruptedException, ExecutionException {
		if (this.currentMedia == null) {
			this.sendMessage(new ErrorMessage("Song cannot be played, there isnt a song in queue"));
			return;
		}
		boolean result = this.songTimer.play();
		if (result) {
			this.playbackStatus = PlaybackStatus.PLAYING;
			this.sendMessage(new PlaybackMessage(PlaybackMessageType.PLAY));
		} else {
			this.sendMessage(new ErrorMessage("Song cannot be played, there isnt a song in queue"));
		}
	}

	@Override
	public void pause() {
		if (this.playbackStatus != PlaybackStatus.PLAYING) {
			this.sendMessage(new ErrorMessage("Song cannot be paused as its not currently playing to begin with!"));
			return;
		}
		if (this.currentMedia == null) {
			this.sendMessage(new ErrorMessage("Song cannot be paused, there isnt a song in queue"));
			return;
		}
		boolean result = this.songTimer.pause();
		if (result) {
			this.playbackStatus = PlaybackStatus.PAUSED;
			this.sendMessage(new PlaybackMessage(PlaybackMessageType.PAUSE));
		}
	}

	@Override
	public void addMedia(Media media) {
		this.songQueue.add(media);
		if (this.currentMedia == null) {
			this.setNextSong();
			this.sendMessage(new PlaybackMessage(PlaybackMessageType.PLAY));
		}
		this.sendMessage(new MediaMessage(MediaMessageType.ADDED));
	}

	@Override
	public void removeMedia(String media) {
		Media currentMedia = null;
		for (Media mediaInstance : this.songQueue) {
			if (mediaInstance.getId().equals(media)) {
				currentMedia = mediaInstance;
			}
		}
		if (currentMedia != null) {
			this.songQueue.remove(currentMedia);
			this.sendMessage(new MediaMessage(MediaMessageType.REMOVED));
		}
	}

	@Override
	public Queue<Media> getPlaylist() {
		return this.songQueue;
	}

	@Override
	public Media getCurrentMedia() {
		return this.currentMedia;
	}
}
