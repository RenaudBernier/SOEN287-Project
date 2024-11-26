let company = {
    name: "TutorMe Tutoring",
    logo: "https://cdn.discordapp.com/attachments/1288191400026050665/1296578898833834065/Screenshot_2024-10-17_at_13.54.51-Photoroom.png?ex=671f52f2&is=671e0172&hm=069bcdab3333ed9bbeb676a990a39743a232d8df79ac38e321c7b9038db1df64&",
    aboutUs: "TutorMe is a leading online tutoring platform dedicated to helping university students excel in a wide range of academic subjects. The company connects students with highly qualified tutors who specialize in fields such as math, science, humanities, and engineering. With a focus on personalized learning, TutorMe offers one-on-one sessions designed to meet the specific needs of each student, whether they require assistance with coursework, exam preparation, or developing a deeper understanding of complex topics.",
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



const tempCompany = sessionStorage.getItem("company-profile");
if(tempCompany)
    company = JSON.parse(tempCompany);


const nameInput = document.getElementById("name");
const logoInput = document.getElementById("logoURL");
const aboutUsInput = document.getElementById("about-us");

const numberInputs = document.getElementsByClassName("number");
const descInputs = document.getElementsByClassName("desc");

nameInput.value = company.name;
logoInput.value = company.logo;
aboutUsInput.value = company.aboutUs;

for (let i = 0; i < 3; i++) {
    numberInputs[i].value = company.stats[i].number;
    descInputs[i].value = company.stats[i].description;
}

function storeCompanyProfile(){
    company.name = nameInput.value;
    company.logo = logoInput.value;
    company.aboutUs = aboutUsInput.value;

    for (let i = 0; i < 3; i++) {
        company.stats[i].number = numberInputs[i].value;
        company.stats[i].description = descInputs[i].value;
    }
    sessionStorage.setItem("company-profile", JSON.stringify(company));
    updateCompany(company);
}

async function updateCompany(company) {
    try {
        // Prepare the payload
        const payload = {
            id : 0,
            name: company.name,
            about_us: company.aboutUs,
            logo_url: company.logo,

            

            stat1: company.stats[0].number, 
            stat1_desc : company.stats[0].description,
            stat2: company.stats[1].number,
            stat2_desc : company.stats[1].description,
            stat3: company.stats[2].number,
            stat3_desc : company.stats[2].description,
        };

        // Send the POST request to the backend
        const response = await fetch('/api/company', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            console.log('Success:', result.message);
        } else {
            const error = await response.json();
            console.error('Error:', error.error);
        }
    } catch (err) {
        console.error('Network error:', err.message);
    }
}

