const { MongoClient, ObjectID } = require('mongodb')

// setup MongoDB parameters
const connectionURL = process.env.MONGODB_URL
const databaseName = process.env.MONGODB_DATABASE
const collectionName = process.env.MONGODB_COLLECTION

// Create connection for the duration of the connection. By default, MongoDB maintains 5 connection pool
const client = new MongoClient(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = client.connect()

console.log('Connected to MongoDB')

// Retrieve today data
const mongodbGetTodayData = ((callback) => {
    // Today 0 hour in milliseconds
    let now = new Date()
    // Get the time in second since epoch
    let start = new Date(now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate()).getTime() / 1000

    // Get the connection
    const connect = connection
    connect.then(() => {
        const db = client.db(databaseName)
        db.collection(collectionName).find({
            time: { $gte: start }
        }).toArray((err, docs) => {
            if (err) {  // return error message
                return callback(`Retrieve MongoDB data error: ${err}`)
            }
            callback(undefined, docs)
        })
    })
})

// Insert into mongodb
const mongodbInsertEntry = ((obj) => {
    const connect = connection
    connect.then(() => {
        const db = client.db(databaseName)
        db.collection(collectionName).insertOne(obj, (err, result) => {
            if (err) { // return error message
                return console.log(`Insert into MongoDB error: ${err}`)
            }
        })
    })
})

// close connection to exit mongodb
const mongodbExit = (() => {
    client.close()
    console.log('Exit MongoDB')
})

module.exports = {
    mongodbExit,
    mongodbInsertEntry,
    mongodbGetTodayData
}