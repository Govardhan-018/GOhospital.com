import express from "express"
import axios from "axios"

const user_authent_auth = "http://localhost:4000/authent"
const user_authent_creat = "http://localhost:4000/creat"
const home_patient="http://localhost:4040"
const home_doc="http://localhost:3069"
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
    if(clint=="patient"){
    try {
        const response = await axios.post(`${user_authent_auth}?gmail=${gmail}&clint=${clint}&pwd=${pwd}`)
        console.log(response.data)
        if (response.data.code == 1) {
            const id=response.data.id
            return res.redirect(`${home_patient}?id=${id}`);
        }
        else {
            res.redirect("/")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }

}
  if(clint=="doctor"){
    try {
        const response = await axios.post(`${user_authent_auth}?gmail=${gmail}&clint=${clint}&pwd=${pwd}`)
        console.log(response.data)
        if (response.data.code == 1) {
            const id=response.data.id
            return res.redirect(`${home_doc}?id=${id}`);
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
        const response = await axios.post(`${user_authent_creat}?gmail=${gmail}&clint=${clint}&pwd=${pwd}&name=${name}&phno=${phno}`)
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

})