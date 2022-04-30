const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bcrypt = require('bcrypt')
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res) => {
    res.render('index.ejs')
})

app.get("/login",(req,res) => {
    res.render('login.ejs')
})

app.get("/register",(req,res) => {
    res.render('register.ejs')
})

app.post('/register', async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        var users = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
        mongo.connect(url,(err,db)=>{
            if(err) throw err;
            console.log("Database Connected!")
            var dbo = db.db("Users")
            dbo.collection("user").insertOne(users,(err,res)=>{
                if(err) throw err;
                console.log("1 User Registered")
            })
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.listen(port,()=>{
    console.log("Listening on port ",port)
})






