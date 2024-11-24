async function checkforLoggedUser(){

    console.log("Checking customer login");
    const res = await fetch("../api/login-check");
    const userInfo = await res.json();
    console.log("info: " + userInfo);

    if (await userInfo === undefined || await userInfo === "loggedOut"){
        alert("Please log in to access this page");
        window.location.href = "../test.html";
    }
}
checkforLoggedUser();