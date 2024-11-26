let services = [];
let serviceBooked = [];
let userData = {};

const fetchServices = async () => {
    try {
        const response = await fetch('/api/services');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            services.push(data[i]);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const fetchServiceBooked = async () => {
    try {
        const response = await fetch('/api/servicebooked');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            serviceBooked.push(data[i]);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const fetchCustomers = async () => {
    const response = await fetch('/api/Customers');
    const data = await response.json();
    return data;
};

const initializePage = async () => {
    let realCustomers = [];

    await fetchServices();
    await fetchServiceBooked();
    userData = await fetchCustomers();


    for (let i = 0; i < userData.length; i++) {
        let tmpCustomer = {};
        let realServices = [];

        tmpCustomer = userData[i];
        for (let j = 0; j < serviceBooked.length; j++) {
            let tmpService = {};
            if (userData[i].id == serviceBooked[j].client_id) {
                tmpService.date = serviceBooked[j].time_slot.slice(0, serviceBooked[j].time_slot.indexOf(' '));
                tmpService.time = serviceBooked[j].time_slot.slice(serviceBooked[j].time_slot.indexOf(' ') + 1);
                tmpService.customerMessage = serviceBooked[j].message;
                tmpService.adminMessage = serviceBooked[j].reponse;
                tmpService.orderId=serviceBooked[j].order_id;
                tmpService.serviceFulfilled=serviceBooked[j].service_fulfilled;
                for (let k = 0; k < services.length; k++) {
                    if (serviceBooked[j].service_id === services[k].id) {
                        tmpService.name = services[k].name;
                        tmpService.serviceId=services[k].id;
                        tmpService.price=services[k].price;

                    }

                }
                realServices.push(tmpService)
            }
        }
        tmpCustomer.services = realServices;
        realCustomers.push(tmpCustomer);
    }
    renderCustomerInfo(realCustomers);
};

initializePage();

const tempCustomers = sessionStorage.getItem("customers");
if (tempCustomers)
    customers = JSON.parse(tempCustomers);

function showDetails(id) {
    const detailsDiv = document.getElementById('customer' + id + '-details');
    const button = document.getElementById('button' + id);
    if (detailsDiv.style.display !== 'block') {
        button.innerText = 'Hide Details';
        detailsDiv.style.display = 'block';
    }
    else {
        button.innerText = 'Show Details';
        detailsDiv.style.display = 'none';
    }
}

function showMessages(customer, service) {

    const button = document.getElementById('c' + customer + '-s' + service + '-btn');
    const messageDiv = document.getElementById('c' + customer + '-s' + service + '-messages');

    if (messageDiv.style.display !== 'block') {
        button.innerText = 'Hide Messages';
        messageDiv.style.display = 'block';
    }
    else {
        button.innerText = 'Show Messages';
        messageDiv.style.display = 'none';
    }
}

const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
fromDate.addEventListener('change', filterByDate);
toDate.addEventListener('change', filterByDate);

const serviceEntries = document.getElementsByClassName('service-entry');
const serviceDates = document.getElementsByClassName('service-date');

function filterByDate() {
    const fromDateValue = new Date(fromDate.value);
    const toDateValue = new Date(toDate.value);
    for (let i = 0; i < serviceDates.length; i++) {

        const serviceDate = new Date(serviceDates[i].innerText);
        if (serviceDate < fromDateValue || serviceDate > toDateValue) {
            serviceEntries[i].style.display = 'none';
        }
        else serviceEntries[i].style.display = 'table-row';
    }
}

const myCust = document.getElementById("my-customers")

function renderCustomerInfo(customers) {

    for (i = 0; i < customers.length; i++) {
        const container = document.createElement("div");
        container.setAttribute("id", "customer" + (customers[i].id));

        const header = document.createElement("div");
        header.setAttribute("class", "customer-header");

        const customerNb = document.createElement("h4");
        customerNb.innerText = "#" + (customers[i].id);

        const customerName = document.createElement("h4");
        customerName.innerText = customers[i].name;
        customerName.style.minWidth = "200px";

        const customerEmail = document.createElement("h4");
        customerEmail.innerText = customers[i].email;
        customerEmail.style.minWidth = "200px";

        const btnWrapper = document.createElement("h4");
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.setAttribute("class", "customer-btn");
        showDetailsBtn.setAttribute("id", "button" + i)
        showDetailsBtn.setAttribute("onclick", "showDetails(" + i + ")");
        showDetailsBtn.innerHTML = "Show Details";

        btnWrapper.appendChild(showDetailsBtn);
        header.appendChild(customerNb);
        header.appendChild(customerName);
        header.appendChild(customerEmail);
        header.appendChild(btnWrapper);
        container.appendChild(header);

        const details = document.createElement("div");
        details.classList.add("details");
        details.setAttribute("id", "customer" + i + "-details");


        const custServices = document.createElement("div");
        custServices.className = "services";

        const sTable = document.createElement("table");
        sTable.className = "services-table";

        const labelRow = document.createElement("tr");
        labelRow.style.borderStyle="solid";
        labelRow.style.borderColor="black";

        labelRow.style.borderBottom="0";

        const tableLabels = new Array();
        for (let j = 0; j < 5; j++) {
            tableLabels[j] = document.createElement("th");
            labelRow.appendChild(tableLabels[j]);
        }

        tableLabels[0].innerText = "Service";
        tableLabels[1].innerText = "Date";
        tableLabels[2].innerText = "Time";
        tableLabels[3].innerText = "See Messages";
        tableLabels[4].innerText = "See Bill";

        sTable.appendChild(labelRow);


        for (let j = 0; j < customers[i].services.length; j++) {
            const entryRow = document.createElement("tr");
            entryRow.className = "service-entry";
            entryRow.style.outline = "black 1px solid";

            const tds = new Array(5);
            for (let k = 0; k < 5; k++) {
                tds[k] = document.createElement("td");
                entryRow.appendChild(tds[k]);
            }

            tds[0].innerText = customers[i].services[j].name;
            tds[1].innerText = customers[i].services[j].date;
            tds[1].style.minWidth = "75px";
            tds[1].className = "service-date";
            tds[2].innerText = customers[i].services[j].time;

            const messageButton = document.createElement("button");
            messageButton.setAttribute("class", "customer-btn");
            messageButton.setAttribute("id", "c" + i + "-s" + j + "-btn");
            messageButton.setAttribute("onclick", "showMessages(" + i + "," + j
                + ")");
            messageButton.innerText = "Show Messages";

            tds[3].appendChild(messageButton);

            const billButton = document.createElement("button");
            billButton.setAttribute("class", "customer-btn");
            billButton.innerText = "Show Bill";
            const customerInfo=customers[i];
            const bookedServiceInfo=customers[i].services[j];
            billButton.addEventListener("click", function () {
                openBill(customerInfo, bookedServiceInfo);
              });
            tds[4].appendChild(billButton);
            sTable.appendChild(entryRow);

            const messageContainer = document.createElement("tr");
            messageContainer.className = "messages-container";
            messageContainer.id = 'c' + i + '-s' + j + '-messages';
            messageContainer.style.display = "none";
            const td = document.createElement("td");
            td.setAttribute("colspan", "3");
            td.style.paddingLeft="0";
            td.style.paddingRight="0";

            if (customers[i].services[j].customerMessage !== undefined) {
                const custMessage = document.createElement("div");
                custMessage.className = "customer-message";
                custMessage.innerHTML = "<h4>Customer message:</h4>";


                const custMessageTxt = document.createElement("p");
                custMessageTxt.innerText = customers[i].services[j].customerMessage;

                custMessage.appendChild(custMessageTxt);

                td.appendChild(custMessage);
            }


            const myMessage = document.createElement("div");


            myMessage.className = "my-message";
            myMessage.id = 'c' + i + '-s' + j + '-my-message';
            myMessage.innerHTML = "<h4>Your reply:</h4>";

            const myMessageTxt = document.createElement("p");
            myMessageTxt.innerText = customers[i].services[j].adminMessage;


            myMessage.appendChild(myMessageTxt);

            if (customers[i].services[j].adminMessage !== undefined) {
                myMessage.style.display = "block";

            }
            else
                myMessage.style.display = "none";

            td.appendChild(myMessage);


            //CREATE INPUT BOX FOR MODIFY/SEND AND APPEND TO TD
            const messageBox = document.createElement("textarea");
            messageBox.style.width="100%";
            messageBox.style.marginTop="1em";
            messageBox.style.boxSizing= "border-box";
            messageBox.setAttribute("class","textarea-class")
            messageBox.setAttribute("rows", "8");
            if (customers[i].services[j].reponse !== undefined) {
                messageBox.innerText = customers[i].services[j].reponse;
            }
            else
                myMessage.setAttribute("placeholder", "-> Type your reply here");

            messageBox.setAttribute("placeholder", "-> Type your reply here");
            messageBox.id = "c" + i + "-s" + j + "-message-box";
            td.appendChild(messageBox);

            const sendBtn = document.createElement("button");
            sendBtn.innerText = "Send / Edit reply";
            sendBtn.style.width="100%";
            sendBtn.setAttribute("class","customer-btn")
            const orderId=customers[i].services[j].orderId;
            const messageIndex="c" + i + "-s" + j + "-my-message";
            sendBtn.onclick = () => {
                const message = messageBox.value;
                sendMessage(orderId, message, messageIndex);
              };
            td.appendChild(sendBtn);


            messageContainer.appendChild(td);

            sTable.appendChild(messageContainer);
        }


        details.appendChild(sTable);

        container.appendChild(details);
        myCust.appendChild(container);
    }
}



async function sendMessage(orderId, newResponse, messageIndex) {
    try {    
        const response = await fetch('/api/update-response', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: orderId,
            reponse: newResponse,
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating response:", errorData.error);
          alert(`Error: ${errorData.error}`);
          return;
        }
    
        const data = await response.json();
        console.log("Response updated successfully:", data.message);
      } catch (error) {
        console.error("An error occurred while updating response:", error);
      }
      const myMessage = document.getElementById(messageIndex).getElementsByTagName("p")
      myMessage[0].innerHTML=newResponse;
}
function openBill(customerInfo, bookedServiceInfo) {
    const billContentBlock = document.getElementById("bill-content-block");

    const billInfo = document.getElementById("bill-info");
    billInfo.style.padding= "1em";
    billInfo.style.boxSizing= "border-box";
    billInfo.style.borderStyle= "dotted";
    const billServiceOrder = document.createElement("h2");
    billServiceOrder.innerHTML="Order #"+bookedServiceInfo.orderId
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
    billServiceCompleted.setAttribute("id","checkbox-"+bookedServiceInfo.orderId);
    billServiceCompleted.setAttribute("name", "payment");
    billServiceCompleted.setAttribute("class", "billOverlayElems");
    billServiceCompleted.style.width = "auto";

    if(bookedServiceInfo.value!="modified"){
        if(bookedServiceInfo.serviceFulfilled===0){
            billServiceCompleted.checked=false;
        }else{
            billServiceCompleted.checked=true;
        }
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

    const billButtonContainer=document.getElementById("bill-button-container");
    const submitBillButton=document.createElement("button");
    submitBillButton.setAttribute("id","submit-bill-button");
    submitBillButton.innerHTML="Submit";

    const checkedOrder=bookedServiceInfo.orderId;
    submitBillButton.addEventListener("click", function () {
        const checkedStatus=billServiceCompleted.checked;
        submitPaymentConfirmation(checkedStatus,checkedOrder);
      });
    billButtonContainer.appendChild(submitBillButton);

        const billOverlayElems = document.getElementsByClassName("billOverlayElems");
        for (var i = 0; i < billOverlayElems.length; i++) {
            billOverlayElems[i].style.display = 'block';
        }
        //added animation by changing the classList of bookingContentBlock
        billContentBlock.classList.remove("retract");
        billContentBlock.classList.add("expand");
}
async function submitPaymentConfirmation(checkedStatus,checkedOrder){
    try {    
        const response = await fetch('/api/update-status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: checkedOrder,
            service_fulfilled: checkedStatus,
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating response:", errorData.error);
          alert(`Error: ${errorData.error}`);
          return;
        }
    
        const data = await response.json();
        console.log("Response updated successfully:", data.message);
      } catch (error) {
        console.error("An error occurred while updating response:", error);
      }
    closeBillOverlay();
    location.reload();
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