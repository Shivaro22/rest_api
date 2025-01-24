const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const mongoose = require('mongoose');
const app = express();

const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/DLT-rest-api')
.then(()=> console.log('MongoDB Connected'))
.catch(err => console.log('Mongo Error',err));

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
    },
    lastName: {
        type:String,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    jobTitle: {
        type:String,
    },
    gender:{
        type:String,
    }
},{timestamps:true});

const User =mongoose.model('user',userSchema);


app.use(express.urlencoded(extended = false)); //Middleware to parse the body of the request
//Routes
app.use((req,res,next)=>{
    const currentDate = new Date().toISOString();
    const logMessage = `"Today's Date is", ${currentDate}\n`;
    fs.appendFile('./text.txt',logMessage,(err)=>{
        return console.log("Data appended succesfully");
    })
    next();
});
app.get('/api/users',(req,res)=>{
    return res.json(users);
});

app.get('/users',(req,res)=>{
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.route("/api/users/:id")
    .get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if(!user) return res.status(404).json({ error : 'user not found'});;
    return res.json(user);
}).patch((req,res)=> {

}).delete((req,res)=>{

})


app.post("/api/users", async (req,res)=>{
    const body = req.body;
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({msg: "All fields are required."});
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle:body.job_title,
    });
    console.log(result);
    return res.status(201).json({msg:"success"});
});
        
app.listen(port,()=>{
    console.log("Server is accessible at port 8000");
    });