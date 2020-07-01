// Bring in package
const mysql = require('mysql2')

// Create connection to MySQL
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
})

console.log('Connected to MySQL')

// Insert into the 'local_weather' table
const mysqlInsertData = (obj) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO local_weather (time, temperature, humidity, pressure, windSpeed, uvIndex, visibility) values '
        sql += `(${obj.time}, ${obj.temperature}, ${obj.humidity}, ${obj.pressure}, ${obj.windSpeed}, ${obj.uvIndex}, ${obj.visibility})`
        pool.query(sql, ((err, rows, fields) => {
            // Connection is automatically released when query resolves
            if (err) {
                reject(`Insert error: ${err}`)
            }
            resolve()
        }))
    })
}

// disconnect from MySQL
const mysqlExit = () => {
    pool.end((err) => {
        if (err) console.log(`Exit MySQL with error: ${err}`)
        else console.log('Exit MySQL')
    })
}

module.exports = { mysqlInsertData, mysqlExit }