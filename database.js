const hyperdb = require('hyperdb')
const discovery = require('hyperdiscovery')

var db, swarm
var key

function connect(key){
    if(key){
        db = hyperdb('./dat/'+key, {key: key, valueEncoding: 'utf-8'})
    } else {
        db = hyperdb('./dat/hyperdb', {valueEncoding: 'utf-8'})
    }
    db.on('ready', ()=>{
        key = db.key.toString('hex')
        swarm = discovery(db)

        swarm.on('connection', (peer, type)=>{
            peer.on('close', function () {

            })
        })
    })
}

function getKey(){
    return key
}

function on(tag, callback){
    var events = {
        "ready": (c)=>{swarm.on('ready',c)}
    };

    events[tag](callback)
}


module.exports = {
    connect: connect,
    getKey: getKey,
    on: on
}
