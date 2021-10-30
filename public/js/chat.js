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
  const resp = fetch(url, {
    headers: { "x-token": token },
  });
  const { user: userDB, token: tokenDB } = await resp.json();
  console.log(userDB, tokenDB);
};

const main = async () => {
  //Validar JWT
  await validateJWT();
};

/* const socket = io(); */

main();
