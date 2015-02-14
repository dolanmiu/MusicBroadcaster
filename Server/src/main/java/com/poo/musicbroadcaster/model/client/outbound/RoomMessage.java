package com.poo.musicbroadcaster.model.client.outbound;

public class RoomMessage extends OutBoundMessage{
    
    private String content;

    public RoomMessage(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

}
