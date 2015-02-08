package com.poo.musicbroadcaster;

import java.util.HashMap;
import java.util.Map;

import com.poo.musicbroadcaster.model.RoomDetails;

public class RoomManager {
	
	private static Map<String, RoomDetails> rooms = new HashMap<String, RoomDetails>();
	
	public static Map<String, RoomDetails> getRooms() {
		return rooms;
	}
}
