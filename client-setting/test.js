var isOpen = false;



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
    location.href = '../offered-services.html';
  }else if(username.value=="user1"&&password.value=="password123"&&signinTypeText.innerHTML=="As Customer"){
    sessionStorage.setItem("customer-login","1");
    location.href = '../TutoreMe.html';
  }else{
    alert("Wrong login credentials");
  }
}

if (sessionStorage.getItem("admin-login")) {
  console.log(sessionStorage.getItem("admin-login"));
  const signInButton = document.getElementById("sign-in-btn");
  const registerButton = document.getElementById("register-btn");
  signInButton.innerText="Log out"
  signInButton.setAttribute('onclick', 'logOut()');
  registerButton.innerText="My Page";
  registerButton.setAttribute("href", "../offered-services.html");
}

if (sessionStorage.getItem("customer-login")) {
  console.log(sessionStorage.getItem("customer-login"));
  const signInButton = document.getElementById("sign-in-btn");
  const registerButton = document.getElementById("register-btn");
  console.log(signInButton);
  signInButton.innerText="Log out"
  signInButton.setAttribute('onclick', 'logOut()');
  registerButton.innerText="My Page";
  registerButton.setAttribute("href", "client_settings.html");
}

function logOut(){
  sessionStorage.removeItem('customer-login');
  sessionStorage.removeItem('admin-login');
  window.location.href="../test.html";
}