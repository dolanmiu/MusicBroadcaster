package com.poo.musicbroadcaster.client.mocks;

import java.util.Map;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.core.MessagePostProcessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

public class SimpMessagingTemplateMock implements SimpMessageSendingOperations {

	@Override
	public void send(Message<?> message) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void send(String destination, Message<?> message) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSend(Object payload) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSend(String destination, Object payload) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSend(String destination, Object payload, Map<String, Object> headers) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSend(Object payload, MessagePostProcessor postProcessor) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSend(String destination, Object payload, MessagePostProcessor postProcessor) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSend(String destination, Object payload, Map<String, Object> headers, MessagePostProcessor postProcessor) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSendToUser(String user, String destination, Object payload) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSendToUser(String user, String destination, Object payload, Map<String, Object> headers) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSendToUser(String user, String destination, Object payload, MessagePostProcessor postProcessor) throws MessagingException {
		// TODO Auto-generated method stub

	}

	@Override
	public void convertAndSendToUser(String user, String destination, Object payload, Map<String, Object> headers, MessagePostProcessor postProcessor) throws MessagingException {
		// TODO Auto-generated method stub

	}

}
