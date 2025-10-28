function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	completed_count = 0;
	live_count = 0;
	achievement_count = 0;
	misc_count = 0;
	written_count = 0;

	for (var i = 0; i < tweet_array.length; i++) {
		tweet_type = tweet_array[i].source;
		if (tweet_type == "completed_event") {
			completed_count += 1;
			if (tweet_array[i].written == true) {
				written_count += 1;
			}
		}
		else if (tweet_type == "live_event") {
			live_count += 1;
		}
		else if (tweet_type == "achievement") {
			achievement_count += 1;
		}
		else if (tweet_type == "miscellaneous") {
			misc_count += 1;
		}
	}

	completed_pct = math.format((completed_count/tweet_array.length)*100, {notation: 'fixed', precision: 2});
	live_pct = math.format((live_count/tweet_array.length)*100, {notation: 'fixed', precision: 2});
	achievement_pct = math.format((achievement_count/tweet_array.length)*100, {notation: 'fixed', precision: 2});
	misc_pct = math.format((misc_count/tweet_array.length)*100, {notation: 'fixed', precision: 2});
	written_pct = math.format((written_count/tweet_array.length)*100, {notation: 'fixed', precision: 2});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// Modify number of tweets in each category
	const completedTweets = document.getElementsByClassName('completedEvents');
	for (let i = 0; i < completedTweets.length; i++) {
    	completedTweets[i].innerText = completed_count;
	}
	document.querySelector('.liveEvents').innerHTML = live_count;
	document.querySelector('.achievements').innerHTML = achievement_count;
	document.querySelector('.miscellaneous').innerHTML = misc_count;
	document.querySelector('.written').innerHTML = written_count;

	// Modify percentage for each category
	document.querySelector('.completedEventsPct').innerHTML = completed_pct + "%";
	document.querySelector('.liveEventsPct').innerHTML = live_pct + "%";
	document.querySelector('.achievementsPct').innerHTML = achievement_pct + "%";
	document.querySelector('.miscellaneousPct').innerHTML = misc_pct + "%";
	document.querySelector('.writtenPct').innerHTML = written_pct + "%";

	const date_array = [];
	for (var i = 0; i < tweet_array.length; i++) {
		tweet_date = tweet_array[i].time;
		date_array.push(tweet_date);
	}

	date_array.sort((a, b) => a.getTime() - b.getTime());
	const earliestDate = date_array[0];
	const latestDate = date_array[date_array.length - 1];

	document.getElementById('firstDate').innerHTML = earliestDate.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	});

	document.getElementById('lastDate').innerHTML = latestDate.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});