package com.poo.musicbroadcaster.factory;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;

import com.google.common.base.Stopwatch;
import com.poo.musicbroadcaster.model.IRoom;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.timer.ISongTimer;
import com.poo.musicbroadcaster.model.timer.SongTimer;
import com.poo.musicbroadcaster.model.user.IUserManager;
import com.poo.musicbroadcaster.model.user.UserManager;

public class RoomFactory implements IRoomFactory {

	private SimpMessagingTemplate simpMessagingTemplate;
	private TaskScheduler taskScheduler;

	public RoomFactory(SimpMessagingTemplate simpMessagingTemplate, TaskScheduler taskScheduler) {
		this.simpMessagingTemplate = simpMessagingTemplate;
		this.taskScheduler = taskScheduler;
	}

	@Override
	public IRoom newInstance(String name) {
		ISongTimer songTimer = new SongTimer(taskScheduler, Stopwatch.createUnstarted());
		IUserManager userManager = new UserManager(taskScheduler, 5000);
		songTimer.setTickTask(() -> {
			//this.simpMessagingTemplate.convertAndSend("/room/" + name, new SeekMessage(songTimer.getSeek()));
		}, 1000);
		IRoom room = new Room(name, songTimer, simpMessagingTemplate, taskScheduler, userManager);
		return room;
	}

}
