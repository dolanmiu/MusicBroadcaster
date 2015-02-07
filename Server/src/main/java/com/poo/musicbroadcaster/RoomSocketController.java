package com.poo.musicbroadcaster;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class RoomSocketController {
	
	@Autowired 
	private SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/room/greet/{room}")
    public Greeting greet(@DestinationVariable String room, HelloMessage message) throws Exception {
        /*if (RoomManager.getRooms().contains(roomId)) {
        	return true;
        } else {
        	return false;
        }*/
		simpMessagingTemplate.convertAndSend("/room/" + room, new Greeting(" Hello (with simpMessagingTemplate), " + message.getName() + "!"));
        return new Greeting("Hello, " + room + "!");
    }
	
	@MessageMapping("/room/send/{roomId}")
    @SendTo("/room/{roomId}")
    public String sendData() throws Exception {
        /*if (RoomManager.getRooms().contains(roomId)) {
        	return true;
        } else {
        	return false;
        }*/
		return "hello";
        //return new Greeting("Hello, " + message.getName() + "!");
    }
}
