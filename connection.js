var ram = require('random-access-memory')
var hyperdrive = require('hyperdrive')
var discovery = require('hyperdiscovery')
var hypercore = require('hypercore')

var reading_archive, writing_archive;


module.exports = {
    publish: ()=>{
        writing_archive = hyperdrive("./dat/writing")
        writing_archive.ready(function () {
            model.my_key = writing_archive.key.toString('hex')
            m.redraw()
            var sw = discovery(writing_archive,{upload: true})
            sw.on('connection', function (peer, type) {
                console.log('writer connected to', sw.connections.length, 'peers')
            })
        })
    },
    listen: (key)=>{
        reading_archive = hyperdrive("./dat/"+key, key)
        reading_archive.ready(function () {
            var sw = discovery(reading_archive,{download: true})
            sw.on('connection', function (peer, type) {
                console.log('reader connected to', sw.connections.length, 'peers')
            })
            reading_archive.content.on("sync", function(){
                module.exports.read(key)
            })
        })
    },
    read: (key)=> {
        //TODO: fix this!!!
        setTimeout(function(){
            reading_archive.readFile('/messages.json', 'utf-8', function (err, data) {
                if (err) throw err
                console.log(data)
                model.messages.remote[key] = JSON.parse(data)
                controller.mergeMessages()
            })
        },1000)

    },
    write: (message)=>{
        writing_archive.writeFile('/messages.json', message, function (err) {
            if (err) throw err
            console.log("write")
        })
    }
}
