const form = document.querySelector("form");
const signout = document.querySelector("#google_signout");
const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://rest-server-stelin.herokuapp.com/api/auth/";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {};
  for (const element of form.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value;
    }
  }
  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "chat.html";
    });
});
signout.onclick = () => {
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};

function handleCredentialResponse(response) {
  /*  console.log("ID_TOKEN", response.credential); */
  const body = { id_token: response.credential };
  fetch(url + "google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .then((resp) => {
      localStorage.setItem("email", resp.user.email);
      localStorage.setItem("token", resp.token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}
