package com.poo.musicbroadcaster;

import java.util.HashMap;
import java.util.Map;

import com.poo.musicbroadcaster.model.IRoom;

public class RoomService {
	
	private Map<String, IRoom> rooms = new HashMap<String, IRoom>();
	
	public Map<String, IRoom> getRooms() {
		return rooms;
	}
	
	public IRoom getRoom(String room) {

		if (this.rooms.containsKey(room)) {
			IRoom roomInstance = this.rooms.get(room);
			return roomInstance;
		} else {
			return null;
		}
	}
}
