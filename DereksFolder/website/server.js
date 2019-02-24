var connect = require('connect');
// var serveStatic = require('serve-static');
var express = require('express')
var bodyParser = require('body-parser')
var mongodb = require('mongodb')
var path = require('path')

var app = express()
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/PartyLink'

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(serveStatic(path.join(__dirname, 'public')))


app.get('/', function (req, res){
  MongoClient.connect(url, function(err,client){
    if(err){console.log("Unable to connect to mongo server ERROR : ", err);}
    var db = client.db('PartyLink');
    var query = {};
    db.collection('Parties').find(query).toArray(function(err, result){
      if (err){console.log("Unable to query mongo server ERROR : ", err)}
      res.send(result);
    });
  })
})

app.get('/test', function(req, res){
  MongoClient.connect(url, function(err,client){
    if(err){console.log("Unable to connect to mongo server ERROR : ", err);}
    var db = client.db('PartyLink');
    var query = {};
    db.collection('Parties').find(query).toArray(function(err, result){
      if (err){console.log("Unable to query mongo server ERROR : ", err)}
      res.send(result[0]._id);
    });
  })
})

app.post('/rsvp', function(req, res){

})

app.post('/',  function (req, res){
  MongoClient.connect(url, function(err,client){
    if(err){
      console.log("Unable to connect to mongo server ERROR : ", err);
    }else{
      console.log("Connection succesful to ", url);
      const db = client.db('PartyLink');
      var collection = db.collection('Parties');

      var temp = {
        "hostName": req.body.form_response.answers[0].text,
        "email": req.body.form_response.answers[1].email,
        "address": req.body.form_response.answers[2].text,
        "studentID": req.body.form_response.answers[3].number,
        "phoneNumber": req.body.form_response.answers[4].text,
        "RSVP": []
      }
      // HOST EMAIL ADDRESS STUDENTID PHONE
      collection.insert(temp, function(err, result){
        if(err){
          console.log("ERROR ", err);
        }else{
          console.log("SUCCESS INSERTED")
        }
      });
    }
  })

  console.log(req.body)
  res.json({"message":"Form added, thank you!"})
})

app.listen(3000)

//connect().use(serveStatic(__dirname)).listen(8080, function(){
//    console.log('Server running on 8080...');
//});
