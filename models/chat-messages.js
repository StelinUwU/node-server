class Message {
  constructor(uid, message, user) {
    this.uid = uid;
    this.message = message;
    this.user = user;
  }
}

class ChatMessages {
  constructor() {
    this.messages = [];
    this.users = {};
  }
  get last10() {
    this.messages = this.messages.splice(0, 10);
    return this.messages;
  }
  get usersArr() {
    return Object.values(this.users); // Object.values() returns an array of the values of an object's properties.
  }
  sendMessage(uid, name, message) {
    this.messages.unshift(new Message(uid, message, name));
  }
  connectUser(user) {
    this.users[user.id] = user;
  }
  disconnectUser(id) {
    delete this.users[id];
  }
}
module.exports = ChatMessages;
