async function checkforLoggedUser(){
    const res = await fetch("/api/login-check");
    const userInfo = await res.json();
    console.log(userInfo);

    if (await userInfo == "loggedOut"){
        alert("Please log in to access this page");
        window.location.href = "test.html";
    }
    else
        console.log("logged in");
}
checkforLoggedUser();