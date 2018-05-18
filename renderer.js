var md = require('markdown-it')({
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

const Hello = {
    view: () => {
        return m("main", [
            m(".key", "publishing on: "+model.my_key),
            m(".messages", {
                onupdate: (vnode)=>{
                    vnode.dom.scrollTo(0,vnode.dom.scrollHeight);
                }
            }, model.messages.merged.map((message)=>{
                return m(".message", [
                    m("span.message-date", moment(message.date).format('DD-MM-YY HH:mm')),
                    m("span.message-user", "@"+ model.names[message.user]),
                    m("div.message-text", m.trust( md.render(message.text) )),
                ])
            })),
            m("input", {
                value: model.input,
                oninput: (e)=>{
                    model.input = e.target.value
                },
                onkeypress: (e)=>{
                    if(e.key === "Enter" && model.input !== ""){
                        controller.message(model.input)
                        model.input = ""
                        m.redraw()
                    }
                }
            }),
        ])
    }
}
connection.publish()
controller.loadlisteners()
setTimeout(()=>{
    m.mount(document.body, Hello)
},1000)
