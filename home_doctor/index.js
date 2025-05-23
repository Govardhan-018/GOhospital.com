import express from "express"
import axios from "axios"

const doctor_data = "http://localhost:3999"
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
    const id=req.query.id
    res.render("index1.ejs",{
        id:id
    })
})
app.post("/getapoint",async(req,res)=>{
      const id = req.body.id
      console.log(id)
    const response = await axios.post(`${doctor_data}/getinfodoc?pid=${id}&status=WAITING`)
    console.log(response.data)
    res.render("index2.ejs", {
        data: response.data,
        id: id,
        call:"get"
    })
})
app.post("/closeapoint",async(req,res)=>{
      const id = req.body.id
    const response = await axios.post(`${doctor_data}/getinfodoc?pid=${id}&status=PENDING`)
    res.render("index2.ejs", {
        data: response.data,
        id: id,
        call:"close"
    })
})
app.post("/promote",async(req,res)=>{
 console.log(req.body.id)
 const id=req.body.id
 const pid=req.body.pid
 const call=req.body.call
 try{
 const response = await axios.post(`${doctor_data}/promote?pid=${id}`)
 res.redirect("/?id=" + pid)
 }catch(err){
    res.status(401).json("error");
 }
})
app.listen(3069, (req, res) => {
console.log("On port 3069 doctor is ready")
})