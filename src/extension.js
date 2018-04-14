"use strict";

const jQuery = require("jquery");
const $ = jQuery;
const GmailFactory = require("gmail-js");
const gmail = new GmailFactory.Gmail($);
window.gmail = gmail;

//Built in observe method from the boilerplate- used to check if extension is running 
gmail.observe.on("load", () => {
    const userEmail = gmail.get.user_email();
    console.log("Hello, " + userEmail + ". This is your extension talking!");
});

//Identify the to, subject, and date of the new composed email

let to = [];
let subject = '';

//reformat date without any spaces and in American standard format
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //January is 0!
let yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
let dateSent = mm + '/' + dd + '/' + yyyy;

//add event listeners to subject line and creates "Track Links" button in compose menu
gmail.observe.on("compose", () => {
    const subjectBox = document.getElementsByName('subjectbox')[0];
    subjectBox.addEventListener("change", findSubject);

    let compose_ref = gmail.dom.composes()[0];
    gmail.tools.add_compose_button(compose_ref, 'Track Links', function () {
        proxyLinks();
    }, 'Custom Style Classes');
})

//find the subject title
function findSubject(event) {
    subject = event.target.value;
}

//observe changes in recipient and posts email to database to return email id 
gmail.observe.on("recipient_change", (match, recipients) => {
    let recipientsArray = recipients.to
    let emailArray = recipientsArray.map(email => {
        let emailString = email.substring(email.lastIndexOf("<") + 1, email.lastIndexOf(">"));
        const emailObject = {
            email: emailString
        };

        fetch('http://localhost:3000/emails', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json'}),
            body: JSON.stringify(emailObject),
        })
            .then(res => res.json())
            .then(res => saveRecipients(res));
    })
})

//create an array of unique ids associated with recipient emails
function saveRecipients(res) {
   let recipientId = res.email.id
   if(to.length !== 0) {
        if(to.filter(id => id == recipientId).length === 0){
            to.push(recipientId)
        }
   } else {
       to.push(recipientId)
   }
}


//add pixel before email is sent
gmail.observe.before('send_message', ()=> {
    addPixel();
    clearPixelData();
});

//add the pixel to message
function addPixel() {
    const pixel = document.createElement('img');
    pixel.id = 'tracker'
    pixel.src = `http://www.google-analytics.com/collect?v=1&tid=UA-117489240-1&cid=CLIENT_ID&t=event&ec=email&ea=open&el=${subject}_on_${dateSent}_to_${to}&cs=newsletter&cm=email&cn=Campaign_Name`;

    const message = document.querySelector('.Am');

    //prevent multiple pixels being added
    if(!message.innerHTML.includes("www.google-analytics")) {
        message.appendChild(pixel);
    }
}

//clears pixel data after sending an email
function clearPixelData() {
    to = [];
    subject = '';
}

//proxies links when select "Track Links" button
function proxyLinks(event) {
   
    const message = document.querySelector('.Am');
    let messageString= message.innerHTML;
    
    let newStringHTTPS = messageString.split('href="https://').join('href="https://proxy.playposit.com/ssl/');
    let newStringWWW = newStringHTTPS.split('href="http://www.').join('href="https://proxy.playposit.com/http/');
    let newStringHTTP = newStringWWW.split('href="http://').join('href="https://proxy.playposit.com/ssl/');
    
    message.innerHTML = newStringHTTP;
};




