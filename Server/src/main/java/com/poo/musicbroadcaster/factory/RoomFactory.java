package com.poo.musicbroadcaster.factory;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;

import com.poo.musicbroadcaster.model.IRoom;
import com.poo.musicbroadcaster.model.Room;
import com.poo.musicbroadcaster.model.client.outbound.SeekMessage;
import com.poo.musicbroadcaster.model.timer.ISongTimer;
import com.poo.musicbroadcaster.model.timer.SongTimer;
import com.poo.musicbroadcaster.model.timer.StopWatch;

public class RoomFactory implements IRoomFactory {

	private SimpMessagingTemplate simpMessagingTemplate;
	private TaskScheduler taskScheduler;

	public RoomFactory(SimpMessagingTemplate simpMessagingTemplate, TaskScheduler taskScheduler) {
		this.simpMessagingTemplate = simpMessagingTemplate;
		this.taskScheduler = taskScheduler;
	}

	@Override
	public IRoom newInstance(String name) {
		ISongTimer songTimer = new SongTimer(taskScheduler, new StopWatch());
		songTimer.setTickTask(1000, () -> {
			this.simpMessagingTemplate.convertAndSend("/room/" + name, new SeekMessage(songTimer.getSeek()));
		});
		IRoom room = new Room(name, songTimer, simpMessagingTemplate);
		return room;
	}

}
