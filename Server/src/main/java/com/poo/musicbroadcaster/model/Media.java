package com.poo.musicbroadcaster.model;

public class Media {
	private String id;
	private long length;
	private long currentSeek;
	
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
	
	public void setCurrentSeek(long currentSeek) {
		this.currentSeek = currentSeek;
	}
	
	public long getCurrentSeek() {
		return this.currentSeek;
	}
	
	@Override
	public String toString() {
		return this.id;
	}
}
