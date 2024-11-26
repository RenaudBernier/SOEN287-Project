let id = null;
let customerInfo;

async function fillInputBoxes(){
    const res = await fetch("/api/login-check");
    const userInfo = await res.json();

    if(userInfo !== "loggedOut" && window.location.href.includes("client_settings.html")){
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

    id = await userInfo.id;
    customerInfo = await userInfo;
}

fillInputBoxes();


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
        const response = await fetch(`/api/my-orders/`);
        const orders = await response.json();

        for (let i = 0; i < orders.length; i++) {
            const tr = document.createElement("tr");
            if(i%2!=0){
                tr.setAttribute("class", "odd-tr")
            }else{
                tr.setAttribute("class", "even-tr")
            }
            const orderLabel = document.createElement("td");
            const serviceName = document.createElement("td");
            const date = document.createElement("td");
            const price = document.createElement("td");

            orderLabel.innerHTML = "#" + String(orders[i].order_id).padStart(3, "0");
            serviceName.innerHTML = orders[i].name;
            date.innerHTML = orders[i].time_slot.substring(0, 10);
            price.innerHTML = "$" + orders[i].price.toFixed(2);

            orderLabel.style.color = "blue";
            orderLabel.style.textDecoration = "underline";

            orderLabel.addEventListener("mousedown", () =>{
                orderLabel.style.color = "red";
            });
            orderLabel.addEventListener("mouseup", () =>{
                orderLabel.style.color = "blue";
            });

            orders[i].time = orders[i].time_slot.substring(11);
            orders[i].date = orders[i].time_slot.substring(0, 10);

            orderLabel.addEventListener("click", () => openBill(customerInfo, orders[i]));
            orderLabel.className = "order-label";

            tr.appendChild(orderLabel);
            tr.appendChild(serviceName);
            tr.appendChild(date);
            tr.appendChild(price);

            orderContainer.appendChild(tr);
        }
    }
}
orderSummaryGeneration();


function openBill(customerInfo, bookedServiceInfo) {
    const billContentBlock = document.getElementById("bill-content-block");
    const billInfo = document.getElementById("bill-info");
    billInfo.style.padding= "1em";
    billInfo.style.boxSizing= "border-box";
    billInfo.style.borderStyle= "dotted";
    const billServiceOrder = document.createElement("h2");
    billServiceOrder.innerHTML="Order #"+bookedServiceInfo.order_id
    billServiceOrder.setAttribute("class", "billOverlayElems");
    billServiceOrder.style.marginBottom="0";

    const billServiceName = document.createElement("h3");
    billServiceName.innerHTML="For " + bookedServiceInfo.name;
    billServiceName.setAttribute("class", "billOverlayElems");
    billServiceName.style.marginTop="3px";

    const billServiceClient = document.createElement("h5");
    billServiceClient.innerHTML="Client Name: " + customerInfo.name;
    billServiceClient.setAttribute("class", "billOverlayElems");

    const billServiceEmail = document.createElement("h5");
    billServiceEmail.innerHTML="Email: " + customerInfo.email;
    billServiceEmail.setAttribute("class", "billOverlayElems");

    const billServicePrice = document.createElement("h5");
    billServicePrice.innerHTML="Price: $" + bookedServiceInfo.price.toFixed(2);
    billServicePrice.setAttribute("class", "billOverlayElems");

    const billServiceDate = document.createElement("h5");
    billServiceDate.innerHTML="Date: " + bookedServiceInfo.date+" at "+bookedServiceInfo.time;
    billServiceDate.setAttribute("class", "billOverlayElems");

    var billServiceCompletedContainer = document.createElement("div");
    billServiceCompletedContainer.setAttribute("class", "billOverlayElems");
    billServiceCompletedContainer.style.textAlign = "center";
    billServiceCompletedContainer.style.justifyItems = "center";

    var billServiceCompletedLabel = document.createElement("h5");
    billServiceCompletedLabel.innerHTML="Payment status:"
    billServiceCompletedLabel.style.width = "fit-content";
    billServiceCompletedLabel.style.marginBottom = "1em";


    var billServiceCompleted = document.createElement("input");
    billServiceCompleted.setAttribute("type", "checkbox");
    billServiceCompleted.setAttribute("disabled","true");
    billServiceCompleted.setAttribute("id","checkbox-"+bookedServiceInfo.orderId);
    billServiceCompleted.setAttribute("name", "payment");
    billServiceCompleted.setAttribute("class", "billOverlayElems");
    billServiceCompleted.style.width = "auto";

        if(bookedServiceInfo.service_fulfilled===0){
            billServiceCompleted.checked=false;
        }else{
            billServiceCompleted.checked=true;
        }

    billInfo.appendChild(billServiceOrder);
    billInfo.appendChild(billServiceName);
    billInfo.appendChild(billServiceClient);
    billInfo.appendChild(billServiceEmail);
    billInfo.appendChild(billServicePrice);
    billInfo.appendChild(billServiceDate);
    billInfo.appendChild(billServiceCompletedContainer);
    billServiceCompletedContainer.appendChild(billServiceCompletedLabel);
    billServiceCompletedContainer.appendChild(billServiceCompleted);

    const billOverlayElems = document.getElementsByClassName("billOverlayElems");
    for (var i = 0; i < billOverlayElems.length; i++) {
        billOverlayElems[i].style.display = 'block';
    }
    //added animation by changing the classList of bookingContentBlock
    billContentBlock.classList.remove("retract");
    billContentBlock.classList.add("expand");
}
function closeBillOverlay() {
    const billContentBlock = document.getElementById("bill-content-block");
    //added animation by changing the classList of bookingContentBlock
    billContentBlock.classList.remove("expand");
    billContentBlock.classList.add("retract");
    setTimeout(() => {
        const billOverlayElems = document.getElementsByClassName("billOverlayElems");
        //stop displaying all elements in the overlay by looping through all elements of class name bookingOverlayElems
        for (var i = 0; i < billOverlayElems.length; i++) {
            billOverlayElems[i].style.display = 'none';
        }
        const billInfo = document.getElementById("bill-info");
        while (billInfo.firstChild) {
            billInfo.removeChild(billInfo.firstChild);
        }
        const billButtonContainer = document.getElementById("bill-button-container");
        while (billButtonContainer.firstChild) {
            billButtonContainer.removeChild(billButtonContainer.firstChild);
        }
    }, 300);
}