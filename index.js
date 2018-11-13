let path = require('path');

const indexPath = path.join(__dirname,'/public');

const express = require('express');

const http = require('http');

const socketIo = require('socket.io');

  

let {db} = require('./db.js');



let app = new express();
app.use(express.static(indexPath));

let server = http.createServer(app);

let io = socketIo(server);

let locationsMap = new Map();

let {USER} = require('./user');

io.on('connection',(socket)=>{

    socket.on('registerDriver',()=>{

        let user = new USER() ;
        user.user_id = socket.id ;
        user.location.lat = null ;
        user.location.lng = null ;
        user.save((err,res)=>{
            console.log("res",err,res);
        })
        locationsMap.set(socket.id,{lat : null , lng : null});
    })

    socket.on('requestLocation',()=>{
        USER.find({}).lean().exec((error,responses)=>{
            if(error){

            }else{
                console.log("users connected-->",responses)
            }
            socket.emit('locationsUpdate',responses);
        })
       
    })

    socket.on('updateLocation',(data)=>{
        let dataToBeupdated = {} ;
        dataToBeupdated.user_id = socket.id ;
        dataToBeupdated.location = {};
        dataToBeupdated.location.lat = data.lat ; 
        dataToBeupdated.location.lng = data.lng ;
        USER.update({user_id: socket.id},dataToBeupdated,(err,res)=>{
            console.log('result-->',err,res);
        })
        // if(locationsMap.has(socket.id)){
        //     locationsMap.set(socket.id,data);
        //     console.log('data-->',data);
        // }
    })

    socket.on('disconnect',()=>{
        USER.remove({user_id:socket.id},(err,response)=>{
            console.log("err=>",err);
            console.log("response",response);
        })
    })
})

server.listen(3000,()=>{
    console.log("Server is runnign ar port : 3000");
})