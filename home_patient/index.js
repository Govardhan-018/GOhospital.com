import express from "express"
import axios from "axios"

const patient_data="http://localhost:3999/getinfo"
const app=express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/",async(req,res)=>{
    const id=req.query.id
    const response = await axios.post(`${patient_data}?pid=${id}`)
    res.send(response.data)
})
app.listen(4040,(req,res)=>{

})