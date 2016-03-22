var mongojs = require('mongojs');

var db = mongojs("mongodb://localhost:27017/northlondon", ['tweet_queries','tweet_sentiments']);

var tweet_queries = {
	addQuery: function(q, callback){
		db.tweet_queries.insert(q, callback);
	},

	getAllQueries: function(callback){
		db.tweet_queries.find(callback);
	}

}

var tweet_sentiments ={
	getTweets: function(q, callback){
		db.tweet_sentiments.find({'term': q}, callback)
	}
}

module.exports = {
	tweet_queries : tweet_queries,
	tweet_sentiments: tweet_sentiments
}