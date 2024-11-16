//this method would close the all the elements within the booking overlay
function closeBookingOverlay() {
    const dateSelector = document.getElementById("date-selector");
    const bookingOverlayElems = document.getElementsByClassName("bookingOverlayElems");
    //stop displaying all elements in the overlay by looping through all elements of class name bookingOverlayElems
    for (var i = 0; i < bookingOverlayElems.length; i++) {
        bookingOverlayElems[i].style.display = 'none';
    }
    //remove all children of the booking overlay so that the time slots are reset at next use
    const timeSlots = document.getElementById("time-slots");
    while (timeSlots.firstChild) {
        timeSlots.removeChild(timeSlots.firstChild);
    }
    //grey out the submit button 
    const submitBookButton = document.getElementById("submit-book-button");
    submitBookButton.style.backgroundColor = "rgb(133, 94, 97)";
    //reset the value of the dateSelector input
    dateSelector.value = "";
}
const timeSlotsArr = ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];
let timeSelected = false;
//this method creates buttons with a hardcoded timeSlotsArr and appends them to the timeSlots block
function selectDate() {
    const timeSlots = document.getElementById("time-slots");
    //remove old children so as to not rerender them
    while (timeSlots.firstChild) {
        timeSlots.removeChild(timeSlots.firstChild);
    }
    for (let i = 0; i < timeSlotsArr.length; i++) {
        const timeSlot = document.createElement("button");
        timeSlot.setAttribute("class", "time-slot");
        timeSlot.setAttribute("id", "time-slot" + i);
        timeSlot.setAttribute("value", "deselected");
        //give each of them an onclick method that passes the id of the timeSlot
        timeSlot.setAttribute("onclick", `selectTime('time-slot${i}')`);
        timeSlot.innerHTML = timeSlotsArr[i];
        timeSlots.appendChild(timeSlot);
    }
}
//this method sets the rgb(12, 71, 53) color and the selected value to the timeSlot of appropriate id
function selectTime(timeSlotID) {
    const timeSlots = document.getElementsByClassName("time-slot");
    const submitBookButton = document.getElementById("submit-book-button");
    for (let i = 0; i < timeSlots.length; i++) {
        if (timeSlots[i].id == timeSlotID) {
            timeSlots[i].style.backgroundColor = "rgb(12, 71, 53)";
            timeSlots[i].setAttribute("value", "selected");
            //set timeSelected to true and add a different color to submitBookButton to make it clickable
            timeSelected = true;
            submitBookButton.style.backgroundColor = "rgb(101, 9, 15)";
        } else {
            //deselect all other buttons 
            timeSlots[i].style.backgroundColor = "rgb(27, 157, 116)";
            timeSlots[i].setAttribute("value", "deselected");
        }
    }
}
//onclick method for the submitBookButton that closes the overlay for now if it is clickable
function submitTimeSlot() {
    if (timeSelected) {
        timeSelected = false;
        closeBookingOverlay();
    } else {
        console.log("greyed out");
    }
}

let services = [
    {
        price: 35,
        description: "Courses offered for Calculus I and II level problems. Flexible hours and you may cancel anytime.",
        title: "Math tutoring",
        image: "https://i0.wp.com/drsinghtutor.com/wp-content/uploads/2021/01/three-students-working-flatlay.webp?fit=920%2C614&ssl=1"
    },
    {
        price: 50,
        description: "Having trouble with your physics assignements? Our top professionals are here to help you better understand any material that may trouble you.",
        title: "Physics",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Tutoring_Physics.jpg/1280px-Tutoring_Physics.jpg"
    }
    ,
    {
        price: 20,
        description: "Want to sharpen your English skils? Come try out our tutoring services for writting and reading comprehension.",
        title: "English",
        image: "https://media.istockphoto.com/id/1383488079/photo/book-fair.jpg?s=612x612&w=0&k=20&c=9JKhUjlYzYOj6Qz0OdEWcZAn_MoepltCHZRmROzEf9o="
    }
    ,
    {
        price: 200,
        description: "Learn coding with the newest provided technologies available. We offer courses in Python, JavaScript, C++, and many more!",
        title: "Programming",
        image: "https://burst.shopifycdn.com/photos/coding-on-laptop.jpg?width=1000&format=pjpg&exif=0&iptc=0"
    }
]

