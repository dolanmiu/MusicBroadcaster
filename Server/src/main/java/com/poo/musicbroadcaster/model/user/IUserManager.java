package com.poo.musicbroadcaster.model.user;

import java.util.Map;

public interface IUserManager {

	void addUser(String userId);

	Map<String, IUser> getUsers();

	int getUserCount();

}
