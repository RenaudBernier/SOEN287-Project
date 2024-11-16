class Customer{
    constructor( email, password, name, address, cardNb, cvv, pfp, expDate, serv){
        this.email = email;
        this.password = password;
        this.name = name;
        this.address = address;
        this.pfp = pfp;
        this.card = new Card(cardNb, cvv, expDate);
        this.services = serv;
    }
}

class Service{
    constructor(name, date, cMessage, aMessage) {
        this.name = name;
        this.date = date; // format: "mm/dd/yyyy"
        this.customerMessage = cMessage;
        this.adminMessage = aMessage;
    }
}

class Card{
    constructor(cardNb, cvv, expDate){

        this.cardNb = cardNb;
        this.cvv = cvv;
        this.expDate = expDate;
    }
}

const service1 = new Service("Programming", "11-23-2024", "I have a complaint");
const service2 = new Service("English", "08-02-2024", "Thank you so much for today's lesson!");
const service3 = new Service("Math Tutoring", "10-04-2023", "I was charged twice on my credit card.");
const service4 = new Service("Physics", "09-01-2024", "Hello, my tutor did not show up.");


const services1 = [service1, service2];
const services2 = [service3, service4];

const customer1 = new Customer("jean@hotmail.com", 2, "Jean Tremblay", "Jean Tremblay",
    0, 0, 0, 0, services1);
const customer2 = new Customer("john@outlook.com", 3, "John Doe", "John Doe",
    0, 0, 0, 0, services2);
let customers = [customer1, customer2];

const tempCustomers = sessionStorage.getItem("customers");
if(tempCustomers)
    customers = JSON.parse(tempCustomers);

function showDetails(id){
    console.log(id);
    const detailsDiv = document.getElementById('customer' + id + '-details');
    const button = document.getElementById('button' + id);
    console.log(detailsDiv);
    console.log(detailsDiv.style.display);
    if (detailsDiv.style.display !== 'block') {
        button.innerText = 'Hide Details';
        detailsDiv.style.display = 'block';
    }
    else{
        button.innerText = 'Show Details';
        detailsDiv.style.display = 'none';
    }
}

function showMessages(customer, service){

    console.log(customer + " " + service);

    const button = document.getElementById('c' + customer + '-s' + service + '-btn');
    const messageDiv = document.getElementById('c' + customer + '-s' + service + '-messages');

    if (messageDiv.style.display !== 'block'){
        button.innerText = 'Hide Messages';
        messageDiv.style.display = 'block';
    }
    else {
        button.innerText = 'Show Messages';
        messageDiv.style.display = 'none';
    }
}

const fromDate = document.getElementById('fromDate');
console.log("From" + fromDate)
const toDate = document.getElementById('toDate');
fromDate.addEventListener('change', filterByDate);
toDate.addEventListener('change', filterByDate);

const serviceEntries = document.getElementsByClassName('service-entry');
const serviceDates = document.getElementsByClassName('service-date');

function filterByDate(){
    console.log("hello");
    const fromDateValue = new Date(fromDate.value);
    const toDateValue = new Date(toDate.value);
    for (let i = 0; i < serviceDates.length; i++) {

        console.log(serviceDates[i]);
        const serviceDate = new Date(serviceDates[i].innerText);
        if(serviceDate < fromDateValue || serviceDate > toDateValue){
            serviceEntries[i].style.display = 'none';
        }
        else serviceEntries[i].style.display = 'table-row';
    }
}

const myCust = document.getElementById("my-customers")

