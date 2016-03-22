var express = require('express');
var path = require('path');
var app = require('express')();
var port = process.env.PORT || 3000;
var server = require('http').Server(app);
var morgan = require('morgan');
var io = require('socket.io')(server);
var request = require('request');

var queriesDB = require('./controllers/db').tweet_queries;
var tweetsDB = require('./controllers/db').tweet_sentiments;


app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));


server.listen(port);
console.log('Server listening on port: '+port);

io.on('connection', function(socket){
   
    socket.on('searchTweetDB', function(tweet, callback){
        
		tweetsDB.getTweets(tweet, function(err, data){
			//io.emit("displayTweets", data);
			console.log("search query", tweet);
			callback(err);
		});
    });
    
    socket.on('searchTweetStream', function(tweet){
        
        console.log("stream text value "+ tweet);
        
        io.emit("displayTweets", null);
        
        request({
            url:'http://localhost:5000/s/'+tweet, 
            method: 'GET',
            body: tweet
            
            
        },function(error, response, body){
            
     
            if(!error && response.statusCode == 200){

                var bodyData = JSON.parse(body);
                console.log("the request body OK")//, bodyData.result);
                
                io.emit("displayTweets", bodyData.result);
            }else{
                console.log("Error while requesting page!", error)
            }

            
        });
    })
    
    socket.on('addQuery', function(query, callback){
        queriesDB.addQuery({'text':query},function(err, data){
            if(err)
                console.log("Add query error ", err);
            
            console.log("Add query success ", data);
        });
        
        queriesDB.getAllQueries(function(err, data){
            if(err)
                console.log("Error getting query data ", err);
            
            var nond = removeDuplicates(data);
            io.emit('displayQueries', nond);
            
            console.log("emiitted display queries " + nond)
        });
                                
    })
    
});

var removeDuplicates = function(arr){
    var out = []
    var bol = false;
    for(var i=0; i < arr.length; i++){
        for(var k =0; k < out.length; k++){
            if(out[k].text === arr[i].text){
                bol = true;
            }
        }
        if(bol == false){
            out.push(arr[i]);
        }else{
            bol = false
        }
    }
    return out;
};