const tempServices = sessionStorage.getItem("services");
    if(tempServices){
        services = JSON.parse(tempServices);
    }

function renderServicesMenu() {
    const servicesMenu = document.getElementById("services-menu");

    for (let i = 0; i < services.length; i++) {
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("class", "container right");

        const cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card");

        const titleElement = document.createElement("h2");
        const boldTitle = document.createElement("b");
        boldTitle.innerHTML = services[i].title;
        titleElement.appendChild(boldTitle);
        cardDiv.appendChild(titleElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.innerHTML = services[i].description;
        cardDiv.appendChild(descriptionElement);

        const priceElement = document.createElement("h4");
        priceElement.innerHTML = "Price: $" + services[i].price + "/hour";
        cardDiv.appendChild(priceElement);

        const bookButton = document.createElement("button");
        bookButton.setAttribute("class", "book-button");
        bookButton.innerHTML = "Book";
        bookButton.setAttribute("onclick", "openBookingOverlay()"); // Modified here
        cardDiv.appendChild(bookButton);

        containerDiv.appendChild(cardDiv);
        servicesMenu.appendChild(containerDiv);
    }
}

function openBookingOverlay() {
    document.getElementById("booking-overlay").style.display = "block";
    document.getElementById("booking-content-block").style.display = "block";
}

function closeBookingOverlay() {
    const dateSelector = document.getElementById("date-selector");
    const bookingOverlayElems = document.getElementsByClassName("bookingOverlayElems");
    //stop displaying all elements in the overlay by looping through all elements of class name bookingOverlayElems
    for (var i = 0; i < bookingOverlayElems.length; i++) {
        bookingOverlayElems[i].style.display = 'none';
    }
    //remove all children of the booking overlay so that the time slots are reset at next use
    const timeSlots = document.getElementById("time-slots");
    while (timeSlots.firstChild) {
        timeSlots.removeChild(timeSlots.firstChild);
    }
    //grey out the submit button 
    const submitBookButton = document.getElementById("submit-book-button");
    submitBookButton.style.backgroundColor = "rgb(133, 94, 97)";
    //reset the value of the dateSelector input
    dateSelector.value = "";
}

renderServicesMenu();



function signIn() {
    const dropdownElems = document.getElementsByClassName("dropdown-elems");
    for (var i = 0; i < dropdownElems.length; i++) {
        dropdownElems[i].style.display = "block";
    }
}
function openOverlay(signinType) {
    console.log(signinType);
    const dropdownElems = document.getElementsByClassName("dropdown-elems");
    const signinTypeText = document.getElementById("signin-type");
    console.log(signinTypeText);
    signinTypeText.innerHTML = signinType;
    for (var i = 0; i < dropdownElems.length; i++) {
        dropdownElems[i].style.display = 'none';
    }
    const overlayElems = document.getElementsByClassName("overlayElems");
    for (var i = 0; i < overlayElems.length; i++) {
        overlayElems[i].style.display = 'block';
    }
}
function closeOverlay() {
    const overlayElems = document.getElementsByClassName("overlayElems");
    for (var i = 0; i < overlayElems.length; i++) {
        overlayElems[i].style.display = 'none';
    }
}
window.addEventListener('mouseup', function (event) {
    const dropdown = document.getElementById("dropdown");
    const dropdownElems = document.getElementsByClassName("dropdown-elems");

    if (event.target != dropdown && event.target.parentNode != dropdown) {
        for (var i = 0; i < dropdownElems.length; i++) {
            dropdownElems[i].style.display = 'none';
        }
    }
});