for (i = 0; i < customers.length; i++){
    const container = document.createElement("div");
    container.setAttribute("id", "customer" + (i));

    const header = document.createElement("div");
    header.setAttribute("class", "customer-header");

    const customerNb = document.createElement("h4");
    customerNb.innerText = "#" + (i);

    const customerName = document.createElement("h4");
    customerName.innerText = customers[i].name;
    customerName.style.minWidth = "200px";

    const customerEmail = document.createElement("h4");
    customerEmail.innerText = customers[i].email;
    customerEmail.style.minWidth = "200px";

    const btnWrapper = document.createElement("h4");
    const showDetailsBtn = document.createElement("button");
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

    const tableLabels = new Array();
    for (let j = 0; j < 4; j++){
        tableLabels[j] = document.createElement("th");
        labelRow.appendChild(tableLabels[j]);
    }

    tableLabels[0].innerText = "Service";
    tableLabels[1].innerText = "Date";
    tableLabels[2].innerText = "See Messages";
    tableLabels[3].innerText = "See Bill";

    sTable.appendChild(labelRow);


    for (let j = 0; j < customers[i].services.length; j++){
        const entryRow = document.createElement("tr");
        entryRow.className = "service-entry";
        entryRow.style.outline = "black 1px solid";

        const tds = new Array(4);
        for (let k = 0; k < 4; k++) {
            tds[k] = document.createElement("td");
            entryRow.appendChild(tds[k]);
        }

        tds[0].innerText = customers[i].services[j].name;
        tds[1].innerText = customers[i].services[j].date;
        tds[1].style.minWidth = "75px";
        tds[1].className = "service-date";

        const messageButton = document.createElement("button");
        messageButton.setAttribute("id", "c" + i + "-s" + j + "-btn");
        messageButton.setAttribute("onclick", "showMessages(" + i +"," + j
        + ")");
        messageButton.innerText = "Show Messages";

        tds[2].appendChild(messageButton);

        const billButton = document.createElement("button");
        billButton.innerText = "Show Bill";

        tds[3].appendChild(billButton);
        sTable.appendChild(entryRow);

        const messageContainer = document.createElement("tr");
        messageContainer.className = "messages-container";
        messageContainer.id = 'c' + i + '-s' + j + '-messages';
        //getElementById('c' + customer + '-s' + service + '-messages');
        messageContainer.style.display = "none";
        const td = document.createElement("td");
        td.setAttribute("colspan", "3");


        if (customers[i].services[j].customerMessage !== undefined) {
            const custMessage = document.createElement("div");
            custMessage.className = "customer-message";
            custMessage.innerHTML = "<h4>Customer said:</h4>";


            const custMessageTxt = document.createElement("p");
            custMessageTxt.innerText = customers[i].services[j].customerMessage;

            custMessage.appendChild(custMessageTxt);

            td.appendChild(custMessage);
        }


        const myMessage = document.createElement("div");


        myMessage.className = "my-message";
        myMessage.id = 'c' + i + '-s' + j +'-my-message';
        myMessage.innerHTML = "<h4>You replied:</h4>";

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
        messageBox.setAttribute("width", "100%");
        messageBox.setAttribute("rows", "8");

        if (customers[i].services[j].adminMessage !== undefined) {
            messageBox.innerText = customers[i].services[j].adminMessage;
        }
        else
            myMessage.setAttribute("placeholder", "Type your reply here");

        messageBox.setAttribute("placeholder", "Type your reply here");
        messageBox.id = "c" + i + "-s" + j + "-message-box";
        td.appendChild(messageBox);

        const sendBtn = document.createElement("button");
        sendBtn.innerText = "Send Reply / Edit current reply";
        sendBtn.setAttribute("onclick", "sendMessage(" + i + "," + j + ")");
        td.appendChild(sendBtn);


        messageContainer.appendChild(td);

        sTable.appendChild(messageContainer);
    }


    details.appendChild(sTable);
    console.log(sTable);

    container.appendChild(details);
    myCust.appendChild(container);
}

function sendMessage(customer, service){
    console.log(customer+  " " + service);
    const messageValue = document.getElementById("c" + customer + "-s" + service + "-message-box").value;
    const myMessage = document.getElementById('c' + customer +  '-s' + service +'-my-message');

    if (messageValue !== "") {
        customers[customer].services[service].adminMessage = messageValue;
        myMessage.querySelector("p").innerText = messageValue;

        myMessage.style.display = "block";
        sessionStorage.setItem("customers", JSON.stringify(customers));
    }

}