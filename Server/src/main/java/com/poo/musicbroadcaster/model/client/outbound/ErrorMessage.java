package com.poo.musicbroadcaster.model.client.outbound;

public class ErrorMessage extends OutBoundMessage {
	private String error;

	public ErrorMessage(String error) {
		this.error = error;
	}
	
	public String getError() {
		return this.error;
	}
}
