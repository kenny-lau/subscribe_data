// Define parameters
const mqtt = require('mqtt')
const server = 'mqtt:' + process.env.MQTT_SERVER
const topic = process.env.MQTT_TOPIC

// connect to MQTT broker
const client = mqtt.connect(server)

// Subscribe to a specific topic
const subscribeWeatherData = (callback) => {
    client.on('connect', () => {
        console.log(`Connected: ${server}`)

        client.subscribe(topic, (err) => {
            if (err) {
                callback('Unable to subscribe weather data')
            }
        })
    })

    client.on('message', function (topic, message) {
        // message is Buffer
        callback(undefined, message.toString())
    })
}

// Actually it is terminated connection to MQTT broker
const unsubscribeWeatherData = () => {
    client.end()
}

module.exports = {
    subscribeWeatherData,
    unsubscribeWeatherData
}