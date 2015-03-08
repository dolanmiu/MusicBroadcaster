package com.poo.musicbroadcaster.client;

import org.junit.Before;
import org.junit.Test;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

import com.google.common.base.Stopwatch;
import com.poo.musicbroadcaster.client.mocks.SimpMessagingTemplateMock;
import com.poo.musicbroadcaster.model.Media;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.timer.ISongTimer;
import com.poo.musicbroadcaster.model.timer.SongTimer;
import com.poo.musicbroadcaster.model.user.IUserManager;
import com.poo.musicbroadcaster.model.user.UserManager;

public class RoomTests {

	private Room room;
	
	@Before
	public void setup() {
		TaskScheduler ts = new ConcurrentTaskScheduler();
		IUserManager userManager = new UserManager(ts, 10000);
		ISongTimer songTimer = new SongTimer(ts, Stopwatch.createUnstarted());
		songTimer.setTickTask(() -> {}, 1000);
		
		room = new Room("testRoom", songTimer, new SimpMessagingTemplateMock(), ts, userManager);
		room.addMedia(new Media("dfgd55y4", 3000, "", ""));
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
