package com.poo.musicbroadcaster;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import com.poo.musicbroadcaster.model.IRoom;

@Service
public class RoomService {

	private final TaskScheduler taskScheduler;

	private Map<String, IRoom> rooms;
	private Map<String, IRoom> trashCanRooms;

	@Autowired
	public RoomService(@Qualifier("taskScheduler") TaskScheduler taskScheduler) {
		this.taskScheduler = taskScheduler;
		this.taskScheduler.scheduleAtFixedRate(() -> {
			this.cleanRooms();
		}, 5 * 60 * 1000);
		this.rooms = new HashMap<String, IRoom>();
		this.trashCanRooms = new HashMap<String, IRoom>();
	}

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

	private void cleanRooms() {
		System.out.println("CLEANING ROOMS");
		for (Map.Entry<String, IRoom> entry : this.trashCanRooms.entrySet()) {
		    String key = entry.getKey();
		    IRoom room = entry.getValue();
		    if (room.isEmpty()) {
		    	this.trashCanRooms.remove(key);
		    	this.rooms.remove(key);
		    }
		}

		for (Map.Entry<String, IRoom> entry : this.rooms.entrySet()) {
		    String key = entry.getKey();
		    IRoom room = entry.getValue();
		    if (room.isEmpty()) {
		    	this.trashCanRooms.put(key, room);
		    }
		}
	}
}
