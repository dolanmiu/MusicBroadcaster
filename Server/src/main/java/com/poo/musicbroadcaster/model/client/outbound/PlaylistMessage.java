package com.poo.musicbroadcaster.model.client.outbound;

public class PlaylistMessage extends OutBoundMessage {
	private String playlist;
	
	public PlaylistMessage(PlaylistMessageType playlistType) {
		this.playlist = playlistType.toString();
	}
	
	public String getPlaylist() {
		return this.playlist;
	}
}
