const crypt = require("cryptiles")

var model = {
    my_key: "nokey",

    //view models
    input: "",
    topic: "",

    //models for dat
    archive: {
        writing: "",
        reading: []
    },
    localdata: {
        name: "noname",
        threads: {},
        nodes: {},
    },
    remotedata: [],

    //mapping of users
    names: {
        "nokey": "noname"
    },

    //functions
    updatedata: ()=>{

    },
    newnode: (value)=>{
        var n = {
            id: crypt.randomString(64),
            text: value,
            date: new Date(),
            user: model.my_key
        }
        model.localdata.nodes[n.id] = n
        return n
    },
    newthread: (n)=>{
        var id = n
        if (n.id) {id=n.id}
        var t = {
            topics: [id],
            id: crypt.randomString(64),
            nodes: [],
        }
        model.localdata.threads[t.id] = t
        return t
    },
    addtothread: (t, n)=>{
        model.localdata.threads[t.id].nodes.push(n.id)
    },
    listtopics: ()=>{
        var threadtopics = _.values(model.localdata.threads).map((t)=>{
            return t.topics
        })
        var topics = _.union.apply(this, threadtopics).map((id)=>{
            return model.getnode(id)
        })
        return topics
    },
    latestnodes: ()=>{
        var nodes = _.values(model.localdata.nodes).sort((a,b)=>{
            return a.date-b.date;
        })
        return nodes
    },
    topicthreads: (topic)=>{
        return _.values(model.localdata.threads).filter((t)=>{
            return (t.topics.indexOf(topic.id)>-1)
        }).map((t)=>{
            return t.nodes.map((n)=>{
                return model.getnode(n)
            })
        })
    },
    getnode: (id)=>{
        return model.localdata.nodes[id]
    },
    getthread: (id)=>{
        return model.localdata.threads[id]
    },
    getname: (id)=>{
        return model.names[id]
    },
}

module.exports = model
