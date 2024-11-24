let id = null;

async function fillInputBoxes(){
    const res = await fetch("/api/login-check");
    const userInfo = await res.json();
    console.log(userInfo);

    if(userInfo !== "loggedOut"){
        const nameBox = document.getElementById("client-name");
        const emailBox = document.getElementById("client-email");
        const passwordBox = document.getElementById("client-password");
        const addressBox = document.getElementById("client-address");
        const creditCardBox = document.getElementById("credit-card-number");
        const expDateBox = document.getElementById("expiry-date");
        const cvvBox = document.getElementById("cvv");

        nameBox.value = userInfo.name;
        emailBox.value = userInfo.email;
        passwordBox.value = userInfo.password;
        addressBox.value = userInfo.address;
        creditCardBox.value = userInfo.creditCardNumber;
        expDateBox.value = userInfo.expiryDate;
        cvvBox.value = userInfo.CVV;
    }

    console.log("in function: " + userInfo.id);
    id = await userInfo.id;
}

fillInputBoxes();

console.log("out of func: " + id);

async function updateUserData(event){
    event.preventDefault();

    const form = event.target;

    const name = form.elements["name"].value;
    const email = form.elements["email"].value;
    const password = form.elements["password"].value;
    const address = form.elements["address"].value;
    const creditCardNumber = form.elements["creditCardNumber"].value;
    const expiryDate = form.elements["expiryDate"].value;
    const CVV = form.elements["CVV"].value;

    console.log("In newInfo: " + id);
    const newInfo = {id, name, email, password, address, creditCardNumber, expiryDate, CVV};

    fetch("/api/update-user", {
        method: "POST",
        body: JSON.stringify(newInfo),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function orderSummaryGeneration(){
    const orderContainer = document.getElementById("order-summary");
    if (orderContainer !== null) {
        const orders = fetch(`/api/my-orders/`);
        console.log("Received array: ", orders);
    }
}
orderSummaryGeneration();

