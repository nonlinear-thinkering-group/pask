var publish_dat;

module.exports = {
    message: (message)=>{
        var write = true;
        if(message.charAt(0)==="/"){
            write = module.exports.command(message, model.my_key)
        }
        if(write){
            model.messages.here.push({
                text: message,
                date: new Date()
            })
            connection.write(JSON.stringify(model.messages.here))
            module.exports.mergeMessages()
        }

    },
    command: (message, key)=>{
        const cmd = message.split(" ")
        if(cmd[0]==="/name"){
            model.names[key] = cmd[1]
            return true
        }
        if(cmd[0]==="/listen"){
            model.listening.push(cmd[1])
            connection.listen(cmd[1])
            return false
        }
    },
    mergeMessages: ()=>{
        model.messages.merged = model.messages.here.map((m)=>{
            return {
                user: model.my_key,
                text: m.text,
                date: m.date
            }
        })

        for(var key in model.messages.remote){
            var other = model.messages.remote[key];
            console.log(other.map)
            model.messages.merged = model.messages.merged.concat(other.map((m)=>{
                module.exports.command(m.text, key)
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
