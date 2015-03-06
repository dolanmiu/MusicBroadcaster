package com.poo.musicbroadcaster.model.user;

import java.util.Date;
import java.util.concurrent.ScheduledFuture;

import org.springframework.scheduling.TaskScheduler;

public class User implements IUser {
	
	private TaskScheduler taskScheduler;
	private Runnable timeoutTask;
	private long timeOut;
	private ScheduledFuture<?> timeOutScheduledFuture;
	
	private long seek;
	
	public User(TaskScheduler taskScheduler, Runnable timeoutTask, long timeOut) {
		this.taskScheduler = taskScheduler;
		this.timeoutTask = timeoutTask;
		this.timeOut = timeOut;
		this.createTask();
	}
	
	private void createTask() {
		this.timeOutScheduledFuture = this.taskScheduler.schedule(this.timeoutTask, new Date(System.currentTimeMillis() + this.timeOut));
	}
	
	@Override
	public void resuscitate() {
		this.timeOutScheduledFuture.cancel(true);
		this.createTask();
	}

	@Override
	public void setSeek(long seek) {
		this.seek = seek;
	}

	@Override
	public long getSeek() {
		return this.seek;
	}

}
