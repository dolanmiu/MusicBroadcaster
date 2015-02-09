package com.poo.musicbroadcaster;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.SongTimer;

@RestController
public class RoomController {
	
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	
	@RequestMapping("/room/create")
	public String createRoom(@RequestParam(value="name", defaultValue="untitled") String name) {
		Map<String, Room> rooms = RoomService.getRooms();
		if (!rooms.containsKey(name)) {
			Room room = new Room(name,  new SongTimer(), simpMessagingTemplate);
			RoomService.getRooms().put(name, room);
			return "Created room: " + name;
		} else {
			return "Error : Room already exists";
		}
	}
	
	@RequestMapping("/room/get")
	public Map<String, Room> getRooms() {
		return RoomService.getRooms();
	}
}
