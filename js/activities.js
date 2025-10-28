function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const completedArr = tweet_array.filter(tweet => tweet.source === "completed_event");
	const activityCounts = {};
	completedArr.forEach(tweet => {
		const activity = tweet.activityType;
		if (activity && activity !== "unknown") {
			activityCounts[activity] = (activityCounts[activity] || 0) + 1;
		}
	});

	const activityCountArr = Object.entries(activityCounts).map(([activityType, count]) => {
		return {
			activityType: activityType,
			count: count
		};
	});
	activityCountArr.sort((a, b) => b.count - a.count);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCountArr
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": {
			"field": "count",
			"type": "quantitative",
			"title": "Number of Tweets"
		},
		"y": {
			"field": "activityType",
			"type": "nominal",
			"title": "Activity Type"
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	console.log("Total completed tweets:", completedArr.length);
	console.log("Tweet Activity Type: " + tweet_array[10].activityType);
	console.log("Tweet text: " + tweet_array[10].text);
	console.log("Tweet Time: " + tweet_array[10].time);
	console.log("Tweet Type: " + tweet_array[10].source);
	console.log("Distance: " + tweet_array[10].distance);
	console.log("Contains run: " + tweet_array[10].text.includes("run"));
	console.log(tweet_array[10].written);


	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	document.getElementById('numberActivities').innerHTML = activityCountArr.length;
	document.getElementById('firstMost').innerHTML = activityCountArr[0].activityType;
	document.getElementById('secondMost').innerHTML = activityCountArr[1].activityType;
	document.getElementById('thirdMost').innerHTML = activityCountArr[2].activityType;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});