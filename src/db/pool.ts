import { Pool } from 'pg'
require('dotenv').config()
let db_config



if (process.env.ENVIRONMENT === "test") {
    console.log(process.env.ENVIRONMENT)
    db_config = {
        connectionString: process.env.DATABASE_URL_TEST,
        connectionTimeoutMillis: 1000,
        idleTimeoutMillis: 200,
        max: 20,
    }
} else {
    const DATABASE_URL = process.env.DATABASE_URL
    const sce = process.env.JWT_SECRET
    console.log(sce)
    db_config = {
        connectionString: DATABASE_URL,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 200,
        max: 20
    }
}


const pool = new Pool(db_config)

pool.on('connect', (client) => {
    //console.log(('connected'))
})

pool.on('remove', (client) => {
    //console.log(('connection removed'))
})

export default pool