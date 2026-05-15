const pool = require("../database/db")

const createUser = async (name, email, password) => {  // ✅ add async
    const result = await pool.query(
        "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
    )
    return result.rows[0]
}

module.exports ={ createUser }