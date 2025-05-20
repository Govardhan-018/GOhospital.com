import express from "express"
import axios from "axios"

const patient_data = "http://localhost:3999"
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
    const id = req.query.id
    const response = await axios.post(`${patient_data}/getinfo?pid=${id}`)
    res.render("index.ejs", {
        data: response.data,
        id: id
    })
})
app.post("/new_apoint", async (req, res) => {
    const response = await axios.get(`${patient_data}/doctors`)
    const id = req.body.id
    res.render("index2.ejs", {
        pid: id,
        doctor: response.data
    })
})
app.post("/creat_apoint", async (req, res) => {
    const doctor_id = req.body.doctor
    const patient_id = req.body.id
    const discription = req.body.discription
    const url = `${patient_data}/creat?pid=${patient_id}&doctor=${doctor_id}&discription=${discription}`
    try {
        await axios.post(url);
        return res.redirect(`/?id=${patient_id}`);
    } catch (err) {
        console.error(err.response?.data);
        return res.status(401).json({ message: "Something went wrong" });
    }
})
app.listen(4040, (req, res) => {

})