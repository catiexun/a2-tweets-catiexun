class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith('Just completed') || this.text.startsWith('Just posted')) {
            return "completed_event";
        }

        else if (this.text.startsWith("Watch my")) {
            return "live_event";
        }

        else if (this.text.startsWith("Achieved a new personal record with #Runkeeper")) {
            return "achievement";
        }

        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes("Check it out!") || this.text.includes("@Runkeeper Live") || this.text.includes("TomTom MySports Watch")) {
            return false;
        }
        else {
            return true;
        }
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        const startMarker = " - ";
        const endMarker = "https://t.co/";

        const startIndex = this.text.indexOf(startMarker) + startMarker.length;
        const endIndex = this.text.indexOf(endMarker, startIndex);
        const writtenText = this.text.substring(startIndex, endIndex);

        return writtenText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        else if (this.text.includes("run")) {
            return "run";
        }
        else if (this.text.includes("bike")) {
            return "bike";
        }
        else if (this.text.includes("walk")) {
            return "walk";
        }
        else if (this.text.includes("elliptical")) {
            return "elliptical";
        }
        else if (this.text.includes("chair ride")) {
            return "chair ride";
        }
        else {
            return "other";
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet
        if(this.text.startsWith("Just completed") && this.text.includes(" mi ")) {
            const startMarker = "Just completed a ";
            const endMarker = " mi ";

            const startIndex = this.text.indexOf(startMarker) + startMarker.length;
            const endIndex = this.text.indexOf(endMarker, startIndex);
            const distanceStr = this.text.substring(startIndex, endIndex);

            return +distanceStr;
        }
        else if (this.text.startsWith("Just posted") && this.text.includes(" mi ")) {
            const startMarker = "Just posted a ";
            const endMarker = " mi ";

            const startIndex = this.text.indexOf(startMarker) + startMarker.length;
            const endIndex = this.text.indexOf(endMarker, startIndex);
            const distanceStr = this.text.substring(startIndex, endIndex);

            return +distanceStr;
        }

        else if (this.text.startsWith("Just completed") && this.text.includes(" km ")) {
            const startMarker = "Just posted a ";
            const endMarker = " km ";

            const startIndex = this.text.indexOf(startMarker) + startMarker.length;
            const endIndex = this.text.indexOf(endMarker, startIndex);
            const distanceStr = this.text.substring(startIndex, endIndex);

            return +distanceStr / 1.609;
        }

        else if (this.text.startsWith("Just posted") && this.text.includes(" km ")) {
            const startMarker = "Just posted a ";
            const endMarker = " km ";

            const startIndex = this.text.indexOf(startMarker) + startMarker.length;
            const endIndex = this.text.indexOf(endMarker, startIndex);
            const distanceStr = this.text.substring(startIndex, endIndex);

            return +distanceStr / 1.609;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}