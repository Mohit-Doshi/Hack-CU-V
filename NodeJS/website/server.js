var connect = require('connect');
// var serveStatic = require('serve-static');
var express = require('express')
var bodyParser = require('body-parser')
var mongodb = require('mongodb')
var ObjectID = require('mongodb').ObjectID
var path = require('path')

const http = require('http')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const accountSid = 'OMITTED FOR SECURITY'
const authToken = 'OMITTED FOR SECURITY';
const client = require('twilio')(accountSid, authToken);

var app = express()
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/PartyLink'
var db = {}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(serveStatic(path.join(__dirname, 'public')))

//
// var db = MongoClient.connect(url, function(err,client){
//   if(err){ console.log("Unable to connect to mongo server ERROR : ", err); }
//   else{
//     console.log("Connection succesful to ", url);
//     return client.db('PartyLink')
//   }
// })


app.get('/', function (req, res){
  var query = {};
  db.collection('Parties').find(query).toArray(function(err, result){
    if (err){console.log("Unable to query mongo server ERROR : ", err)}
    res.send(result);
  });
})

app.get('/test', function(req, res){
  var query = {};
  db.collection('Parties').find(query).toArray(function(err, result){
    if (err){console.log("Unable to query mongo server ERROR : ", err)}
    res.send(result[0]._id);
  });
})

app.post('/rsvp', function(req, res){

  console.log(req.body.form_response)
  var collection  = db.collection('Parties')
  collection.updateOne({"_id" : ObjectID(req.body.form_response.hidden.rsvpid)}, {$push: { RSVP : req.body.form_response.answers[1].text}})
  // MongoClient.connect(url, function(err,client){
  //   if(err){ console.log("Unable to connect to mongo server ERROR : ", err); }
  //   else{
  //     console.log("Connection succesful to ", url);
  //     const db = client.db('PartyLink');
  //     var collection = db.collection('Parties');
  //
  //     collection.update({"_id" : req.body.form_response.hidden.rsvpid}, {$push: { "RSVP" : req.body.form_response.answers[1].number}})
  //
  //   }
  // })
  res.json({"message":"Form added, thank you!"})
})

app.post('/invite', function(req, res){
  var numbersToMessage = ["+19253362763", "+12066641191", "+17024687497"]

  numbersToMessage.forEach(function(number){
    var message = client.messages.create({
      body: 'Please RSVP for the party at:\nhttps://developerplatform.typeform.com/to/dV8B3V?rsvpid=5c722e518c848a24544511e4',
      from: '+17025087860',
      to: number
    })
    .then(message => console.log(message.status))
    .done();
  });

  res.json({"message":"Texts sent!"})

})

app.post('/timeLeft', function(req, res){
  const twiml = new MessagingResponse();

  twiml.message(req.body.Body + 'There are 6 days and 18 hours till your event starts!\n-PartyLink');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.post('/',  function (req, res){
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

  console.log(req.body)
  res.json({"message":"Form added, thank you!"})
})


MongoClient.connect(url, function(err,client){
  if(err){ console.log("Unable to connect to mongo server ERROR : ", err); }
  else{
   console.log("Connection succesful to ", url);
    db = client.db('PartyLink')
    app.listen(3000)
  }
})



//connect().use(serveStatic(__dirname)).listen(8080, function(){
//    console.log('Server running on 8080...');
//});
