Music Broadcast Server
=======================

This is the server component of the music broadcaster

# REST Calls

### To create a room
```
/room/create?name=[ROOM NAME HERE]
```

For example:
```
localhost:8080/room/create?name=my-very-nice-room
```

### To get all rooms
Maybe this isn't nessesarily needed, but I guess its good to have

```
/room/get
```

For example:

```
localhost:8080/room/get
```

### To get list of videos of a particular room

```
/room/[ROOM NAME HERE]/queue
```

For example:
```
localhost:8080/room/my-very-nice-room/queue
```

# Websocket calls
### Add a video
Use this link along with a JSON object specifying the video
```
app/room/[ROOM NAME HERE]/add
```

For example:
```
stompClient.send("/app/room/my-very-nice-room/add", {}, JSON.stringify({
    'id': id,
    'length': length
}));
```

### Remove a video
Use this link along with a JSON object specifying the video
```
app/room/[ROOM NAME HERE]/remove
```

For example:
```
stompClient.send("/app/room/my-very-nice-room/remove", {}, JSON.stringify({
    'id': id,
    'length': length
}));
```


# How to use
1. Create a room with a REST call
2. Connect to the websocket called "channels"
⋅⋅⋅E.g.
⋅⋅⋅```
⋅⋅⋅var socket = new SockJS('/SOCKET_NAME');
⋅⋅⋅stompClient = Stomp.over(socket);
⋅⋅⋅```
3. Subscribe to a channel
⋅⋅⋅E.g.
⋅⋅⋅```
⋅⋅⋅/room/my-very-nice-room
⋅⋅⋅```