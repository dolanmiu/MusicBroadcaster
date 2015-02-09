package com.poo.musicbroadcaster;

import java.util.HashMap;
import java.util.Map;

import com.poo.musicbroadcaster.model.Room;

public class RoomService {
	
	private static Map<String, Room> rooms = new HashMap<String, Room>();
	
	public static Map<String, Room> getRooms() {
		return rooms;
	}
	
	public static Room getRoom(String room) {
		Map<String, Room> rooms = RoomService.getRooms();

		if (rooms.containsKey(room)) {
			Room roomInstance = rooms.get(room);
			return roomInstance;
		} else {
			return null;
		}
	}
}
