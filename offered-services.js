let services = [
    {
        id: 1,
        price: 35,
        description: "Courses offered for Calculus I and II level problems. Flexible hours and you may cancel anytime.",
        name: "Math tutoring",
        image_url: "https://i0.wp.com/drsinghtutor.com/wp-content/uploads/2021/01/three-students-working-flatlay.webp?fit=920%2C614&ssl=1"
    },
    {
        id: 2,
        price: 50,
        description: "Having trouble with your physics assignements? Our top professionals are here to help you better understand any material that may trouble you.",
        name: "Physics",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Tutoring_Physics.jpg/1280px-Tutoring_Physics.jpg"
    }
    ,
    {
        id: 3,
        price: 20,
        description: "Want to sharpen your English skils? Come try out our tutoring services for writting and reading comprehension.",
        name: "English",
        image: "https://media.istockphoto.com/id/1383488079/photo/book-fair.jpg?s=612x612&w=0&k=20&c=9JKhUjlYzYOj6Qz0OdEWcZAn_MoepltCHZRmROzEf9o="
    }
    ,
    {
        id: 4,
        price: 200,
        description: "Learn coding with the newest provided technologies available. We offer courses in Python, JavaScript, C++, and many more!",
        name: "Programming",
        image: "https://burst.shopifycdn.com/photos/coding-on-laptop.jpg?width=1000&format=pjpg&exif=0&iptc=0"
    }
]


async function fetchServices() {
    let services = 0;
    try {
        const res = await fetch('/api/services');
        services = await res.json();
        console.log(services);
    }
    catch (error){
        console.log("ERROR")
        return undefined;
    }
    return services;
}


// Creates 1 form with every field necessary for a service
function createFormItems(index) {
    const header = document.createElement('h3');
    const idLabel = document.createElement('label');
    const idInput = document.createElement('input');
    const nameLabel = document.createElement('label');
    const nameInput = document.createElement('input');
    const priceLabel = document.createElement('label');
    const priceInput = document.createElement('input');
    const descriptionLabel = document.createElement('label');
    const descriptionInput = document.createElement('textarea');
    const imageLabel = document.createElement('label');
    const imageInput = document.createElement('input');
    const deleteButton = document.createElement('input');

    idInput.setAttribute('type', 'number');
    nameInput.setAttribute('type', 'text');
    priceInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('type', 'text');
    imageInput.setAttribute('type', 'text');
    deleteButton.setAttribute('type', 'button');
    deleteButton.className = "delete-button";
    deleteButton.setAttribute('onclick', 'removeService(' + index + ')');

    idInput.id = 'id-' + index;
    nameInput.id = 'name-' + index;
    priceInput.id = 'price-' + index;
    descriptionInput.id = 'description-' + index;

    header.innerText = "Service";
    idLabel.innerText = "ID";
    nameLabel.innerText = "Service name";
    priceLabel.innerText = "Price ($)";
    descriptionLabel.innerText = "Description";
    imageLabel.innerText = "Image URL";
    deleteButton.value = "Delete Service";

    idInput.className = 'service-id';
    nameInput.className = 'service-name';
    priceInput.className = 'price';
    descriptionInput.className = 'description';
    imageInput.className = 'image';
    console.log(priceInput.className);

    idInput.value = services[index].id;
    nameInput.value = services[index].name;
    priceInput.value = services[index].price;
    descriptionInput.value = services[index].description;
    imageInput.value = services[index].image_url;

    idInput.style.width = "30px";

    servicesForm.appendChild(header);
    servicesForm.appendChild(idLabel);
    servicesForm.appendChild(idInput);
    servicesForm.appendChild(nameLabel);
    servicesForm.appendChild(nameInput);
    servicesForm.appendChild(priceLabel);
    servicesForm.appendChild(priceInput);
    servicesForm.appendChild(descriptionLabel);
    servicesForm.appendChild(descriptionInput);
    servicesForm.appendChild(imageLabel);
    servicesForm.appendChild(imageInput);
    servicesForm.appendChild(deleteButton);
    console.log(descriptionInput.value);
}

const servicesForm = document.getElementById("services-form");


async function generatePage() {
//Creates a service form for every object in the services array
    services = await fetchServices();
    for (let i = 0; i < services.length; i++) {
        createFormItems(i);
    }

    const table = document.getElementById("my-services");
    table.appendChild(servicesForm);
}
generatePage();

//Called when the user clicks the new service button
//Creates a new blank form to create a service
function newService() {
    const service = {
        price: 0,
        description: "",
        name: "",
        image_url: ""
    }
    services.push(service);

    createFormItems(services.length-1);
}

//Removes service from the array and the offered-services page
function removeService(index) {
    if (confirm("Are you sure you want to remove this service? Unsaved changes made to " +
        "other services will be lost.")) {
        services.splice(index, 1);
        servicesForm.innerHTML = "";
        for (let i = 0; i < services.length; i++) {
            createFormItems(i);
        }
    }
}

//Updates the services array by using the forms, then stores this array with sessionStorage.
function storeServices() {
    if (confirm("Are you sure you want to save?")) {
        const id = document.getElementsByClassName('service-id');
        const names = document.getElementsByClassName('service-name');
        const prices = document.getElementsByClassName('price');
        const descriptions = document.getElementsByClassName('description');
        const images = document.getElementsByClassName('image');
        for (let i = 0; i < services.length; i++) {
            services[i].id = Number(id[i].value);
            services[i].name = names[i].value;
            services[i].price = Number(prices[i].value);
            services[i].description = descriptions[i].value;
            services[i].image_url = images[i].value;
            services[i].model_time_slots = 'MM-DD-YYYY:hh:mm AM/PM';
        }

        //Uses a hashset to find if an ID is repeated in the inputs
        function repeatedID(services) {
            const seenNumbers = new Set();
            for (const service of services) {
                if (seenNumbers.has(service.id)){
                    return true;
                }
                seenNumbers.add(service.id);
            }
            return false;
        }

        //If no ID is repeated, services are uploaded to the DB
        if (!repeatedID(services)) {
            //Sends a post request using the array
            fetch('/api/change-services', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(services)
            })
            alert("Services changed successfully.");
        }

        else
            alert("Error: every service should have a unique ID")
    }


}