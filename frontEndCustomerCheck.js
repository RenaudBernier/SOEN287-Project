//Checks if the user is logged in as customer. This is used to determine whether or not the user has access to some pages.

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