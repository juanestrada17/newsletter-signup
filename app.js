const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();


var server = 'us14'; //usX
var listId= 'cc241ef74f'; // Your list Id
var appiKey = '17cf4b9212f4833c3ec5f6021b27f040-us14'; // Your api key


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    var data =
            {
                'email_address': req.body.email,
                'status': 'subscribed',
                'merge_fields':{
                    'FNAME': req.body.firstName,
                    'LNAME': req.body.lastName
                }

            };


    var jsonData = JSON.stringify(data);
    const url = 'https://' + server + '.api.mailchimp.com/3.0/lists/' + listId + '/members/';
    const options ={
        method: "POST",
        auth: "anyname:"+appiKey
    }

    const requestt = https.request(url,options,function(response){

      if (response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
//requests something to the server and ends connection
    requestt.write(jsonData);
    requestt.end();

})

app.post("/failure", function(req, res){
  res.redirect("/")
})

// the || is like an or for the two ports

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
})
