package com.poo.musicbroadcaster.model;

import java.util.concurrent.ExecutionException;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

import com.google.common.base.Stopwatch;
import com.poo.musicbroadcaster.model.timer.SongTimer;
import com.poo.musicbroadcaster.model.timer.SimpleStopWatch;

public class SongTimerTests {

	@Test
	public void testIfSongTimerWorks() throws InterruptedException, ExecutionException {
		SongTimer songTimer = new SongTimer(new ConcurrentTaskScheduler(), Stopwatch.createUnstarted());
		songTimer.setTickTask(() -> {
		}, 1000);
		Media media = new Media("dfg5gd3fghgj", 1000, "", "");
		songTimer.setMedia(media, () -> {
			System.out.println("Executed!");
			Assert.assertTrue(true);
		});

		System.out.println("Executed Async");
		songTimer.play();
		Thread.sleep(3000);
	}

	@Test
	public void testIfSongTimerCanPause() throws InterruptedException, ExecutionException {
		SongTimer songTimer = new SongTimer(new ConcurrentTaskScheduler(), Stopwatch.createUnstarted());
		songTimer.setTickTask(() -> {
		}, 1000);
		Media media = new Media("dfg5gd3fghgj", 5000, "", "");
		songTimer.setMedia(media, () -> {
			System.out.println("Finished Playing!");
			Assert.assertTrue(true);
		});

		long start = System.currentTimeMillis();
		System.out.println("Playing now...");
		songTimer.play();
		Thread.sleep(1000);
		System.out.println("Pausing...");
		songTimer.pause();
		Thread.sleep(2000);
		System.out.println("Playing again...");
		songTimer.play();
		Thread.sleep(5000);
		long timeElapsed = System.currentTimeMillis() - start;
		System.out.println("Time elapsed: " + timeElapsed);
	}

	@Test
	public void testIfSongTimerCanSeek() throws InterruptedException, ExecutionException {
		SongTimer songTimer = new SongTimer(new ConcurrentTaskScheduler(), Stopwatch.createUnstarted());
		songTimer.setTickTask(() -> {
			System.out.println("Seek: " + songTimer.getSeek());
		}, 1000);
		Media media = new Media("test", 5000, "", "");
		songTimer.setMedia(media, () -> {
			System.out.println("Finished Playing!");
			Assert.assertTrue(true);
		});

		System.out.println("Playing now...");
		songTimer.play();
		Thread.sleep(1000);
		System.out.println("Seeking...");
		songTimer.seek(3000);
		Thread.sleep(2000);
		songTimer.seek(1000);
		Thread.sleep(7000);
	}

	@Test
	public void testIfSongTimerCanSendTimeTask() throws InterruptedException, ExecutionException {
		SongTimer songTimer = new SongTimer(new ConcurrentTaskScheduler(), Stopwatch.createUnstarted());
		songTimer.setTickTask(() -> {
			System.out.println("working: " + songTimer.getSeek());
		}, 1000);
		Media media = new Media("timeinterval", 7000, "", "");

		songTimer.setMedia(media, () -> {
			System.out.println("Finished Playing!");
			Assert.assertTrue(true);
		});

		songTimer.play();
		Thread.sleep(10000);
	}

	@Test
	public void testIfSongTimerCanSendTimeTaskAndPause() throws InterruptedException, ExecutionException {
		SongTimer songTimer = new SongTimer(new ConcurrentTaskScheduler(), Stopwatch.createUnstarted());
		songTimer.setTickTask(() -> {
			System.out.println("working: " + songTimer.getSeek());
		}, 1000);
		Media media = new Media("timeinterval", 7000, "", "");

		songTimer.setMedia(media, () -> {
			System.out.println("Finished Playing!");
			Assert.assertTrue(true);
		});

		songTimer.play();
		Thread.sleep(3000);
		songTimer.pause();
		System.out.println("paused");
		Thread.sleep(6000);
	}

}
