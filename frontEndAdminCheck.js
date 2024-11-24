async function checkforLoggedAdmin(){
    const res = await fetch("/api/admin-login-check");
    const adminInfo = await res.json();
    console.log(adminInfo);

    if(await adminInfo!== "admin"){
        alert("Please log in as admin to access this page");
        window.location.href = "test.html";
    }
}
checkforLoggedAdmin();


