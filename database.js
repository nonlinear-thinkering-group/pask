const hyperdb = require('hyperdb')
const discovery = require('hyperdiscovery')
const events = require('events');
var ev = new events.EventEmitter();

var db, swarm
var key

function connect(key){
    if(key !== undefined){
        db = hyperdb('./dat/'+key, {key: key, valueEncoding: 'utf-8'})
    } else {
        db = hyperdb('./dat/hyperdb', {valueEncoding: 'utf-8'})
    }
    db.on('ready', ()=>{
        key = db.key.toString('hex')
        swarm = discovery(db)
        ev.emit('ready', key);
        swarm.on('connection', (peer, type)=>{
            peer.on('close', ()=>{

            })
        })
    })
}

function getKey(){
    return key
}

function on(tag, callback){
    ev.on(tag, callback)
}


module.exports = {
    connect: connect,
    getKey: getKey,
    on: on
}
