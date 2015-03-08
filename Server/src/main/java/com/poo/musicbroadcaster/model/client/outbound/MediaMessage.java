package com.poo.musicbroadcaster.model.client.outbound;

import com.poo.musicbroadcaster.model.client.enums.MediaMessageType;

public class MediaMessage extends OutBoundMessage {
	private String media;
	
	public MediaMessage(MediaMessageType mediaType) {
		this.media = mediaType.toString();
	}
	
	public String getMedia() {
		return this.media;
	}
}
