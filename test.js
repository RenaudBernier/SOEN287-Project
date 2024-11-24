var isOpen = false;

async function checkforLoggedUser(){
  const res = await fetch("/api/login-check");
  const userInfo = await res.json();
  console.log(userInfo);
  return userInfo;
}
let userInfo = checkforLoggedUser();

async function checkforLoggedAdmin(){
  const res = await fetch("/api/admin-login-check");
  const adminInfo = await res.json();
  console.log(adminInfo);
  return adminInfo;
}

if(checkforLoggedAdmin() === "admin")
  userInfo = "admin";
console.log(userInfo);

function signIn() {
  if (isOpen === true) {
    closeOverlay();
  }
  else{
  const dropdownElems = document.getElementsByClassName("dropdown-elems");
  for (var i = 0; i < dropdownElems.length; i++) {
    if (dropdownElems[i].style.display === "block") {
      dropdownElems[i].style.display = "none"; // Close if open
    } else {
      dropdownElems[i].style.display = "block"; // Open if closed
    }
  }
  isOpen = true;}
}

function openOverlay(signinType) {
  console.log(signinType);
  let overlayElems;
  const dropdownElems = document.getElementsByClassName("dropdown-elems");
  const signinTypeText = document.getElementById("signin-type");
  signinTypeText.innerHTML = signinType;
  for (var i = 0; i < dropdownElems.length; i++) {
    dropdownElems[i].style.display = "none";
  }
  if (signinType === 'register'){
    overlayElems = document.getElementsByClassName("overlayElemsRegister");}
  else{
    overlayElems = document.getElementsByClassName("overlayElems");}
  for (var i = 0; i < overlayElems.length; i++) {
    overlayElems[i].style.display = "block";
  }
  const text = document.querySelectorAll(".carousel p, .carousel li, .carousel h1");
  console.log(text[0]);
  for (var i = 0; i < text.length; i++) {
    text[i].style.color = "grey";
  }
}

function closeOverlay() {
  const overlayElems = document.querySelectorAll(".overlayElems, .overlayElemsRegister");

  for (var i = 0; i < overlayElems.length; i++) {
    overlayElems[i].style.display = "none";
  }
  const text = document.querySelectorAll(".carousel p, .carousel li, .carousel h1");
  console.log(text[0]);
  for (var i = 0; i < text.length; i++) {
    text[i].style.color = "white";
  }
  isOpen = false;
}

window.addEventListener("mouseup", function (event) {
  const dropdown = document.getElementById("dropdown");
  const dropdownElems = document.getElementsByClassName("dropdown-elems");

  if (event.target != dropdown && event.target.parentNode != dropdown) {
    for (var i = 0; i < dropdownElems.length; i++) {
      dropdownElems[i].style.display = "none";
    }
  }
});

function checkLoginCredentials(){
  const username=document.getElementById("username");
  const password=document.getElementById("password");
  const signinTypeText=document.getElementById("signin-type");
  if(username.value=="admin1"&&password.value=="password123"&&signinTypeText.innerHTML=="As Admin"){
    sessionStorage.setItem("admin-login","1");
    location.href = 'offered-services.html';
  }else if(username.value=="user1"&&password.value=="password123"&&signinTypeText.innerHTML=="As Customer"){
    sessionStorage.setItem("customer-login","1");
    location.href = 'TutoreMe.html';
  }else{
    alert("Wrong login credentials");
  }
}



async function modifyPageOnLogin() {

  if (await userInfo === "admin") {
    console.log(sessionStorage.getItem("admin-login"));
    const signInButton = document.getElementById("sign-in-btn");
    const registerButton = document.getElementById("register-btn");
    signInButton.innerText="Log out"
    signInButton.setAttribute('onclick', 'logOut()');
    registerButton.innerText="My Page";
    registerButton.setAttribute("href", "offered-services.html");
  }

  else if (await userInfo !== undefined && await userInfo !== "loggedOut") {
    console.log("TEST " + userInfo)
    console.log(sessionStorage.getItem("customer-login"));
    const signInButton = document.getElementById("sign-in-btn");
    const registerButton = document.getElementById("register-btn");
    console.log(signInButton);
    signInButton.innerText = "Log out"
    signInButton.setAttribute('onclick', 'logOut()');
    registerButton.innerText = "My Page";
    registerButton.setAttribute("href", "client-setting/client_settings.html");
  }
}
modifyPageOnLogin();

async function logIn(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "admin") {
    console.log("Admin login attempt");
    const res = await fetch("/api/admin-login",{
      method: "POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({password})
    });
    if (res.ok) {
      window.location.href = "offered-services.html";
    } else
        alert("Email or password is incorrectADMIN. Please try again");

  } else {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    });

    if (res.ok) {
      window.location.href = "/TutoreMe.html";
    } else
        alert("Email or password is incorrect. Please try again");
  }
}

async function logOut(){
  event.preventDefault();
  await fetch("/api/logout");
  window.location.href = "/test.html";
}