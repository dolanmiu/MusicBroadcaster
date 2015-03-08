package com.poo.musicbroadcaster.model.client.outbound;

import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.client.enums.PlaybackStatusType;

public class CurrentStatus {
	private Media media;
	private PlaybackStatusType playStatus;
	
	public CurrentStatus(Media media, PlaybackStatusType playStatus) {
		this.media = media;
		this.playStatus = playStatus;
	}
	
	public Media getMedia() {
		return this.media;
	}
	
	public PlaybackStatusType getPlayStatus() {
		return this.playStatus;
	}
}
