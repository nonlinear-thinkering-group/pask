var ram = require('random-access-memory')
var hyperdrive = require('hyperdrive')
var discovery = require('hyperdiscovery')
var hypercore = require('hypercore')

var writing_archive;


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

            writing_archive.readFile('/messages.json', 'utf-8', function (err, data) {
                if (err) throw err
                model.messages.here = JSON.parse(data)
                controller.mergeMessages()
            })
        })
    },
    listen: (key)=>{
        var reading_archive = hyperdrive("./dat/"+key, key)
        reading_archive.ready(function () {
            var sw = discovery(reading_archive,{download: true})
            sw.on('connection', function (peer, type) {
                console.log('reader connected to', sw.connections.length, 'peers')
            })
            reading_archive.content.on("sync", function(){
                module.exports.read(reading_archive, key)
            })
            module.exports.read(reading_archive, key)
        })
    },
    read: (archive, key)=> {
        //TODO: fix this!!!
        setTimeout(function(){
            archive.readFile('/messages.json', 'utf-8', function (err, data) {
                if (err) throw err
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
