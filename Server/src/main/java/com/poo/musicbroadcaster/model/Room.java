package com.poo.musicbroadcaster.model;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ScheduledFuture;

import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.TaskScheduler;

import com.poo.musicbroadcaster.model.client.enums.MediaMessageType;
import com.poo.musicbroadcaster.model.client.enums.PlaybackStatusType;
import com.poo.musicbroadcaster.model.client.enums.PlaylistMessageType;
import com.poo.musicbroadcaster.model.client.outbound.ErrorMessage;
import com.poo.musicbroadcaster.model.client.outbound.MediaMessage;
import com.poo.musicbroadcaster.model.client.outbound.OutBoundMessage;
import com.poo.musicbroadcaster.model.client.outbound.PlaybackMessage;
import com.poo.musicbroadcaster.model.client.outbound.PlaylistMessage;
import com.poo.musicbroadcaster.model.client.outbound.RequestMessage;
import com.poo.musicbroadcaster.model.client.outbound.SeekMessage;
import com.poo.musicbroadcaster.model.client.outbound.UsersMessage;
import com.poo.musicbroadcaster.model.timer.ISongTimer;
import com.poo.musicbroadcaster.model.user.IUserManager;


public class Room implements IRoom {

	private Queue<Media> songQueue;
	private Media currentMedia;
	private PlaybackStatusType playbackStatus;
	private ISongTimer songTimer;
	private TaskScheduler taskScheduler;
	private ScheduledFuture<?> heartBeatScheduledFuture; 
	private ScheduledFuture<?> requestScheduledFuture; 
	private String roomId;
	private IUserManager userManager;

	private SimpMessageSendingOperations simpMessagingTemplate;

	public Room(String roomId, ISongTimer songTimer, SimpMessageSendingOperations simpMessagingTemplate, TaskScheduler taskScheduler, IUserManager userManager) {
		this.roomId = roomId;
		this.simpMessagingTemplate = simpMessagingTemplate;
		this.songTimer = songTimer;
		this.taskScheduler = taskScheduler;
		this.userManager = userManager;

		this.playbackStatus = PlaybackStatusType.STOP;
		this.songQueue = new LinkedList<Media>();
				
		this.heartBeatScheduledFuture = this.taskScheduler.scheduleAtFixedRate(() -> {
			this.simpMessagingTemplate.convertAndSend("/room/" + roomId, new UsersMessage(this.userManager.getUsers()));
		}, 10000);
	}
	
	private void setRepeatingSeekRequest() {
		if (requestScheduledFuture != null) {
			this.requestScheduledFuture.cancel(true);
		}
		this.requestScheduledFuture = this.taskScheduler.scheduleAtFixedRate(() -> {
			this.simpMessagingTemplate.convertAndSend("/room/" + roomId, new RequestMessage());
		}, 1000);
	}

	private void sendMessage(OutBoundMessage message) {
		this.simpMessagingTemplate.convertAndSend("/room/" + this.roomId, message);
	}

	private void setNextSong() {
		this.currentMedia = this.songQueue.poll();

		if (this.currentMedia == null) {
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.FINISHED));
			System.out.println("PLAYLIST HAS FINISHED");
			this.requestScheduledFuture.cancel(true);
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
	public PlaybackStatusType getPlaybackStatus() {
		return this.playbackStatus;
	}

	@Override
	public void setSeek(long time, String user) {
		boolean result = this.songTimer.seek(time);
		if (result) {
			this.sendMessage(new SeekMessage(time, user));
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
			this.playbackStatus = PlaybackStatusType.PLAY;
			System.out.println("CURRENTLY PLAYING TRACK: " + this.currentMedia);
			this.sendMessage(new PlaybackMessage(PlaybackStatusType.PLAY));
		} else {
			this.sendMessage(new ErrorMessage("Song cannot be played, there isnt a song in queue"));
		}
		
		this.setRepeatingSeekRequest();
	}

	@Override
	public void pause() {
		if (this.currentMedia == null) {
			this.sendMessage(new PlaylistMessage(PlaylistMessageType.FINISHED));
			return;
		}
		System.out.println("Seek is at time: " + this.songTimer.getSeek());
		if (this.currentMedia.getLength() - this.songTimer.getSeek() < 2000) {
			return;
		}
		boolean result = this.songTimer.pause();
		if (result) {
			this.playbackStatus = PlaybackStatusType.PAUSE;
			this.sendMessage(new PlaybackMessage(PlaybackStatusType.PAUSE));
		}
		
		this.requestScheduledFuture.cancel(true);
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

	@Override
	public IUserManager getUserManager() {
		return this.userManager;
	}

	@Override
	public long getSeek() {
		return this.songTimer.getSeek();
	}
}
