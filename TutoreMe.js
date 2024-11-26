let serviceId;
let serviceDate;
let serviceDateIndex;
//this method would close the all the elements within the booking overlay
let services = []
let formattedResult = []
let userData = {};
let initializedUser = false;

const parseSchedule = (input) => {
  const entries = input.split(';');
  const result = {};

  entries.forEach(entry => {
    const [rawDate, ...rawTimeSlots] = entry.split(':');

    const [month, day, year] = rawDate.split('-');
    const formattedDate = `${year}-${month}-${day}`;

    const timeSlots = rawTimeSlots.join(':').split(',');

    result[formattedDate] = timeSlots;
  });

  return result;
};


const fetchServices = async () => {
  try {
    const response = await fetch('/api/services');
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      services.push(data[i]);
    }
    data.forEach(item => {
      if (item.time_slots) {
        formattedResult[item.id] = parseSchedule(item.time_slots);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const fetchUserData = async () => {
  const response = await fetch('/api/login-check');
  const data = await response.json();
  return data;
};
const initializePage = async () => {
  await fetchServices();
  renderServicesMenu();
  userData = await fetchUserData();
  if (userData === "loggedOut"||userData==="admin") {
    initializedUser = false;
  } else {
    initializedUser = true;
  }
};
initializePage();

function renderServicesMenu() {
  const servicesMenu = document.getElementById("services-menu");

  for (let i = 0; i < services.length; i++) {
    const containerDiv = document.createElement("div");
    containerDiv.setAttribute("class", "container right");

    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card");

    const titleElement = document.createElement("h2");
    const boldTitle = document.createElement("b");
    boldTitle.innerHTML = services[i].name;
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
    //bookButton.setAttribute("onclick", "openBookingOverlay()"); // Modified here
    bookButton.setAttribute("onclick", `bookService('${services[i].id}')`);
    cardDiv.appendChild(bookButton);

    containerDiv.appendChild(cardDiv);
    servicesMenu.appendChild(containerDiv);
  }
}

function bookService(id) {
  const dateContainer = document.getElementById("date-container");
  const bookingContentBlock = document.getElementById("booking-content-block");
  cLogin = sessionStorage.getItem("customer-login");
  if (initializedUser) {
    const bookingOverlayElems = document.getElementsByClassName("bookingOverlayElems");
    const dateSelector = document.createElement("input");
    dateSelector.setAttribute("id", "date-selector");
    dateSelector.setAttribute("type", "date");
    dateSelector.addEventListener("change", function () {
      selectDate(id, this.value);
    });
    dateContainer.appendChild(dateSelector);
    for (var i = 0; i < bookingOverlayElems.length; i++) {
      bookingOverlayElems[i].style.display = 'block';
    }
    //added animation by changing the classList of bookingContentBlock
    bookingContentBlock.classList.remove("retract");
    bookingContentBlock.classList.add("expand");
  }
  else
    alert("You must be logged in to book a service");

}


function closeBookingOverlay() {
  const dateSelector = document.getElementById("date-selector");
  const dateContainer = document.getElementById("date-container");
  const bookingContentBlock = document.getElementById("booking-content-block");
  serviceId = null;
  serviceDate = "";
  serviceDateIndex = null;

  dateContainer.removeChild(dateSelector);
  //added animation by changing the classList of bookingContentBlock
  bookingContentBlock.classList.remove("expand");
  bookingContentBlock.classList.add("retract");
  setTimeout(() => {
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
  }, 300);
}
let timeSelected = false;
//this method creates buttons with a hardcoded timeSlotsArr and appends them to the timeSlots block
function selectDate(id, date) {
  const timeSlots = document.getElementById("time-slots");
  timeSlots.style.gridTemplateColumns = "repeat(3, 1fr)";
  //remove old children so as to not rerender them
  while (timeSlots.firstChild) {
    timeSlots.removeChild(timeSlots.firstChild);
  }
  if (formattedResult[id][date]) {
    for (let i = 0; i < formattedResult[id][date].length; i++) {
      const timeSlot = document.createElement("button");
      timeSlot.setAttribute("class", "time-slot");
      timeSlot.setAttribute("id", "time-slot" + i);
      timeSlot.setAttribute("value", "deselected");
      //give each of them an onclick method that passes the id of the timeSlot

      timeSlot.setAttribute(
        "onclick",
        `selectTime('time-slot${i}', ${id}, '${date}', ${i})`
      );

      timeSlot.innerHTML = formattedResult[id][date][i];
      timeSlots.appendChild(timeSlot);
    }
  } else {
    const timeSlot = document.createElement("button");
    timeSlot.setAttribute("class", "time-slot");
    timeSlot.setAttribute("id", "time-slot");
    timeSlot.setAttribute("value", "deselected");
    timeSlots.style.gridTemplateColumns = "repeat(1, 1fr)";
    timeSlot.innerHTML = "No time slots available for this date";
    timeSlots.appendChild(timeSlot);
  }

}

function selectTime(timeSlotID, id, date, index) {
  serviceId = id;
  serviceDate = date;
  serviceDateIndex = index;
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

async function submitTimeSlot() {
  const requestData = {
    client_id: userData.id,
    service_id: serviceId,
    time_slot: `${serviceDate} ${formattedResult[serviceId][serviceDate][serviceDateIndex]}`,
    service_fulfilled: false,
    message: "",
    reponse: ""
  };
  if (timeSelected) {
    try {
      const response = await fetch('/api/book-time-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Booking successful:", result);
      } else {
        console.error("Error in booking:", result.error);
      }
    } catch (error) {
      console.error("Error submitting time slot:", error);
    }

    const index = formattedResult[serviceId][serviceDate].indexOf(formattedResult[serviceId][serviceDate][serviceDateIndex]);
    if (index > -1) {
      formattedResult[serviceId][serviceDate].splice(index, 1);
    }
    const reverseParseSchedule = (input, id) => {
      const schedule = input[id];
      const entries = [];

      Object.entries(schedule).forEach(([date, timeSlots]) => {
        const [year, month, day] = date.split('-');
        const formattedDate = `${month}-${day}-${year}`;
        entries.push(`${formattedDate}:${timeSlots.join(',')}`);
      });

      return `${entries.join(';')}`;
    };
    updatedTimeSlots = reverseParseSchedule(formattedResult, serviceId);
    try {
      const response = await fetch(`/api/services/${serviceId}/time-slots`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time_slots: updatedTimeSlots })
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Time slots updated successfully:", result);
      } else {
        console.error("Error updating time slots:", result.error);
      }
    } catch (error) {
      console.error("Error submitting time slot:", error);
    }
    timeSelected = false;
    closeBookingOverlay();
  } else {
  }
}


// function openBookingOverlay() {
//     document.getElementById("booking-overlay").style.display = "block";
//     document.getElementById("booking-content-block").style.display = "block";
// }

function signIn() {
  const dropdownElems = document.getElementsByClassName("dropdown-elems");
  for (var i = 0; i < dropdownElems.length; i++) {
    dropdownElems[i].style.display = "block";
  }
}

function openOverlay(signinType) {
  const dropdownElems = document.getElementsByClassName("dropdown-elems");
  const signinTypeText = document.getElementById("signin-type");
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
