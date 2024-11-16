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



//Replaces the services array by the one stored in sessionStorage if it exists
{
    const tempServices = sessionStorage.getItem("services");
    if(tempServices)
        services = JSON.parse(tempServices);
}

//Creates 1 form with every field necessary for a service
function createFormItems(index) {
    const header = document.createElement('h3');
    const nameLabel = document.createElement('label');
    const nameInput = document.createElement('input');
    const priceLabel = document.createElement('label');
    const priceInput = document.createElement('input');
    const descriptionLabel = document.createElement('label');
    const descriptionInput = document.createElement('textarea');
    const imageLabel = document.createElement('label');
    const imageInput = document.createElement('input');
    const deleteButton = document.createElement('input');

    nameInput.setAttribute('type', 'text');
    priceInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('type', 'text');
    imageInput.setAttribute('type', 'text');
    deleteButton.setAttribute('type', 'button');
    deleteButton.className = "delete-button";
    deleteButton.setAttribute('onclick', 'removeService(' + index + ')');

    nameInput.id = 'name-' + index;
    priceInput.id = 'price-' + index;
    descriptionInput.id = 'description-' + index;

    header.innerText = "Service " + (index + 1);
    nameLabel.innerText = "Service name";
    priceLabel.innerText = "Price ($)";
    descriptionLabel.innerText = "Description";
    imageLabel.innerText = "Image URL";
    deleteButton.value = "Delete Service";

    nameInput.className = 'service-name';
    priceInput.className = 'price';
    descriptionInput.className = 'description';
    imageInput.className = 'image';
    console.log(priceInput.className);

    nameInput.value = services[index].title;
    priceInput.value = services[index].price;
    descriptionInput.value = services[index].description;
    imageInput.value = services[index].image;

    servicesForm.appendChild(header);
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

//Creates a service form for every object in the services array
for (let i = 0; i < services.length; i++) {
    createFormItems(i);
}

const table = document.getElementById("my-services");
table.appendChild(servicesForm);

//Called when the user clicks the new service button
//Creates a new blank form to create a service
function newService() {
    const service = {
        price: 0,
        description: "",
        title: "",
        image: ""
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
        const names = document.getElementsByClassName('service-name');
        const prices = document.getElementsByClassName('price');
        const descriptions = document.getElementsByClassName('description');
        const images = document.getElementsByClassName('image');
        for (let i = 0; i < services.length; i++) {
            services[i].title = names[i].value;
            services[i].price = prices[i].value;
            services[i].description = descriptions[i].value;
            services[i].image = images[i].value;
        }

        //JSON.stringify() is necessary, as sessionStorage can normally only store strings.
        //Here, we want to store an array
        sessionStorage.setItem("services", JSON.stringify(services));
        alert("Services changed successfully.");
    }
}