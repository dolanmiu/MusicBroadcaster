package com.poo.musicbroadcaster.model.client.outbound;

public class PlaybackMessage extends OutBoundMessage {
	private String playback;
	
	public PlaybackMessage(PlaybackMessageType playbackType) {
		this.playback = playbackType.toString();
	}
	
	public String getPlayback() {
		return this.playback;
	}
}
