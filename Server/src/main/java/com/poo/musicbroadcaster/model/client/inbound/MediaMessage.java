package com.poo.musicbroadcaster.model.client.inbound;

public class MediaMessage {
	private String id;
	private long length;
	private String thumbnailUrl;
	private String displayName;
	
	public String getId() {
		return this.id;
	}
	
	public long getLength() {
		return this.length;
	}
	
	public String getThumbnailUrl() {
		return this.thumbnailUrl;
	}
	
	public String getDisplayName() {
		return this.displayName;
	}
}
