const hyperdb = require('hyperdb')
const discovery = require('hyperdiscovery')
const events = require('events');
const crypt = require("cryptiles")

var ev = new events.EventEmitter();

var db, swarm
var key, lkey

function create(name) {
    db = hyperdb('./dat/'+name, {valueEncoding: 'utf-8'})
    db.put('/space', name, function (err) {
        if (err) throw err
    })
    connect(db)
}

function listen(key) {
    db = hyperdb('./dat/'+key, key, {valueEncoding: 'utf-8'})
    connect(db)
}

function connect(db){
    db.on('ready', ()=>{
        key = db.key.toString('hex')
        lkey = db.local.key.toString('hex')
        swarm = discovery(db)
        swarm.on('connection', (peer, type)=>{
            console.log("new connection: "+peer.key.toString('hex'))
            peer.on('close', ()=>{

            })
        })


        ev.emit('load-space', lkey)
        getNames()
        getMessages()

        //watch changes
        db.watch('/names', function () {
            getNames()
        })

        db.watch('/messages', function () {
            getMessages()
        })
    })
}

function getNames(){
    db.list('/names/', (err, l)=>{
        var names = l.map((node)=>{
            return [
                node[0].key.split("/")[1], node[0].value
            ]
        })
        ev.emit('names', names)
    })
}

function setName(name){
    db.put('/names/'+lkey, name, (err)=>{
        if (err) throw err
        getNames()
    })
}

function setAuth(key){
    console.log(key)
    db.authorize(Buffer.from(key, 'hex'), (err)=>{
        if (err) throw err
    })
}

function getMessages(){
    db.list('/messages/', (err, l)=>{
        var messages = l.map((node)=>{
            return JSON.parse(node[0].value)
        })
        ev.emit('messages', messages)
    })
}

function message(message){
    var k = crypt.randomString(64)
    db.put('/messages/'+k, JSON.stringify(message), (err)=>{
        if (err) throw err
        getMessages()
    })
}



function on(tag, callback){
    ev.on(tag, callback)
}


module.exports = {
    create: create,
    listen: listen,
    getNames: getNames,
    setName: setName,
    setAuth: setAuth,
    getMessages: getMessages,
    message: message,
    on: on
}
