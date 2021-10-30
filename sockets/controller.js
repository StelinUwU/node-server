const { Socket } = require("socket.io");
const { validateJWT } = require("../helpers");
const { ChatMessages } = require("../models");
const chatMessage = new ChatMessages();
const socketController = async (socket = new Socket(), io) => {
  const user = await validateJWT(socket.handshake.headers["x-token"]);
  if (!user) {
    return socket.disconnect();
  }
  //Agregar el usuario a la lista de usuarios conectados
  chatMessage.connectUser(user);
  io.emit("active-users", chatMessage.usersArr);
  socket.emit("receive-messages", chatMessage.last10);

  //Conectarlo a una sala especial
  socket.join(user.id);

  socket.on("disconnect", () => {
    chatMessage.disconnectUser(user.id);
    io.emit("active-users", chatMessage.usersArr);
  });
  socket.on("send-message", ({ uid, message }) => {
    if (uid) {
      socket.to(uid).emit("private-message", { de: user.name, message });
    } else {
      chatMessage.sendMessage(user.id, user.name, message);
      io.emit("receive-messages", chatMessage.last10);
    }
  });
};

module.exports = { socketController };
