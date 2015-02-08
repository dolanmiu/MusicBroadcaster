package com.poo.musicbroadcaster;

import java.util.HashMap;
import java.util.Map;

import com.poo.musicbroadcaster.model.Room;

public class RoomService {
	
	private static Map<String, Room> rooms = new HashMap<String, Room>();
	
	public static Map<String, Room> getRooms() {
		return rooms;
	}
}
