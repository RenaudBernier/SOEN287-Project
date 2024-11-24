let services=[]
let serviceBooked=[]
let userData={};
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      for(let i=0;i<data.length;i++){
        services.push(data[i]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchServiceBooked = async () => {
    try {
        const response = await fetch('/api/servicebooked');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            serviceBooked.push(data[i]);
        }
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
    await fetchServiceBooked();
    userData=await fetchUserData();
    let serviceBookedTmp=[];
    for(let i=0;i<serviceBooked.length;i++){
        if(serviceBooked[i].client_id===userData.id){
            serviceBookedTmp.push(serviceBooked[i]);
        }
    }
    displayServiceMessage(services,serviceBookedTmp,userData)
  };
  initializePage();

function displayServiceMessage(services,serviceBooked,userData){
    const messageSelect=document.getElementById("message-select");
    for (let i = 0; i < serviceBooked.length; i++) {
        messageSelect.options[messageSelect.options.length] = new Option("Order #" + serviceBooked[i].order_id, serviceBooked[i].order_id);
    }
}
let responseExits;

function modifyTextbox(){
    responseExits=false;
    const messageSelect=document.getElementById("message-select");
    const customerSupportText=document.getElementById("client-customer-support-text");
    const companyResponse=document.getElementById("company-response");
    const companyResponseTitle=document.getElementById("company-response-title");
    for(let i=0;i<serviceBooked.length;i++){
        if(messageSelect.value===serviceBooked[i].order_id+""){
            customerSupportText.value=serviceBooked[i].message;
            companyResponse.innerHTML=serviceBooked[i].reponse;
            if(serviceBooked[i].reponse){
                responseExits=true;
            }
        }
    }
    if(responseExits){
        companyResponseTitle.innerHTML="Company Message:";
        companyResponse.style.display="block";
        companyResponseTitle.style.display="block";
    }else{
        companyResponseTitle.innerHTML="";
        companyResponse.style.display="none";
        companyResponseTitle.style.display="none";
    }
    
}
async function submitMessage(){
    const messageSelect=document.getElementById("message-select");
    const customerSupportText=document.getElementById("client-customer-support-text");

    if(messageSelect.value){
        try {    
            const response = await fetch('/api/update-message', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                order_id: messageSelect.value,
                message: customerSupportText.value,
              }),
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error updating response:", errorData.error);
              alert(`Error: ${errorData.error}`);
              return;
            }
        
            const data = await response.json();
            console.log("Response updated successfully:", data.message);
          } catch (error) {
            console.error("An error occurred while updating response:", error);
          }
    }else{
        alert("You must choose an order to submit your message");
    }
}