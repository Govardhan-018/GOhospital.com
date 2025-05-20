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

app.post("/getinfo",async(req,res)=>{
const patient_id=req.query.pid
const query1=`SELECT * FROM patients_data WHERE patient_id=${patient_id}`
try{
const data=await db.query(query1)
res.status(200).json(data.rows)
}catch(err){
res.status(401).json({ message: "Invalid patient id"})
}
})

app.listen(3999,(req,res)=>{
    console.log("On services...")
})