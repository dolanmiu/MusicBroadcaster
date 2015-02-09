package com.poo.musicbroadcaster.client;

import org.junit.Before;
import org.junit.Test;

import com.poo.musicbroadcaster.client.mocks.SimpMessagingTemplateMock;
import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.SongTimer;

public class RoomTests {

	private Room room;
	
	@Before
	public void setup() {
		room = new Room("testRoom", new SongTimer(), new SimpMessagingTemplateMock());
		room.addMedia(new Media("dfgd55y4", 3000));
	}

	@Test
	public void testIfRoomCanSeek() {
		room.setSeek(2000);
	}

	@Test
	public void testIfRoomCanOverSeek() {
		room.setSeek(4000);
	}
}
