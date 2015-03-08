package com.poo.musicbroadcaster.model.client.outbound;

import com.poo.musicbroadcaster.model.client.enums.PlaybackStatusType;

public class PlaybackMessage extends OutBoundMessage {
	private String playback;
	
	public PlaybackMessage(PlaybackStatusType playbackType) {
		this.playback = playbackType.toString();
	}
	
	public String getPlayback() {
		return this.playback;
	}
}
