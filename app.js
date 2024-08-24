const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const server = http.createServer(app)
const socket = require('socket.io');
const io = socket(server)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join((__dirname), 'views'))
app.set('view engine', 'ejs');


var users = []
var userIds = []
var joinedAt = []


io.on("connection", (socket) => {
    // console.log("connected")
    let usersCount = 1;
    socket.on("user", (message) => {
        let UID = socket.id
        let id = userIds.indexOf(UID)
        let username = users[id]
        let messageData = {
            username: username,
            message: message,
            timestamp: Date.now(),
            id: socket.id
        }
        io.emit('message', messageData)
    })
    socket.on('newuser', (username) => {
        users.push(username)
        userIds.push(socket.id)
        joinedAt.push(Date.now())
        io.emit('users', username)

        io.emit('showusers', {username: users, joinedAt})
    })
    if(users.length > 0){
        usersCount = users.length + 1
    }
    io.emit('userscount', usersCount)
    socket.on('disconnect', () => {
        let index = userIds.indexOf(socket.id)
        let username = users[index]
        if(index !== -1){
            userIds.splice(index,1)
            users.splice(index,1)
            joinedAt.splice(index,1)
            io.emit('userscount', users.length)
            io.emit('showusers', {username:users, joinedAt})
        }
    })
   
       

})

app.get('/', (req, res) => {
    res.render('index')
})

module.exports = app