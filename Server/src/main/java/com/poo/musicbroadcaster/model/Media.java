package com.poo.musicbroadcaster.model;

public class Media {
	private String id;
	private long length;
	
	public Media(String id, long length) {
		this.id = id;
		this.length = length;
	}
	
	public long getLength() {
		return this.length;
	}
	
	public String getId() {
		return this.id;
	}
}
