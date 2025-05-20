import express from "express"
import pg from "pg"

const app = express()

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "user_authent",
    password: "gova123",
    port: 5432
})
db.connect()

app.post("/getinfo", async (req, res) => {
    const patient_id = req.query.pid
    const query1 = `SELECT * FROM patients_data WHERE patient_id=${patient_id}`
    try {
        const data = await db.query(query1)
        res.status(200).json(data.rows)
    } catch (err) {
        res.status(401).json({ message: "Invalid patient id" })
    }
})
app.post("/creat", async (req, res) => {
    const doctor_id = req.query.doctor
    const patient_id = req.query.pid
    const discription = req.query.discription
    const status = "WAITING"
    const query1 = `INSERT INTO patients_data (patient_id, doctor_id, discription, status) VALUES ($1, $2, $3, $4)`;
    try{
    await db.query(query1, [patient_id, doctor_id, discription, status]);
     console.log("fixed")
    res.status(200).json({ message: "Appointment fixed" })
    }catch(err){
        console.log("Notfixed")
         res.status(401).json({ message: "Appointment notfixed" })
    }
})
app.get("/doctors", async (req, res) => {
    const query1 = `SELECT name,id FROM doctor WHERE proxy='present'`
    try {
        const data = await db.query(query1)
        res.status(200).json(data.rows)
    } catch (err) {
        res.status(401).json({ message: "Something went wrong" })
    }
})
app.listen(3999, (req, res) => {
    console.log("On services...")
})