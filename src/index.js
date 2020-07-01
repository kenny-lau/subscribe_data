// Bring in packages
const { subscribeWeatherData, unsubscribeWeatherData } = require('./mqtt')
const { mysqlInsertData, mysqlExit } = require('./mysql')
const { mongodbExit, mongodbInsertEntry, mongodbGetTodayData } = require('./mongo')

console.log('Ready to subscribe...')

// Subscribe to weather data and wait for callback data
// Once the data is ready, it can be processed for designed purpose
subscribeWeatherData((err, message) => {
    if (err) {
        console.log(err)
    } else {
        const data = JSON.parse(message)
        mysqlInsertData(data).then(() => {
            return mongodbInsertEntry(data)
        }).then(() => {
            console.log(`Data stamped: ${new Date(data.time * 1000).toISOString()}`)
        }).catch((error) => {
            console.log(error)
        })
    }
})

// Catch the Control-C to disconnect from database and unsubscribe the mqtt message
const sigHandler = (signal) => {
    console.log(`Received ${signal}`)
    mysqlExit()
    mongodbExit()
    unsubscribeWeatherData()
    process.exit(1)
}
process.on('SIGINT', sigHandler)