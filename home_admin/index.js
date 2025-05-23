import express from "express"
import pg from "pg"

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

app.get("/", (req, res) => {
    const id = req.query.id
    res.render("index1.ejs", {
        id: id
    })
})

app.post("/patientinfo", async (req, res) => {
    const id = req.body.id
    const query = `SELECT * FROM patients_data WHERE status != 'CLOSE'`
    const response = await db.query(query)
    res.render("index2.ejs", {
        id: id,
        data: response.rows
    })
})
app.post("/promote", async (req, res) => {
    console.log(req.body.id)
    const id = req.body.id
    const pid = req.body.pid
    const query = `SELECT * FROM patients_data WHERE id=$1`
    try {
        const data = await db.query(query, [id])
        const status = data.rows[0].status
        if (status == "WAITING") {
            const query1 = `UPDATE patients_data SET status = 'PENDING' WHERE id=$1`
            await db.query(query1, [id])
        } else if (status == "PENDING") {
            const query1 = `UPDATE patients_data SET status = 'CLOSE' WHERE id=$1`
            await db.query(query1, [id])
        }
        res.redirect("/?id=" + pid)
    } catch (err) {
        res.status(401).json("error");
    }
})
app.listen(36969, (req, res) => {
    console.log("On port 36969")
})
