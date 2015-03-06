package com.poo.musicbroadcaster;

import org.springframework.stereotype.Service;

@Service
public class SeekService {
	
	public SeekService() {
	
	}
	
	public boolean needToSeek(long actualSeek, long seek) {
		if (Math.abs(actualSeek - seek) > 5000) {
			return true;
		} else {
			return false;
		}
	}
}
