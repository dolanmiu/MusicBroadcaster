package com.poo.musicbroadcaster;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poo.musicbroadcaster.model.RoomDetails;

@RestController
public class RoomController {
	
	@RequestMapping("/room/create")
	public void createRoom(@RequestParam(value="name", defaultValue="untitled") String name) {
		RoomDetails room = new RoomDetails();
		RoomManager.getRooms().put(name, room);
	}
	
	@RequestMapping("/room/get")
	public Map<String, RoomDetails> getRooms() {
		return RoomManager.getRooms();
	}
}
