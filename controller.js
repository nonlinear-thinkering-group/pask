const m = require('mithril')
const crypt = require("cryptiles")

var controller = {
    onsettopic: (topic)=> {
        return (e)=>{
            model.topic = topic
        }
    },
    message: (message)=>{
        var write = true;
        if(message.charAt(0)==="/"){
            write = controller.command(message, model.my_key)
        }
        if(write){
            model.messages.here.push({
                text: message,
                date: new Date()
            })
            connection.write(JSON.stringify(model.messages.here))
            controller.mergeMessages()
        }

    },
    command: (message, key)=>{
        const cmd = message.split(" ")
        if(cmd[0]==="/name"){
            model.names[key] = cmd[1]
            return true
        }
        if(cmd[0]==="/listen"){
            connection.savelistener(cmd[1])
            connection.listen(cmd[1])
            return false
        }
    },
    mergeMessages: ()=>{
        model.messages.merged = model.messages.here.map((m)=>{
            controller.command(m.text, model.my_key)
            return {
                user: model.my_key,
                text: m.text,
                date: new Date(m.date)
            }
        })

        for(var key in model.messages.remote){
            var other = model.messages.remote[key];
            model.messages.merged = model.messages.merged.concat(other.map((m)=>{
                controller.command(m.text, key)
                return {
                    user: key,
                    text: m.text,
                    date: new Date(m.date)
                }
            }))
        }
        model.messages.merged = model.messages.merged.sort((a,b)=>{
            return a.date-b.date;
        })

        m.redraw()
    }
}

module.exports = controller
