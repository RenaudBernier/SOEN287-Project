class Company {
    constructor(title, logo, description, services) {
        this.title = title;
        this.logo = logo;
        this.description = description;
        this.services = services;
    }
    get title() {
        return this._title;
    }

    get logo() {
        return this._logo;
    }

    get description() {
        return this._description;
    }

    get services() {
        return this._services;
    }

    set title(title) {
        this._title = title;
    }

    set logo(logo) {
        this._logo = logo;
    }

    set description(description) {
        this._description = description;
    }

    set services(services) {
        this._services = services;
    }
}

class Services {
    constructor(title, price, description, image) {
        this._title = title;
        this._price = price;
        this._description = description;
        this._image = image;
    }
    get title() {
        return this._title;
    }

    get price() {
        return this._price;
    }

    get description() {
        return this._description;
    }

    get image() {
        return this._image;
    }

    set title(title) {
        this._title = title;
    }

    set price(price) {
        this._price = price;
    }

    set description(description) {
        this._description = description;
    }

    set image(image) {
        this._image = image;
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
console.log("services1>>> ", services);

const tempServices = sessionStorage.getItem("services");
if(tempServices){
    services = JSON.parse(tempServices);

    for (let i = 0; i < services.length; i++)
        services[i].price = Number(services[i].price);

    console.log(services);
}
else{
    console.log("Services not found");
}

console.log("services2>>> ", services);
let company = new Company(
    "TutorMe University tutoring",
    "",
    "",
    services
);



//setup the filterOptions
let filterOptions = {
    search: "",
    service: "none",
    minPrice: 0,
    maxPrice: 0
};

function renderServicesMenu(company) {
    for (let j = 0; j < company.services.length; j++) {
        //get the general block of servicesMenu where everything will be displayed
        const servicesMenu = document.getElementById("services-menu");
        //create a singular block from the menu
        const menuElement = document.createElement("div");
        menuElement.setAttribute("class", "menuClass");
        menuElement.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${company.services[j].image}') center/cover no-repeat`;
        //create all the elements that will be stored in the menuElement
        const menuPrice = document.createElement("p");
        const menuDescription = document.createElement("p");
        const menuTitle = document.createElement("p");
        const bookButton = document.createElement("button");
        //give all the children a class
        menuPrice.setAttribute("class", "menuElementClass");
        menuDescription.setAttribute("class", "menuElementClass");
        menuTitle.setAttribute("class", "menuElementClass");
        bookButton.setAttribute("onclick", "bookService()");
        //give the children their respective innerHTML, values and append them
        menuTitle.innerHTML = company.services[j].title;
        menuTitle.value = company.services[j].title;
        menuElement.appendChild(menuTitle);

        menuPrice.innerHTML = "Price: " + company.services[j].price + "$";
        menuPrice.value = company.services[j].price;
        menuElement.appendChild(menuPrice);

        menuDescription.innerHTML = "Description: " + company.services[j].description;
        menuDescription.value = company.services[j].description;
        menuElement.appendChild(menuDescription);

        bookButton.innerHTML = "Book";
        bookButton.setAttribute("class", "book-button");
        menuElement.appendChild(bookButton);
        //append the menu block to the full menu
        servicesMenu.appendChild(menuElement);
    }
    applyFilters();
}


renderServicesMenu(company);
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
    let sortedCompanyServices = new Company(
        "TutorMe University tutoring",
        "",
        "",
        company.services.sort(function (a, b) {
            if (a.title < b.title) {
                return -1*index;
            }
            if (a.title > b.title) {
                return 1*index;
            }
            return 0;
        })
    );

    const servicesMenu = document.getElementById("services-menu");
    while (servicesMenu.firstChild) {
        servicesMenu.removeChild(servicesMenu.firstChild);
    }
    renderServicesMenu(sortedCompanyServices);
}
function renderFilters() {
    let min = company.services[0].price;
    let max = 0;
    for (let j = 0; j < company.services.length; j++) {
        //prepare the min and max values for the price selector
        tmp = company.services[j].price;
        if (tmp < min) {
            min = tmp;
        } else if (tmp > max) {
            max = tmp;
        }
        //get the serviceSelector
        const serviceSelector = document.getElementById('service-selector');
        //insert all the service names in the serviceSelector
        serviceSelector.options[serviceSelector.options.length] = new Option(company.services[j].title, company.services[j].title);
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
renderFilters();


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
            // console.log("maxPriceSlider>>>", maxPriceSlider.value);
            // console.log("filterEl>>>", filterEl.value);

            // if(filterEl.value>=maxPriceSlider.value){
            //     filterEl.value=maxPriceSlider.value-1;
            // }
            filterOptions.minPrice = filterEl.value;
            priceLabel.innerHTML = "Price range:(" + filterOptions.minPrice + "-" + filterOptions.maxPrice + ")";
            break;
        case "max-price":
            // console.log("minPriceSlider>>>", minPriceSlider.value);
            // console.log("filterEl>>>", filterEl.value);

            // if(filterEl.value<=minPriceSlider.value){
            //     filterEl.value=minPriceSlider.value+1;
            // }
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
function bookService() {

    cLogin = sessionStorage.getItem("customer-login");
    if (cLogin) {
        const bookingOverlayElems = document.getElementsByClassName("bookingOverlayElems");
        for (var i = 0; i < bookingOverlayElems.length; i++) {
            bookingOverlayElems[i].style.display = 'block';
        }
    }
    else
        alert("You must be logged in to book a service");

}
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
        // console.log("greyed out");
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