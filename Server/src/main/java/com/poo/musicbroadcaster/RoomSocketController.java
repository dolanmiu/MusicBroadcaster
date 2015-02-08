package com.poo.musicbroadcaster;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.poo.musicbroadcaster.model.Greeting;
import com.poo.musicbroadcaster.model.PlaybackStatus;
import com.poo.musicbroadcaster.model.Room;

@Controller
public class RoomSocketController {
	
	@Autowired 
	private SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/room/{room}/get")
    public void get(@DestinationVariable String room, Greeting message) {
        /*if (RoomManager.getRooms().contains(roomId)) {
        	return true;
        } else {
        	return false;
        }*/
		simpMessagingTemplate.convertAndSend("/room/" + room, new Greeting(" Hello (with simpMessagingTemplate), " + message.getContent() + "!"));
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
	public void seek(@DestinationVariable String room) {
		this.setRoomToPlaybackStatus(room, PlaybackStatus.PLAYING);
	}
	
	private void setRoomToPlaybackStatus(String room, PlaybackStatus playbackStatus) {
		Room roomInstance = RoomService.getRooms().get(room);
		roomInstance.setPlaybackStatus(PlaybackStatus.PLAYING);
		simpMessagingTemplate.convertAndSend("/room/" + room, playbackStatus);
	}
}
