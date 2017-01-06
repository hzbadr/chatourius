import {Socket, Presence} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let connectToChannel = (name) => {
  let channel = socket.channel(name, {})
  let message = $('#message-input')
  let nickName = "Nickname"
  let chatMessages = $("#chat-messages")

  let presences = {}
  let onlineUsers = $("#online-users")

  let listUsers = (user) => {
    return {
      user: user
    }
  }

  let renderUsers = (presences) => {
    console.log(presences);
    onlineUsers.html(
      Presence.list(presences, listUsers)
      .map(presence => `<li>${presence.user}</li>`)
      .join("")
    )
  }

  message.focus()
  message.on('keypress', event => {
    if(event.keyCode == 13){
      channel.push('message:new', {message: message.val(), user: nickName})
      message.val("")
    }
  })

  channel.on("message:new", payload => {
    console.log(payload)
    let template = $('<div>')
    template.html(`<b>${payload.user}</b>: ${payload.message}<br />`)
    chatMessages.append(template)
    chatMessages.scrollTop = chatMessages.scrollHight
  })

  channel.on("presence_state", state => {
    presences = Presence.syncState(presences, state)
    renderUsers(presences)
  })

  channel.on("presence_diff", diff => {
    presences = Presence.syncDiff(presences, diff)
    renderUsers(presences)
  })

  channel.on("driver:new", payload => {
    connectToChannel(`driver:${payload.user}`)
  })

  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) })

  return channel
}

export { socket, connectToChannel }
