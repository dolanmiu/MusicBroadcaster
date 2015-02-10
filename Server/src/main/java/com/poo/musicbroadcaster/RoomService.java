package com.poo.musicbroadcaster;

import java.util.HashMap;
import java.util.Map;

import com.poo.musicbroadcaster.model.IRoom;

public class RoomService {
	
	private static Map<String, IRoom> rooms = new HashMap<String, IRoom>();
	
	public static Map<String, IRoom> getRooms() {
		return rooms;
	}
	
	public static IRoom getRoom(String room) {
		Map<String, IRoom> rooms = RoomService.getRooms();

		if (rooms.containsKey(room)) {
			IRoom roomInstance = rooms.get(room);
			return roomInstance;
		} else {
			return null;
		}
	}
}
