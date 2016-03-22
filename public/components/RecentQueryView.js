var RecentQueryView = React.createClass({
    
    getInitialState: function(){
        return{
            searchQueries: null    
        };
        
    },
    
    
    componentDidMount: function(){
        var that = this;
        this.socket= io();
        this.socket.on('displayQueries', function(data){
            console.log("Recent query on display ", data);
            that.setState({searchQueries:data});
        });
        
    },
    
    render: function(){
        return(
            <div id="searchQuery">
                <h4> Recent searches </h4>
                <QueryList queries={this.state.searchQueries}/>
            </div>
        );
    }
});


var QueryList = React.createClass({
   render: function(){
       var queries = (<li>query item</li>);
       if(this.props.queries){
           queries = this.props.queries.map(function(data){
               return(
                   
                    <ul>
                        <QueryItem query={data}/>
                    </ul>
               );
           });
       }    
       
       return(
            <ul>
                {queries}
           </ul>
       );
   } 
});


var QueryItem = React.createClass({
    render: function(){
        return(
            <li>
                <a href="#">{this.props.query.text}</a>
            </li>
        );
    }
})

ReactDOM.render(<RecentQueryView />, document.getElementById('sidebar'));