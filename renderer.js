const m = require('mithril')
const moment = require('moment')
const md = require('markdown-it')({
  typographer: true,
  linkify: true
});

var mila = require('markdown-it-link-attributes')

md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})

const Message = {
    view: (vnode) => {
        const message = vnode.attrs
        return m(".message", [
            m(".message-info", [
                m("span.message-date", moment(message.date).format('DD-MM-YY HH:mm')),
                m("span.message-user", "@"+ model.getname(message.user)),
            ]),
            m(".message-text", m.trust( md.render(message.text) )),
        ])
    }
}

const App = {
    view: () => {
        return m("main", [
            m(".topics", [
                m(".topic",{
                    onclick: controller.onsettopic("")
                },"latest"),
                model.listtopics().map((topic)=>{
                    return m(".topic", {
                        onclick: controller.onsettopic(topic)
                    },topic.text)
                })
            ]),
            //m(".key", "publishing on: "+model.my_key),
            m(".messages", {
                onupdate: (vnode)=>{
                    vnode.dom.scrollTo(0,vnode.dom.scrollHeight);
                }
            }, [
                m(".viewing-topic", "Pask / "+(model.topic.text ? model.topic.text: "Latest")),
                (model.topic==="") ? [
                    model.latestnodes().map((message)=>{
                        return m(Message,message)
                    })
                ] : [
                    model.topicthreads(model.topic).map((thread)=>{
                        return m(".thread", thread.map((message)=>{
                            return m(Message,message)
                        }))
                    })
                ]
            ]),
            //m("input", {
            //    value: model.input,
            //    oninput: (e)=>{
            //        model.input = e.target.value
            //    },
            //    onkeypress: (e)=>{
            //        if(e.key === "Enter" && model.input !== ""){
            //            controller.message(model.input)
            //            model.input = ""
            //            m.redraw()
            //        }
            //    }
            //}),
        ])
    }
}

var mapping = model.newnode("Mapping")
var t = model.newthread(mapping)
model.addtothread(t, model.newnode("Mapping is a *very* important topic"))
model.addtothread(t, model.newnode("Yes yes it is"))

t = model.newthread(mapping)
model.addtothread(t, model.newnode("new thread, what about critical mapping?"))
model.addtothread(t, model.newnode("kritikal"))
model.addtothread(t, model.newnode("__totally__"))

var ambience = model.newnode("Ambience")
t = model.newthread(ambience)
model.addtothread(t, model.newnode("lol"))

//connection.publish()
//connection.loadlisteners()
setTimeout(()=>{
    m.mount(document.body, App)
},1000)
