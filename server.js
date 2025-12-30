const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { errorMessages } = require('@vue/compiler-sfc')
const {isEmptyPayload, isInvalidEmail} = require('./validator')

const { DB_USER, DB_PASS, DEV } = process.env
const dbAddress = '127.0.0.1:27017'

const url = DEV ? `mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@${dbAddress}?authSource=company_db`
console.log("full url:", url)
const client = new MongoClient(url);
const dbName = 'company_db'
const colName = 'employees'


app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))

app.get('/get-profile', async function (req, res) {
    // connect to mongodb database
    await client.connect()
    console.log("Connected successfully to server")

    // initiate or get the db & collection
    const db = client.db(dbName)
    const collection = db.collection(colName)

    // get data from the database
    const result = await collection.findOne({id:1})
    console.log(result)
    client.close()

    response = {}

    if (result !== null) {
        response = {
            name: result.name,
            email: result.email,
            interest: result.interest
        }
    } 

    res.send(response)

})

app.post('/update-profile', async function (req, res) {
    const payload =req.body
    console.log(payload)

    if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
        res.send({error: "invalid payload. Could not update user profile"})
    } else {
            // connect to mongodb database
        await client.connect()
        console.log("Connected successfully to server")

        // initiate databse and collection objects
        const db = client.db(dbName)
        const collection = db.collection(colName) 

        // save payload data to the database
        payload['id'] = 1;
        const updatedValues = { $set: payload }
        await collection.updateOne({id: 1},updatedValues, {upsert: true} )
        client.close()

        res.send({info: "user profile updated successfully"})
        
    }
})

const server = app.listen(3000, function () {
    console.log('app listening on port 3000')
})

module.exports = {
    app, 
    server
}