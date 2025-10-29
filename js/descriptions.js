var writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	//TODO: Filter to just the written tweets
	writtenTweets = tweet_array.filter(tweet => tweet.written === true);
	console.log("'", writtenTweets[3].writtenText, "'");
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var textInput = document.getElementById('textFilter')
	textInput.addEventListener('input', (event) => {
		const searchTerm = event.target.value.toLowerCase();
		document.getElementById('searchText').innerHTML = searchTerm;
		console.log('Search term:', searchTerm);
		if (searchTerm.length === 0) {
			// empty table
			document.getElementById('searchCount').innerHTML = 0;
		}
		else {
			var filteredTweets = writtenTweets.filter(tweet => tweet.writtenText.toLowerCase().includes(searchTerm));
			document.getElementById('searchCount').innerHTML = filteredTweets.length;
			// populate table
		}

	})
	
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});