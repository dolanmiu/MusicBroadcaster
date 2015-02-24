package com.poo.musicbroadcaster.factory;

import com.poo.musicbroadcaster.model.IRoom;

public interface IRoomFactory {
	IRoom newInstance(String name);
}
