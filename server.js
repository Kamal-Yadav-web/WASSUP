const express = require('express');
const bodyParser=require("body-parser");
const app = express()
const {
    createPool
}=require('mysql');
const pool =createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"test",
    connectionLimit:10
})

app.use(bodyParser.urlencoded({extended:true}));

const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, ()=>{
    console.log("server start at port 3000")
})
app.use(express.static(__dirname+"/public"))


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/indexlogin.html')
})

app.post("/",function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var phone=req.body.phone;
    var password=req.body.password;
    // console.log(name);
    // console.log(email);
    // console.log(phone);
    // console.log(password);
    var login=req.body.login;
    // console.log(req.body.login);
    // console.log(req.body);
    if(login==='login'){
        res.sendFile(__dirname+"/login.html")

    }else if(login==='sign'){
        var sql ="INSERT INTO registration  VALUES ('"+name+"', "+phone+", '"+password+"','"+email+"')";
        // var sql="SELECT Phone,Password FROM registration";
        pool.query(sql,(err,result,field)=>{
        if(err){
            res.sendFile(__dirname+"/failer.html");
        }
        return(console.log("you are registered"));
    })
        res.sendFile(__dirname+"/index.html")
    }
    
})
app.get("/failer",function(req,res){
    res.sendFile(__dirname+"/failer.html");
})
app.post("/failer",function(req,res){
    res.redirect("/")
})

app.post("/login",function(req,res){
    var name=req.body.name;
    var phone=req.body.phone;
    var password=req.body.password;
    // console.log(name);
    // console.log(phone);
    // console.log(password);
    // var sql ="INSERT INTO registration  VALUES ('"+name+"', "+phone+", '"+password+"')";
    var sql ="SELECT * FROM `registration` WHERE `Name` LIKE '"+name+"' AND `Phone` = "+phone+" AND `Password` LIKE '"+password+"'";
    // var sql="SELECT Phone,Password FROM registration";
    pool.query(sql,(err,result,field)=>{
        var l=result.length;
        // console.log(l);

        if(l!=0){

            res.sendFile(__dirname+"/index.html");
        }
        else{
            res.sendFile(__dirname+"/failer.html");
        }
    })
//     if(err){
//         res.sendFile(__dirname+"/failer.html");
//     }
//     return(console.log(result));
//    })
//     res.sendFile(__dirname+"/index.html")

})
//socket

const io=require('socket.io')(http)
const users={}

io.on('connection',(socket)=>{
    console.log('connected')
    socket.on('new-user-joined',(name)=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name)
    })

    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg)
    })

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];

    });
})