package com.poo.musicbroadcaster;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoomController {
	
	@RequestMapping("/room/create")
	public void createRoom(@RequestParam(value="name", defaultValue="untitled") String name) {
		RoomManager.getRooms().add("blah");
	}
	
	@RequestMapping("/room/get")
	public List<String> getRooms() {
		return RoomManager.getRooms();
	}
	
	@RequestMapping("/room/{roomId}")
	public String joinRoom(@PathVariable String roomId) {
		return roomId;
	}
}
