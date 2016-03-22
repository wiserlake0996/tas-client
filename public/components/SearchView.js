var SearchView = React.createClass({

    getInitialState: function(){
        return{
            tweetData: null  
        };
    },
    
    componentDidMount: function(){
        var that = this;
        this.socket = io();
        this.socket.on('displayTweets', function(data){
            that.setState({tweetData: data}); 
        });
    },
    
    _searchTweetDB: function(tweet, callback){
        this.socket.emit('addQuery',tweet, function(err){
            if(err)
                return console.error('add query emit error!', err);            
            callback();
        });
        
        this.socket.emit('searchTweetDB', tweet, function(err){
            if(err)
                return console.error('Tweet DB search emit error!', err);
            
            callback();
        });  
    },
    
    
    _searchTweetStream: function(tweet, callback){
        this.socket.emit('searchTweetStream', tweet, function(err){
            if(err)
                return console.error("Tweet stream search error!");
            callback();
        });
    },

	render: function(){
		return(
			<div id="searchContent" className="container">
				
                <div id = "formContainer">
				    <SearchForm searchDB={this._searchTweetDB} searchStream={this._searchTweetStream}/>
                </div>
            
                <div id="listContainer" className="container">
                    <h3>Tweets for "query-here" </h3>
				    <TweetList tweetData={this.state.tweetData}/> 
                </div>            
            
			</div>


		);
	}

});

var SearchForm = React.createClass({
    
    handleSubmit: function(e){
        e.preventDefault();
        
        var that = this;
        var input = this.refs.searchInput.value;
        this.props.searchStream(input, function(err){
            
        });

        this.props.searchDB(input, function(err){
            that.refs.searchInput.value = ''; 
        });
        
        
    },
	
	render: function(){
		return(
			<form onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmkFor = "searchInput" className = "sr-only">Search query</label>
					<input type="text" className="input-lg form-control" name="searchInput" ref="searchInput" /> 
				</div>
                        
			</form>
		);
	}
});


var TweetList = React.createClass({
	
	render: function(){
        
        var tweets = (<li> Tweets will appear here</li>);
                      
        if(this.props.tweetData){
            tweets = this.props.tweetData.map(function(data){
                return(
                    <ul className="tweetList">
                        <TweetItem tweet= {data}/>
                    </ul>
                );
            });
        }
        
		return(
			<ul className="tweetList">
                {tweets}
			</ul>
		);
	}
});


var TweetItem = React.createClass({
	
	render: function(){
		return(
			<li className="tweetItem">
				<p> <b>Sentiment Score:</b> {this.props.tweet.score} </p>
				<p> <b>Tweet Text:</b> {this.props.tweet.tweet}</p>
				<p> <b>Date: </b> {this.props.tweet.date}</p>
			</li>
		);
	}
});

ReactDOM.render(
  <SearchView />,
  document.getElementById('content')
);