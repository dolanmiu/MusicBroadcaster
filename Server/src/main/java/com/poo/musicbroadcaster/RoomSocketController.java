package com.poo.musicbroadcaster;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.PlaybackStatus;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.client.HelloMessage;
import com.poo.musicbroadcaster.model.client.MediaMessage;
import com.poo.musicbroadcaster.model.client.RoomMessage;
import com.poo.musicbroadcaster.model.client.SeekMessage;

@Controller
public class RoomSocketController {
	
	@Autowired 
	private SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/room/{room}/get")
    public void get(@DestinationVariable String room, HelloMessage message) {
        /*if (RoomManager.getRooms().contains(roomId)) {
        	return true;
        } else {
        	return false;
        }*/
		simpMessagingTemplate.convertAndSend("/room/" + room, new RoomMessage(" Hello (with simpMessagingTemplate), " + message.getName() + "!"));
    }
	
	@MessageMapping("/room/{room}/play")
	public void play(@DestinationVariable String room) {
		this.setRoomToPlaybackStatus(room, PlaybackStatus.PLAYING);
	}
	
	@MessageMapping("/room/{room}/pause")
	public void pause(@DestinationVariable String room) {
		this.setRoomToPlaybackStatus(room, PlaybackStatus.PAUSED);
	}
	
	@MessageMapping("/room/{room}/seek")
	public void seek(@DestinationVariable String room, SeekMessage message) {
		Room roomInstance = RoomService.getRoom(room);
		roomInstance.setSeek(message.getMilliseconds());
	}
	
	@MessageMapping("/room/{room}/add")
	public void addMedia(@DestinationVariable String room, MediaMessage message) {
		Room roomInstance = RoomService.getRoom(room);
		roomInstance.addMedia(new Media(message.getId(), message.getLength()));
	}
	
	@MessageMapping("/room/{room}/remove")
	public void removeMedia(@DestinationVariable String room, MediaMessage message) {
		Room roomInstance = RoomService.getRoom(room);
		roomInstance.removeMedia(message.getId());
	}
	
	private void setRoomToPlaybackStatus(String room, PlaybackStatus playbackStatus) {
		Room roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			roomInstance.setPlaybackStatus(playbackStatus);
		}
	}
}
