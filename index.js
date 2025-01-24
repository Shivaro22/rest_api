const express = require('express');
const fs = require('fs');

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
app.get("/api/users", async (req,res)=>{
    const allDbUsers = await User.find({});

   
    return res.json(allDbUsers);
});

app.get('/users',async (req,res)=>{
    const allDbUsers = await User.find({});
    const html = `
    <ul>
        ${allDbUsers.map(user => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});



app.route("/api/users/:id")
    .get(async (req,res)=>{
     const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ error : 'user not found'});;
    return res.json(user);
}).patch(async (req,res)=> {
    await User.findByIdAndUpdate(req.params.id,{lastName:"KiKi"});
})
.delete(async (req,res)=>{
    await User.findByIdAndDelete(req.params.id);
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