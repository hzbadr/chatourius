var _phoenix = require("phoenix");

var socket = new _phoenix.Socket("/socket", { params: { token: window.userToken } });

socket.connect();

// Now that you are connected, you can join channels with a topic:
var channel = socket.channel("roomm", {});
var message = $('#message-input');
var nickName = "Nickname";
var chatMessages = $("#chat-messages");

var presences = {};
var onlineUsers = $("#online-users");
var listUsers = function listUsers(user) {
  return {
    user: user
  };
};

var renderUsers = function renderUsers(presences) {
  console.log(presences);
  onlineUsers.html(_phoenix.Presence.list(presences, listUsers).map(function (presence) {
    return "<li>" + presence.user + "</li>";
  }).join(""));
};

message.focus();
message.on('keypress', function (event) {
  if (event.keyCode == 13) {
    channel.push('message:new', { message: message.val(), user: nickName });
    message.val("");
  }
});

channel.on("message:new", function (payload) {
  console.log(payload);
  var template = $('<div>');
  template.html("<b>" + payload.user + "</b>: " + payload.message + "<br />");
  chatMessages.append(template);
  chatMessages.scrollTop = chatMessages.scrollHight;
});

channel.on("presence_state", function (state) {
  presences = _phoenix.Presence.syncState(presences, state);
  renderUsers(presences);
});

channel.on("presence_diff", function (diff) {
  presences = _phoenix.Presence.syncDiff(presences, diff);
  renderUsers(presences);
});

channel.join().receive("ok", function (resp) {
  console.log("Joined successfully", resp);
}).receive("error", function (resp) {
  console.log("Unable to join", resp);
});
