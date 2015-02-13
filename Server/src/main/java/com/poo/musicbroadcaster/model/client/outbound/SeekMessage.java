package com.poo.musicbroadcaster.model.client.outbound;

public class SeekMessage extends OutBoundMessage {
	private long seek;
	
	public SeekMessage(long seek) {
		this.seek = seek;
	}
	
	public long getSeek() {
		return this.seek;
	}
}
