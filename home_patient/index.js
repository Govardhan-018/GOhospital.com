import express from "express"
import axios from "axios"
import os from "os"


function getLocalIP() {
    const interfaces = os.networkInterfaces()
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address
            }
        }
    }
    return '127.0.0.1'
}

const ip = getLocalIP()


const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
    const id = req.query.id
    const response = await axios.post(`http://${ip}:3999/getinfo?pid=${id}`)
    res.render("index.ejs", {
        data: response.data,
        id: id
    })
})
app.post("/new_apoint", async (req, res) => {
    const response = await axios.get(`http://${ip}:3999/doctors`)
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
    const url = `http://${ip}:3999/creat?pid=${patient_id}&doctor=${doctor_id}&discription=${discription}`
    try {
        await axios.post(url);
        return res.redirect(`/?id=${patient_id}`);
    } catch (err) {
        console.error(err.response?.data);
        return res.status(401).json({ message: "Something went wrong" });
    }
})
app.listen(3030, (req, res) => {
    console.log("Starting 3030")
})