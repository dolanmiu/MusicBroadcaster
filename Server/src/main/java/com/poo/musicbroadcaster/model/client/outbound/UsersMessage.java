package com.poo.musicbroadcaster.model.client.outbound;

import java.util.Map;

import com.poo.musicbroadcaster.model.user.IUser;

public class UsersMessage extends OutBoundMessage {
	private Map<String, IUser> users;
	
	public UsersMessage(Map<String, IUser> users) {
		this.users = users;
	}
	
	public Map<String, IUser> getUsers() {
		return this.users;
	}
}
