package com.poo.musicbroadcaster.model.client.outbound;

public class SeekMessage extends OutBoundMessage {
	private long seek;
	private String excludeId;
	
	public SeekMessage(long seek, String excludeId) {
		this.seek = seek;
		this.excludeId = excludeId;
	}
	
	public long getSeek() {
		return this.seek;
	}
	
	public String getExcludeId() {
		return this.excludeId;
	}
}
