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

	// Array for top 3 activity types & distance
	const plot2Data = [];
	const topActivities = activityCountArr.slice(0, 3).map(tweet => tweet.activityType);
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const topActivitiesArr = completedArr.filter(tweet =>
		topActivities.includes(tweet.activityType) &&
		tweet.distance > 0
	);

	topActivitiesArr.forEach(tweet => {
		plot2Data.push({
			day: dayNames[tweet.time.getDay()],
			distance: tweet.distance,
			activityType: tweet.activityType
		});
	});

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCountArr
	  },
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

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A scatterplot graph of the distances of the top three most tweeted-about activites by day of week.",
	  "data": {
	    "values": plot2Data
	  },
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "day",
			"type": "nominal",
			"title": "Time (Day of Week)",
			"sort": dayNames,
		},
		"y": {
			"field": "distance",
			"type": "quantitative",
			"title": "Distance (mi)"
		},
		"color": {
			"field": "activityType",
			"type": "nominal",
			"title": "Activity Type"
		}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	mean_distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A scatterplot graph of the distances of the top three most tweeted-about activites by day of week.",
	  "data": {
	    "values": plot2Data
	  },
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "day",
			"type": "nominal",
			"title": "Time (Day of Week)",
			"sort": dayNames,
		},
		"y": {
			"field": "distance",
			"type": "quantitative",
			"title": "Mean of Distance (mi)",
			"aggregate": "mean"
		},
		"color": {
			"field": "activityType",
			"type": "nominal",
			"title": "Activity Type"
		}
	  }
	};

	let showingMeans = false;

	const showMeansButton = document.getElementById('aggregate');
	const activityVis = document.getElementById('activityVis');

	showMeansButton.addEventListener('click', function() {
		if (showingMeans) {
			vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
			showMeansButton.textContent = "Show Means"
		}
		else {
			vegaEmbed('#distanceVis', mean_distance_vis_spec, {actions:false});
			showMeansButton.textContent = "Show All Activities";
		}
		showingMeans = !showingMeans;
	}) 

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