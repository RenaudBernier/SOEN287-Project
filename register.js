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
        this.date = date; //  "mm/dd/yyyy"
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

function nextPart(){
const part1 = document.getElementById("part1");
const part2 = document.getElementById("part2");

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const confirmation = document.getElementById("confirmation").value;
const email = document.getElementById("email").value;

//Checks for a valid email: Has over 4 characters, has an @, and has a dot that follows the @
let validEmail = false;
if (email.length > 4) {
    let hasAt = false;
    for (let i = 0; i < email.length; i++) {
        if (email[i] === '@') {
            hasAt = true;
        }
        if (email[i] === '.' && hasAt === true) {
            validEmail = true;
        }
    }
}

//If invalid information was entered in #part1 of the form, the user is asked to rewrite their information.
if (username.length < 6){
    alert("Your username is too short. It should have at least 6 characters.");
}
else if (!validEmail){
    alert("Please enter a valid email.");
}
else if (password.length < 8){
    alert("Your password is too short. It should have at least 8 characters.");
}
else if (password !== confirmation){
    alert("Please make sure that you entered the same password twice.");
}

//Else, the user is sent to #part2 of the form
else {
    part1.style.display = "none";
    part2.style.display = "flex";
}
}

function registerUser(){

    const part1 = document.getElementById("part1");
    const part2 = document.getElementById("part2");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmation").value;
    const email = document.getElementById("email").value;
    const cardNb = document.getElementById("CVV").value;
    const cvv = document.getElementById("card-number").value;
    const cardDate = document.getElementById("exp-date").value;
    console.log("Date: " + cardDate);

    const customer = new Customer(email, password, username, 0, cardNb, cvv, 0, cardDate );
    sessionStorage.setItem("customer-login", 1);
}