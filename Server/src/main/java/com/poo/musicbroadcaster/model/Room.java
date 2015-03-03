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
import com.poo.musicbroadcaster.model.timer.ISongTimer;

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
		System.out.println("SETTING NEXT SONG...");
		this.currentMedia = this.songQueue.poll();

		if (this.currentMedia == null) {
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.FINISHED));
			System.out.println("PLAYLIST HAS FINISHED");
			this.songTimer.stop();
		} else {
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.NEXT));
			System.out.println("SONG HAS FINISHED, NEXT SONG ABOUT TO BE PLAYED: " + this.currentMedia);

			this.songTimer.setMedia(this.currentMedia, () -> {
				this.setNextSong();
			});
		}
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
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.FINISHED));
			return;
		}
		boolean result = this.songTimer.play();
		if (result) {
			this.playbackStatus = PlaybackStatus.PLAYING;
			System.out.println("CURRENTLY PLAYING TRACK: " + this.currentMedia);
			this.sendMessage(new PlaybackMessage(PlaybackMessageType.PLAY));
		} else {
			this.sendMessage(new ErrorMessage("Song cannot be played, there isnt a song in queue"));
		}
	}

	@Override
	public void pause() {
		if (this.currentMedia == null) {
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.FINISHED));
			return;
		}
		System.out.println("Reaminig time: " + this.songTimer.getTimeRemaining());
		if (this.songTimer.getTimeRemaining() < 2000) {
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
		this.sendMessage(new MediaMessage(MediaMessageType.ADDED));
		if (this.currentMedia == null) {
			this.setNextSong();
		}
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
		if (this.currentMedia == null) {
			return null;
		} else {
			this.currentMedia.setCurrentSeek(this.songTimer.getSeek());
			return this.currentMedia;
		}
	}

	@Override
	public boolean isEmpty() {
		if (!true) {
			return true;
		} else {
			return false;
		}
	}
}
