package com.poo.musicbroadcaster.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.poo.musicbroadcaster.model.IRoom;
import com.poo.musicbroadcaster.model.ISongTimer;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.SongTimer;
import com.poo.musicbroadcaster.model.client.outbound.SeekMessage;

public class RoomFactory implements IRoomFactory {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	public RoomFactory() {
	}

	@Override
	public IRoom newInstance(String name) {
		ISongTimer songTimer = new SongTimer();
		songTimer.setTickTask(1000, () -> {
			this.simpMessagingTemplate.convertAndSend("/room/" + name, new SeekMessage(songTimer.getSeek()));
		});
		IRoom room = new Room(name, songTimer, simpMessagingTemplate);
		return room;
	}

}
