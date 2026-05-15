const { Pool } = require("pg")
const dotenv= require("dotenv")
dotenv.config() 

const pool = new Pool({
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME,
    host     : process.env.DB_HOST,
    
})

module.exports = pool