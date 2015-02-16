package com.poo.musicbroadcaster;

import java.util.concurrent.ExecutionException;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.poo.musicbroadcaster.model.IRoom;
import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.client.inbound.MediaMessage;
import com.poo.musicbroadcaster.model.client.inbound.SeekMessage;

@Controller
public class RoomSocketController {
	
	@MessageMapping("/room/{room}/state")
	public void getState(@DestinationVariable String room) {
		IRoom roomInstance = RoomService.getRoom(room);
		//roomInstance.sendState();
	}

	@MessageMapping("/room/{room}/play")
	public void play(@DestinationVariable String room) throws InterruptedException, ExecutionException {
		System.out.println("RECEIVED PLAY WEBSOCKET COMMAND");
		IRoom roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			roomInstance.play();
		}
	}

	@MessageMapping("/room/{room}/pause")
	public void pause(@DestinationVariable String room) {
		System.out.println("RECEIVED PAUSE WEBSOCKET COMMAND");
		IRoom roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			roomInstance.pause();
		}
	}

	@MessageMapping("/room/{room}/seek")
	public void seek(@DestinationVariable String room, SeekMessage message) {
		System.out.println("RECEIVED SEEK WEBSOCKET COMMAND");
		IRoom roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			roomInstance.setSeek(message.getMilliseconds());
		}
	}

	@MessageMapping("/room/{room}/add")
	public void addMedia(@DestinationVariable String room, MediaMessage message) {
		System.out.println("RECEIVED ADD MEDIA WEBSOCKET COMMAND: " + message.getId() + ", WITH LENGTH: " + message.getLength());
		IRoom roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			System.out.println("Gotten room, now adding media");
			roomInstance.addMedia(new Media(message.getId(), message.getLength()));
		} else {
			System.out.println("Could not get room: " + room);
		}
	}

	@MessageMapping("/room/{room}/remove")
	public void removeMedia(@DestinationVariable String room, MediaMessage message) {
		System.out.println("RECEIVED REMOVE MEDIA WEBSOCKET COMMAND");
		IRoom roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			roomInstance.removeMedia(message.getId());
		}
	}

	/*@MessageMapping("/room/{room}/queue")
	public void getQueue(@DestinationVariable String room) {
		IRoom roomInstance = RoomService.getRoom(room);
		if (roomInstance != null) {
			roomInstance.sendSongQueue();
		}
	}*/
}
