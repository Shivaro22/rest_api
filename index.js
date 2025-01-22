const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();

const port = 8000;

app.use(express.urlencoded(extended = false)); //Middleware to parse the body of the request
//Routes

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
    return res.json(user);
}).patch((req,res)=> {

}).delete((req,res)=>{

})


app.post("/api/users",(req,res)=>{
    const body = req.body;
    users.push({...body, id: users.length + 1});
        fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{ 
            return res.json(users);  
        });
    });

        
app.listen(port,()=>{
    console.log("Server is accessible at port 8000");
    });