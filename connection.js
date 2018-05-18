const Dat = require('dat-node')
const hyperdrive = require('hyperdrive')
const hypercore = require('hypercore')
const discovery = require('hyperdiscovery')
const fs = require('fs')

var connection = {
    publish: ()=>{
        model.archive.writing = hyperdrive("./dat/writing")
        model.archive.writing.ready(function () {
            model.my_key = model.archive.writing.key.toString('hex')

            var sw = discovery(model.archive.writing)
            sw.on('connection', function (peer, type) {
                console.log('writer connected to', sw.connections.length, 'peers')
            })

            model.archive.writing.readFile('/messages.json', 'utf-8', function (err, data) {
                if (err) throw err
                model.messages.here = JSON.parse(data)
                controller.mergeMessages()
            })
        })
    },
    listen: (key)=>{
        var reading_archive = hyperdrive("./dat/"+key, key)
        reading_archive.ready(function () {
            var sw = discovery(reading_archive)
            sw.on('connection', function (peer, type) {
                console.log('reader connected to', sw.connections.length, 'peers')
            })
            sw.on('close', function () {
                console.log('peer disconnected')
            })
            reading_archive.content.on("sync", function(){
                connection.read(reading_archive, key)
            })
            connection.read(reading_archive, key)
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
        model.archive.writing.writeFile('/messages.json', message, function (err) {
            if (err) throw err
            console.log("write")
        })
    },
    loadlisteners: ()=>{
        fs.readFile("./dat/listening.json", "utf8", (err, data)=>{
            if(err) throw err
            model.archive.reading = JSON.parse(data)
            model.archive.reading.map((o)=>{
                connection.listen(o)
            })
        })
    },
    savelistener: (id)=>{
        model.archive.reading.push(id)
        fs.writeFile("./dat/listening.json", JSON.stringify(model.archive.reading), (err)=>{
            if(err) throw err
        })
    }
}

module.exports = connection
