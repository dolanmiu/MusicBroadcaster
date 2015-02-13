package com.poo.musicbroadcaster.model.client.outbound;

public class MediaMessage extends OutBoundMessage {
	private String media;
	
	public MediaMessage(MediaMessageType mediaType) {
		this.media = mediaType.toString();
	}
	
	public String getMedia() {
		return this.media;
	}
}
