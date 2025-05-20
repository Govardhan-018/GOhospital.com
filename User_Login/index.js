import express from "express"
import pg from "pg"
import axios from "axios"

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "user_authent",
    password: "gova123",
    port: 5432
})
db.connect()

app.post("/creat", async (req, res) => {
    const { name, gmail, phno, pwd, clint } = req.query
    if (!name || !gmail || !phno || !pwd || !clint) {
        return res.status(400).json({ message: "Missing required fields" })
    }
    const allowedTables = ["patient", "doctor", "admin"]
    if (!allowedTables.includes(clint)) {
        return res.status(400).json({ message: "Invalid client" })
    }
    const query = `INSERT INTO ${clint} (name, gmail, phone_number, password) VALUES ($1, $2, $3, $4)`
    try {
        await db.query(query, [name, gmail, phno, pwd])
        return res.status(201).json({ message: "User Created Successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "User Createation Failed " })
    }
})
app.post("/authent", async (req, res) => {
    const { gmail, pwd, clint } = req.query;

    if (!gmail || !pwd || !clint) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    const allowedTables = ["patient", "doctor", "admin"]
    if (!allowedTables.includes(clint)) {
        return res.status(400).json({ message: "Invalid client" })
    }

    const checkQuery = `SELECT EXISTS (SELECT 1 FROM ${clint} WHERE gmail = $1)`
    const fetchQuery = `SELECT password FROM ${clint} WHERE gmail = $1`

    try {
        const checkResult = await db.query(checkQuery, [gmail])

        if (!checkResult.rows[0].exists) {
            return res.status(404).json({ message: "Email does not exist", code: 0 })
        }

        const fetchResult = await db.query(fetchQuery, [gmail])
        const dbPassword = fetchResult.rows[0].password

        if (pwd === dbPassword) {
            return res.status(200).json({ message: "Match", code: 1 })
        } else {
            return res.status(200).json({ message: "Mismatch", code: 0 })
        }

    } catch (err) {
        console.error("Error:", err)
        res.status(500).json({ message: "Something went wrong" })
    }
});


app.listen(4000, (req, res) => {
    console.log("Server is listening....")
})