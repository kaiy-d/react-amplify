/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
var AWS = require('aws-sdk')

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

AWS.config.update({
  region: 'us-east-2',
  endpoint: 'http://localhost:8080',
})

var docClient = new AWS.DynamoDB.DocumentClient()

var table = 'wpDB'

var params = {
  TableName: table,
}
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

/**********************
 * Example get method *
 **********************/

app.get('/w', function(req, res) {
  // Add your code here

  docClient.get(params, function(err, data) {
    if (err) {
      res.json({
        'Unable to read item. Error JSON:': JSON.stringify(err, null, 2),
      })
    } else {
      res.json({ 'GetItem succeeded:': JSON.stringify(data, null, 2) })
    }
  })

  res.json({ success: 'get call succeed!', url: req.url })
})

app.get('/w/*', function(req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url })
})

/****************************
 * Example post method *
 ****************************/

app.post('/w', function(req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

app.post('/w/*', function(req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

/****************************
 * Example put method *
 ****************************/

app.put('/w', function(req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

app.put('/w/*', function(req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

/****************************
 * Example delete method *
 ****************************/

app.delete('/w', function(req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})

app.delete('/w/*', function(req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})

app.listen(3000, function() {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
