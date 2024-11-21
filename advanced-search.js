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

let services=[]
let formattedResult=[]

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      for(let i=0;i<data.length;i++){
        services.push(data[i]);
      }
      data.forEach(item => {
        if(item.time_slots){
            formattedResult[item.id] = parseSchedule(item.time_slots);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const initializePage = async () => {
    await fetchServices();
    renderServicesMenu(services);
    renderFilters(services);
  };
  initializePage();

//setup the filterOptions
let filterOptions = {
    search: "",
    service: "none",
    minPrice: 0,
    maxPrice: 0
};

function renderServicesMenu(services) {
    for (let j = 0; j < services.length; j++) {
        //get the general block of servicesMenu where everything will be displayed
        const servicesMenu = document.getElementById("services-menu");
        //create a singular block from the menu
        const menuElement = document.createElement("div");
        menuElement.setAttribute("class", "menuClass");
        menuElement.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${services[j].image_url}') center/cover no-repeat`;
        //create all the elements that will be stored in the menuElement
        const menuPrice = document.createElement("p");
        const menuDescription = document.createElement("p");
        const menuTitle = document.createElement("p");
        const bookButton = document.createElement("button");
        //give all the children a class
        menuPrice.setAttribute("class", "menuElementClass");
        menuDescription.setAttribute("class", "menuElementClass");
        menuTitle.setAttribute("class", "menuElementClass");
        bookButton.setAttribute("onclick", `bookService('${services[j].id}')`);
        //give the children their respective innerHTML, values and append them
        menuTitle.innerHTML = services[j].name;
        menuTitle.value = services[j].name;
        menuElement.appendChild(menuTitle);

        menuPrice.innerHTML = "Price: " + services[j].price + "$";
        menuPrice.value = services[j].price;
        menuElement.appendChild(menuPrice);

        menuDescription.innerHTML = "Description: " + services[j].description;
        menuDescription.value = services[j].description;
        menuElement.appendChild(menuDescription);

        bookButton.innerHTML = "Book";
        bookButton.setAttribute("class", "book-button");
        menuElement.appendChild(bookButton);
        //append the menu block to the full menu
        servicesMenu.appendChild(menuElement);
    }
    applyFilters();
}

function sortAlphabetically(){
    const sortingArrow=document.getElementById("sorting-arrow");
    let index=1;
    if(sortingArrow.value=="downward"){
        sortingArrow.value="upward";
        sortingArrow.innerHTML="&#8593";
        index=-1;
    }else if(sortingArrow.value="upward"){
        sortingArrow.value="downward";
        sortingArrow.innerHTML="&#8595";
        index=1;
    }

        services.sort(function (a, b) {
            if (a.name < b.name) {
                return -1*index;
            }
            if (a.name > b.name) {
                return 1*index;
            }
            return 0;
        })
    const servicesMenu = document.getElementById("services-menu");
    while (servicesMenu.firstChild) {
        servicesMenu.removeChild(servicesMenu.firstChild);
    }
    renderServicesMenu(services);
}

const renderFilters = async (services) => {
    let min = services[0].price;
    let max = 0;
    for (let j = 0; j < services.length; j++) {
        //prepare the min and max values for the price selector
        tmp = services[j].price;
        if (tmp < min) {
            min = tmp;
        } else if (tmp > max) {
            max = tmp;
        }
        //get the serviceSelector
        const serviceSelector = document.getElementById('service-selector');
        //insert all the service names in the serviceSelector
        serviceSelector.options[serviceSelector.options.length] = new Option(services[j].name, services[j].name);
    }
    //insert all prices from min to max
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    minPrice.setAttribute("min", min);
    minPrice.setAttribute("max", max);
    minPrice.setAttribute("value", min);

    maxPrice.setAttribute("min", min);
    maxPrice.setAttribute("max", max);
    maxPrice.setAttribute("value", max);

    //setting the initial price range label
    filterOptions.minPrice = min;
    filterOptions.maxPrice = max;

    const priceLabel = document.getElementById("price-label");
    priceLabel.innerHTML = "Price range:(" + min + "-" + max + ")";
}

//get the value of the search bar and pass it to filterOptions
//call applyFilters to verify if each menu block adheres to all filters
function searchServices() {
    let searchBarValue = document.getElementById("search-bar");
    filterOptions.search = searchBarValue.value.toLowerCase();
    applyFilters();
}
//get the value of the select element filters and pass it to its appropriate filterOptions value
//call applyFilters to verify if each menu block adheres to all filters
function filterSearch(typeOfFilter) {
    const filterEl = document.getElementById(typeOfFilter);
    const priceLabel = document.getElementById("price-label");
    const minPriceSlider = document.getElementById("min-price");
    const maxPriceSlider = document.getElementById("max-price");

    //the method receives an id and modifies the value of the filterOptions Object based on it
    switch (typeOfFilter) {
        case "service-selector":
            filterOptions.service = filterEl.options[filterEl.selectedIndex].value.toLowerCase();
            break;
        case "min-price":
            filterOptions.minPrice = filterEl.value;
            priceLabel.innerHTML = "Price range:(" + filterOptions.minPrice + "-" + filterOptions.maxPrice + ")";
            break;
        case "max-price":
            filterOptions.maxPrice = filterEl.value;
            priceLabel.innerHTML = "Price range:(" + filterOptions.minPrice + "-" + filterOptions.maxPrice + ")";
            break;
        default:
    }
    applyFilters();
}

function applyFilters() {

    //go through all menuBlocks by looping through them
    const menuBlocks = document.getElementsByClassName("menuClass");
    for (i = 0; i < menuBlocks.length; i++) {
        const menuElements = menuBlocks[i].getElementsByClassName("menuElementClass");
        //set all initial filter checks to false for each new menu block
        let correctSearch = false;
        let correctService = false;
        let correctPrice = false;
        for (let j = 0; j < menuElements.length; j++) {
            //go through all the filters and compare them with the values of a menu block's company names, service names, price and description
            if (((menuElements[j].value + "").toLowerCase().indexOf(filterOptions.search) !== -1)||(filterOptions.search=="")) {
                correctSearch = true;
            }
            if (((menuElements[j].value + "").toLowerCase().indexOf(filterOptions.service) !== -1) || (filterOptions.service == "none")) {
                correctService = true;
            }
            if (typeof menuElements[j].value == "number") {
                if ((filterOptions.minPrice <= menuElements[j].value && menuElements[j].value <= filterOptions.maxPrice) || (!filterOptions.minPrice)||(!filterOptions.maxPrice)) {
                    correctPrice = true;
                }
            }
        }

        //if all filters are true the menu block may be displayed
        if (correctSearch && correctService && correctPrice) {
            menuBlocks[i].style.display = "";
        } else {
            menuBlocks[i].style.display = "none";
        }
    }
}

function changeNumOfColumns() {
    const columnsInput = document.getElementById("columns-input");
    const servicesMenu = document.getElementById("services-menu");
    servicesMenu.style.gridTemplateColumns = "repeat(" + columnsInput.value + ", 1fr)";
}
//display all elements of the booking overlay through class name
function bookService(id) {
    const dateContainer=document.getElementById("date-container");
    const bookingContentBlock = document.getElementById("booking-content-block");

    cLogin = sessionStorage.getItem("customer-login");
    if (cLogin) {
        const bookingOverlayElems = document.getElementsByClassName("bookingOverlayElems");
        const dateSelector = document.createElement("input");
        dateSelector.setAttribute("id","date-selector");
        dateSelector.setAttribute("type","date");
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

let serviceId;
let serviceDate;
let serviceDateIndex;

//this method would close the all the elements within the booking overlay
function closeBookingOverlay() {
    const dateSelector = document.getElementById("date-selector");
    const dateContainer=document.getElementById("date-container");
    const bookingContentBlock = document.getElementById("booking-content-block");

    serviceId=null;
    serviceDate="";
    serviceDateIndex=null;

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
function selectDate(id,date) {
    const timeSlots = document.getElementById("time-slots");
    timeSlots.style.gridTemplateColumns = "repeat(3, 1fr)";
    //remove old children so as to not rerender them
    while (timeSlots.firstChild) {
        timeSlots.removeChild(timeSlots.firstChild);
    }
    if(formattedResult[id][date]){
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
    }else{
        const timeSlot = document.createElement("button");
        timeSlot.setAttribute("class", "time-slot");
        timeSlot.setAttribute("id", "time-slot");
        timeSlot.setAttribute("value", "deselected");
        timeSlots.style.gridTemplateColumns = "repeat(1, 1fr)";
        timeSlot.innerHTML="No time slots available for this date";
        timeSlots.appendChild(timeSlot);
    }
    
}


//this method sets the rgb(12, 71, 53) color and the selected value to the timeSlot of appropriate id
function selectTime(timeSlotID,id,date,index) {
    serviceId=id;
    serviceDate=date;
    serviceDateIndex=index;
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
async function submitTimeSlot() {
    const requestData = {
        client_id: 0,          
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

        const index=formattedResult[serviceId][serviceDate].indexOf(formattedResult[serviceId][serviceDate][serviceDateIndex]);
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
        updatedTimeSlots=reverseParseSchedule(formattedResult,serviceId);
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
window.addEventListener('mouseup', function (event) {
    const dropdown = document.getElementById("dropdown");
    const dropdownElems = document.getElementsByClassName("dropdown-elems");

    if (event.target != dropdown && event.target.parentNode != dropdown) {
        for (var i = 0; i < dropdownElems.length; i++) {
            dropdownElems[i].style.display = 'none';
        }
    }
});