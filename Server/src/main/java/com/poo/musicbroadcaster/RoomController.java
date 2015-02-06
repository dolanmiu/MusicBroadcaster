package com.poo.musicbroadcaster;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoomController {
	
	private List<String> rooms;
	
	@RequestMapping("/createRoom")
	public void createRoom(@RequestParam(value="name", defaultValue="untitled") String name) {
		
	}
	
	@RequestMapping("/{roomId}")
	public String joinRoom(@PathVariable String roomId) {
		return roomId;
	}
}
