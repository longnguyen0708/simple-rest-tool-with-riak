
/**

Mighty Gumball, Inc.
Version 1.0

- Rudimentary Page Templates using RegEx
- REST Client Calling Grails GORM Scaffolded REST Controller

NodeJS-Enabled Standing Gumball
Model# M102988
Serial# 1234998871109

**/

//var endpoint = "http://ec2-52-24-214-120.us-west-2.compute.amazonaws.com/GrailsGumballMachineVer2-2.0/gumballs/1";
//var endpoint = "http://52.37.206.32:8098/riak/gumballs/1";
var endpoint = "http://myloadbalancer-218054516.us-west-2.elb.amazonaws.com:8098/riak/gumballs/1";


var fs = require('fs');
var express = require('express');
var Client = require('node-rest-client').Client;

var app = express();
app.use(express.bodyParser());
app.use("/images", express.static(__dirname + '/images'));

var page = function( req, res, url, payload, result ) {
    body = fs.readFileSync('./gumball.html');
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);

    console.log("url: " + url);
    console.log("payload: " + payload);
    console.log("result: " + result);
        var html_body = "" + body ;
        var html_body = html_body.replace("{url}", url );
       	var html_body = html_body.replace("{payload}", payload );            
	var html_body = html_body.replace("{result}", result );  
	res.end( html_body );
           
}



var doGet = function(req, res, url, payload) {
    var client = new Client();
            client.get( url,
                function(data, response_raw) {
                    console.log( "data = \n" + JSON.stringify(data) ) ;
		    page(req, res, url, payload, JSON.stringify(data));
                }    
		);
}

var doPut = function(req, res, url, payload) {
    var client = new Client();
	 var args = {
                        data: payload,
                        headers:{"Content-Type": "application/json"}
                    };
                    client.put( url, args,
                        function(data, response_raw) {
                            console.log(data);
                            page( req, res, url, payload, data ) ;
                        }
                    );
}

var doDelete = function(req, res, url, payload) {
    var client = new Client();
            client.delete( url,
                function(data, response_raw) {
                    console.log( "data = \n" + JSON.stringify(data) ) ;
                    page(req, res, url, "", data);
                }   
                );
}

var handle_post = function (req, res) {
    console.log( "Post: " + "Action: " +  req.body.event + "\n" ) ;

	var url = "" + req.body.url ;
    	var action = "" + req.body.event ;
	var payload = "" + req.body.payload ;
 	console.log("url: " + url);
    console.log("payload: " + payload);

    if ( action == "Get Data" ) {
    	doGet(req, res, url, payload);
    }
    else if ( action == "Put Data" ) {
    	doPut(req, res, url, payload);
    } 
    else if ( action == "Delete Data") {
	doDelete(req, res, url, payload);
    } 	
}

var handle_get = function (req, res) {
    console.log( "Get: ..." ) ;
    page( req, res, "", "", "" ) ;
}

app.post("*", handle_post );
app.get( "*", handle_get ) ;

//console.log( "Server running on Port 8080..." ) ;

//app.listen(8080);

app.set('port', (process.env.PORT || 5000));


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
