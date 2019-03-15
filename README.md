# simplechain

This is a Connect Private Blockchain to Front-end via API using Nodejs RestFul API Framework sails.js.

## Steps to follow

1. Clone the repository to your local computer.
2. Open the terminal and install the packages: `npm install`.
3. Run your application `sails lift`.
4. Test your Endpoints with Curl or Postman.

## Examples
POSTMAN:
=======================================================================================================================================================
GET :
Test the API GET Endpoint:
Once the application is Started test you GET Point with Postman by selecting the GET from request type dropdown and accessing the url :
'http://localhost:8000/api/block/{BlockHeight}'
(ex: http://localhost:8000/api/block/1)
-------------------------------------------------------------------------------------------------------------------------------------------------------
POST:
Test the API POST Endpoint:
Once the application is Started test you POST Point with Postman by selecting the POST from request type dropdown and accessing the url:
'http://localhost:8000/api/block?{body=data}'
(ex: http://localhost:8000/api/block?body=Test)
=========================================================================================================================================================

Curl:
=========================================================================================================================================================
GET:
Test the API GET Endpoint:
Once the application is Started test you GET Point with Curl opening terminal or cmd and typing the command :
curl 'http://localhost:8000/api/block/{BlockHeight}'
(ex: curl http://localhost:8000/api/block/1)
----------------------------------------------------------------------------------------------------------------------------------------------------------
POST:
Test the API POST Endpoint:
Once the application is Started test you GET Point with Curl opening terminal or cmd and typing the command :
curl 'http://localhost:8000/api/block -d {"body=data"}'
(ex: curl http://localhost:8000/api/block -d "body=data")


=========================================================================================================================================================

NOTE : if you had a provide request payload the POST request will add new Block to the chain.

Did you read this far? You're awesome :)
