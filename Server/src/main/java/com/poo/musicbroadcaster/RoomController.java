package com.poo.musicbroadcaster;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poo.musicbroadcaster.model.IRoom;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.SongTimer;

@RestController
public class RoomController {
	
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	
	@RequestMapping("/room/create")
	public String createRoom(@RequestParam(value="name", defaultValue="untitled") String name) {
		Map<String, IRoom> rooms = RoomService.getRooms();
		if (!rooms.containsKey(name)) {
			IRoom room = new Room(name,  new SongTimer(), simpMessagingTemplate);
			RoomService.getRooms().put(name, room);
			return "Created room: " + name;
		} else {
			return "Error : IRoom already exists";
		}
	}
	
	@RequestMapping("/room/get")
	public Map<String, IRoom> getRooms() {
		return RoomService.getRooms();
	}
}
