package com.poo.musicbroadcaster.model.client.inbound;

public class HeartbeatMessage {
	private SeekMessage seek;
	private User user;
	
	public SeekMessage getSeek() {
		return this.seek;
	}
	
	public User getUser() {
		return this.user;
	}
}
