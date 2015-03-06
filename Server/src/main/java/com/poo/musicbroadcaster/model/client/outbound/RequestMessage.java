package com.poo.musicbroadcaster.model.client.outbound;

public class RequestMessage extends OutBoundMessage {
	private String req;
	
	public RequestMessage() {
		this.req = "seek";
	}
	
	public String getReq() {
		return this.req;
	}
}
