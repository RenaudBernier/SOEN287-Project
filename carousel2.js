//This JS file is executed in the html using defer

//This represents the company database, which is currently does not exist because there is no backend


class Card{
    constructor(number, cvv, expDate) {
    this.number = number;
    this.cvv = cvv;
    this.expDate = expDate;
    }
  }
  
  class Customer{
    constructor(email, password, name, address, cardNb, cvv, pfp, expDate){
      this.email = email;
      this.password = password;
      this.name = name;
      this.address = address;
      this.pfp = pfp;
      this.card = new Card(cardNb, cvv, expDate);
      this.messageArray [message1, message2];
      this.answerArray [undefined, answer2];
    }
  }
  
  let servicess = [
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
  
  let services=[]
  
  
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        services = new Array(0);
        for(let i=0;i<data.length;i++){
          services.push(data[i]);
        }
        console.log("Services Array:", services);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      try{
        const response = await fetch('/api/company');
        const data = await response.json();
        
        for (let i = 0; i < data.length; i++){
          console.log("data", data[i])
          company.push(data[i]); 
        }
        console.log("Services Array:", company);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      };
  
  const tempServices = sessionStorage.getItem("services");
      if(tempServices){
          services = JSON.parse(tempServices);
      }
  
  const initializePage = async () => {
    await fetchServices();
    renderServicesMenu();
  };
  initializePage();
  
  let companyy = {
    name: "TutorMe Tutoring",
    logo: "https://cdn.discordapp.com/attachments/1288191400026050665/1296578898833834065/Screenshot_2024-10-17_at_13.54.51-Photoroom.png?ex=671f52f2&is=671e0172&hm=069bcdab3333ed9bbeb676a990a39743a232d8df79ac38e321c7b9038db1df64&",
    aboutUs: "TutorMe is a leading online tutoring platform dedicated to helping university students excel in a wide range of academic subjects. The company connects students with highly qualified tutors who specialize in fields such as math, science, humanities, and engineering. With a focus on personalized learning, TutorMe offers one-on-one sessions designed to meet the specific needs of each student, whether they require assistance with coursework, exam preparation, or developing a deeper understanding of complex topics."
    ,
    stats: [
      {
        number: "30,000+",
        description: "satisfied students"
      },
      {
        number: "15+",
        description: "different courses offered"
      },
      {
        number: "30",
        description: "of the best tutors in the industry"
      }
    ]
  }
  
  function renderServicesMenu(){
  
  const carousel = document.getElementsByClassName("carousel");
  const bulletContainer = document.getElementsByClassName("bullets")[0];
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const slide = document.createElement("div");
    slide.className = "carousel-item";
  
    const image = document.createElement("img");
    image.src = service.image_url;
  
    slide.appendChild(image);
  
    const content = document.createElement("div");
    content.className = "carousel-content";
  
    slide.appendChild(content);
  
    const name = document.createElement("h1");
    name.textContent = service.name;
  
    const description = document.createElement("p");
    description.textContent = service.description;
  
    content.appendChild(name);
    content.appendChild(description);
  
  
    carousel[0].appendChild(slide);
  
    const bullet = document.createElement('div');
    bullet.className = "bullet";
    bullet.setAttribute("onclick", "bulletClick(" + i + ")");
    bulletContainer.appendChild(bullet);
  }
  }
  
  
  //The services from the companies are appended to their corresponding slides
  const titles = document.getElementsByClassName("offered-service");
  for (let i = 0; i < titles.length; i++) {
    titles[i].innerHTML = services[i].name;
  }
  
  //Gets the carousel-item and bullet elements from the slide.
  //A carousel-item contains a Title, a short description, and a list of services that the company offers.
  const items = document.getElementsByClassName("carousel-item");
  const bullets = document.getElementsByClassName("bullet");
  let itemIndex = 0;
  showItem(0);
  
  //ADD SOMETHING TO GENERATE BULLETS
  
  //Hides a carousel-item and makes its corresponding bullet white
  function showItem(index) {
    items[index].classList.add("visibleSlide");
    bullets[index].classList.add("selectedBullet");
  }
  
  
  //Shows a carousel-item and makes its corresponding bullet dark
  function hideItem(index) {
    items[itemIndex].classList.remove("visibleSlide");
    bullets[itemIndex].classList.remove("selectedBullet");
  }
  
  //Triggered by #prevbtn / the left arrow button
  function prevItem() {
    hideItem(itemIndex);
    if (itemIndex === 0) itemIndex = items.length - 1;
    else itemIndex--;
    showItem(itemIndex);
  }
  //Triggered by #nextbtn / the right arrow button
  function nextItem() {
    hideItem(itemIndex);
    if (itemIndex === items.length - 1) itemIndex = 0;
    else itemIndex++;
    showItem(itemIndex);
  }
  
  function bulletClick(index){
    hideItem(itemIndex);
    itemIndex = index;
    showItem(itemIndex);
  }
  
  
  const aboutUs = document.querySelector(".aboutUs p");
  aboutUs.innerText= company.aboutUs;
  
  const statNumbers = document.querySelectorAll(".stat h1");
  for(let i = 0; i < statNumbers.length; i++){
    statNumbers[i].innerText = company.stats[i].number;
  }
  
  const statDescriptions = document.querySelectorAll(".stat p");
  for(let i = 0; i < statNumbers.length; i++){
    statDescriptions[i].innerText = company.stats[i].description;
  }
  
  