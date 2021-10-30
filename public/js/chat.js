//Referencias HTML
const txtUid = document.getElementById("txtUid");
const txtMessage = document.getElementById("txtMessage");
const ulUsers = document.getElementById("ulUsers");
const ulMessages = document.getElementById("ulMessages");
const btnLogout = document.getElementById("btnLogout");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://rest-server-stelin.herokuapp.com/api/auth/";

let user = null;
let socket = null;

//Validar el token de usuario LocalStorage
const validateJWT = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }
  const resp = await fetch(url, {
    headers: { "x-token": token },
  });
  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  user = userDB;

  document.title = user.name;
  await connectSocket();
};

const connectSocket = async () => {
  socket = io({
    extraHeaders: { "x-token": localStorage.getItem("token") },
  });
  socket.on("connect", () => {
    console.log("Socket online");
  });
  socket.on("disconnect", () => {
    console.log("Socket offline");
  });
  socket.on("receive-messages", renderMessages);
  socket.on("active-users", renderUsers);
  socket.on("private-message", console.log);
};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
  if (keyCode !== 13) {
    return;
  }
  const message = txtMessage.value;
  const uid = txtUid.value;
  if (message.trim().length === 0) {
    return;
  }
  socket.emit("send-message", { message, uid });
  txtMessage.value = "";
});

const main = async () => {
  //Validar JWT
  await validateJWT();
};

const renderUsers = (users) => {
  ulUsers.innerHTML = "";
  let messagesHTML = "";
  users.forEach(({ name, uid }) => {
    messagesHTML += `
      <li class="list-group-item">
      <p>
      <h5 class="text-success">${name}</h5>
      <span class="fs-6 text-muted">${uid}</span>
      </p>
      </li>
    `;
  });
  ulUsers.innerHTML = messagesHTML;
};
const renderMessages = (messages = []) => {
  let messagesHTML = "";
  messages.forEach(({ user, message }) => {
    messagesHTML += `
      <li class="list-group-item">
        <p>
          <span class="text-primary">${user}</span>
          <span>${message}</span>
        </p>
      </li>
    `;
  });
  ulMessages.innerHTML = messagesHTML;
};

/* const socket = io(); */

main();
