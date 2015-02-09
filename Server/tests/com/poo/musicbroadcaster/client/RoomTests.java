package com.poo.musicbroadcaster.client;

import org.junit.Test;

import com.poo.musicbroadcaster.client.mocks.SimpMessagingTemplateMock;
import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.SongTimer;

public class RoomTests {

	@Test
	public void testIfRoomCanSeek() {
		Room room = new Room("testRoom", new SongTimer(), new SimpMessagingTemplateMock());
		room.addMedia(new Media("dfgd55y4", 3000));
		room.setTime(2000);
	}
}
