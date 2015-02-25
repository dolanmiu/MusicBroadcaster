package com.poo.musicbroadcaster.model;

public class Media {
	private String id;
	private long length;
	private long currentSeek;
	private String thumbnailUrl;
	private String displayName;

	public Media(String id, long length, String thumbnailUrl, String displayName) {
		this.id = id;
		this.length = length;
		this.thumbnailUrl = thumbnailUrl;
		this.displayName = displayName;
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

	public String getThumbnailUrl() {
		return this.thumbnailUrl;
	}

	public String getDisplayName() {
		return this.displayName;
	}

	@Override
	public String toString() {
		return this.id;
	}
}
