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
    res.render("index.ejs",{
        id:id
    })
})
app.post("/getapoint",async(req,res)=>{
      const id = req.query.id
    const response = await axios.post(`${doctor_data}/getinfo?pid=${id}`)
    res.render("index.ejs", {
        data: response.data,
        id: id
    })
})
app.listen(3069, (req, res) => {
console.log("On port 3069 doctor is ready")
})