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
    res.render("index1.ejs")
})

app.post("/info", async (req, res) => {
    const gmail = req.body.gmail
    const pwd = req.body.pwd
    const clint = req.body.clint
    console.log(gmail)
    console.log(pwd)
    console.log(clint)
    if (clint == "patient") {
        try {
            const response = await axios.post(`http://${ip}:4000/authent?gmail=${gmail}&clint=${clint}&pwd=${pwd}`)
            console.log(response.data)
            if (response.data.code == 1) {
                const id = response.data.id
                return res.redirect(`http://${ip}:3030?id=${id}`);
            }
            else {
                res.redirect("/")
            }
        } catch (err) {
            console.log(err)
            res.status(500).send("Something went wrong")
        }

    }
    else if (clint == "doctor") {
        try {
            const response = await axios.post(`http://${ip}:4000/authent?gmail=${gmail}&clint=${clint}&pwd=${pwd}`)
            console.log(response.data)
            if (response.data.code == 1) {
                const id = response.data.id
                return res.redirect(`http://${ip}:3069?id=${id}`);
            }
            else {
                res.redirect("/")
            }
        } catch (err) {
            console.log(err)
            res.status(500).send("Something went wrong")
        }

    }
    else if (clint == "admin") {
        try {
            const response = await axios.post(`http://${ip}:4000/authent?gmail=${gmail}&clint=${clint}&pwd=${pwd}`)
            if (response.data.code == 1) {
                const id = response.data.id
                console.log(id)
                return res.redirect(`http://${ip}:36969?id=${id}`);
            }
            else {
                res.redirect("/")
            }
        } catch (err) {
            console.log(err)
            res.status(500).send("Something went wrong")
        }

    }
})

app.post("/creat_new", (req, res) => {
    res.render("index2.ejs")
})
app.post("/new_info", async (req, res) => {
    const gmail = req.body.gmail
    const pwd = req.body.pwd
    const clint = req.body.clint
    const name = req.body.name
    const phno = req.body.phno
    try {
        const response = await axios.post(`http://${ip}:4000/creat?gmail=${gmail}&clint=${clint}&pwd=${pwd}&name=${name}&phno=${phno}`)
        console.log(response.data);
        if (response.data.code == 1) {
            res.redirect("/")
        } else {
            res.send(response.data.message)
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

})
app.listen(3535, (req, res) => {
    console.log("On port 3535")
})