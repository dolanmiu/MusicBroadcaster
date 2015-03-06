package com.poo.musicbroadcaster.model.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.scheduling.TaskScheduler;

public class UserManager implements IUserManager {

	private Map<String, IUser> users;
	private long userTimeOut;
	private TaskScheduler taskScheduler;

	public UserManager(TaskScheduler taskScheduler, long userTimeOut) {
		this.users = new HashMap<String, IUser>();
		this.userTimeOut = userTimeOut;
		this.taskScheduler = taskScheduler;
	}

	@Override
	public void addUser(String userId) {
		if (this.users.containsKey(userId)) {
			IUser user = this.users.get(userId);
			user.resuscitate();
		} else {
			IUser user = new User(taskScheduler, () -> {
				this.users.remove(userId);
			}, userTimeOut);
			this.users.put(userId, user);
		}
	}

	@Override
	public Map<String, IUser> getUsers() {
		return this.users;
	}

	@Override
	public int getUserCount() {
		return this.users.size();
	}
}
