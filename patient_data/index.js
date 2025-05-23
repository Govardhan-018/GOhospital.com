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

app.post("/getinfodoc", async (req, res) => {
    console.log("Got a request");

    const doctor_id = req.query.pid;
    console.log(doctor_id)
    const status = req.query.status;
    console.log(status)
    const query = `SELECT * FROM patients_data WHERE doctor_id = $1 AND status = $2`;

    try {
        const result = await db.query(query, [doctor_id, status]);
        console.log(result.rows);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Server error or invalid input" });
    }
});

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

app.post("/promote",async(req,res)=>{
const id=req.query.pid
console.log(id)
const query=`SELECT * FROM patients_data WHERE id=$1`
try{
const data = await db.query(query,[id])
const status=data.rows[0].status
if(status=="WAITING"){
    const query1=`UPDATE patients_data SET status = 'PENDING' WHERE id=$1`
    await db.query(query1,[id])
}else if(status=="PENDING"){
    const query1=`UPDATE patients_data SET status = 'CLOSE' WHERE id=$1`
    await db.query(query1,[id])
}
res.status(200).json("DONE")
console.log("done")
}catch(err){
console.log("FAILED")    
res.status(401).json("FAILED")
}
})
app.listen(3999, (req, res) => {
    console.log("On services...")
})