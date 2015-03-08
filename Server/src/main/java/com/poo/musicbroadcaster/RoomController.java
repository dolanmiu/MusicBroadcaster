package com.poo.musicbroadcaster;

import java.util.Map;
import java.util.Queue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poo.musicbroadcaster.factory.IRoomFactory;
import com.poo.musicbroadcaster.model.IRoom;
import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.client.enums.PlaybackStatusType;
import com.poo.musicbroadcaster.model.client.outbound.CurrentStatus;
import com.poo.musicbroadcaster.model.client.outbound.ErrorMessage;
import com.poo.musicbroadcaster.model.client.outbound.OutBoundMessage;
import com.poo.musicbroadcaster.model.client.outbound.RoomMessage;

@RestController
public class RoomController {

	private IRoomFactory roomFactory;

	private RoomService roomService;

	@Autowired
	public RoomController(IRoomFactory roomFactory, RoomService roomService) {
		this.roomFactory = roomFactory;
		this.roomService = roomService;
	}

	@RequestMapping("/room/create")
	public OutBoundMessage createRoom(@RequestParam(value = "name", defaultValue = "untitled") String name) {
		Map<String, IRoom> rooms = roomService.getRooms();
		if (!rooms.containsKey(name)) {
			IRoom room = roomFactory.newInstance(name);
			roomService.getRooms().put(name, room);
			System.out.println("CREATED ROOM: " + name);
			return new RoomMessage("Created room");
		} else {
			System.out.println("FAILED TO CREATE ROOM: " + name);
			return new ErrorMessage("IRoom already exists");
		}
	}

	@RequestMapping("/room/check")
	public boolean checkRoom(@RequestParam(value = "name") String name) {
		Map<String, IRoom> rooms = roomService.getRooms();
		if (!rooms.containsKey(name)) {
			return true;
		} else {
			return false;
		}
	}

	@RequestMapping("/room/get")
	public Map<String, IRoom> getRooms() {
		return roomService.getRooms();
	}

	@RequestMapping("/room/{room}/playlist")
	public Queue<Media> getPlaylist(@PathVariable String room) {
		IRoom roomInstance = roomService.getRoom(room);
		if (roomInstance == null) return null;
		return roomInstance.getPlaylist();
	}

	@RequestMapping("/room/{room}/current")
	public CurrentStatus getCurrentMedia(@PathVariable String room) {
		IRoom roomInstance = roomService.getRoom(room);
		Media currentMedia = roomInstance.getCurrentMedia();
		PlaybackStatusType playbackStatus = roomInstance.getPlaybackStatus();
		return new CurrentStatus(currentMedia, playbackStatus);
	}
}