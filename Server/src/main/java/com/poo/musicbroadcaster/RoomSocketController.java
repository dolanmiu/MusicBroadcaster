package com.poo.musicbroadcaster;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class RoomSocketController {

	@MessageMapping("/room/greet/blah")
    @SendTo("/room/blah")
    public String greet(String greeting) throws Exception {
        /*if (RoomManager.getRooms().contains(roomId)) {
        	return true;
        } else {
        	return false;
        }*/
		return greeting;
        //return new Greeting("Hello, " + message.getName() + "!");
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
