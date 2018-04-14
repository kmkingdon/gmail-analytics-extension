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

let to = '';
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

//add event listeners to new message
gmail.observe.on("compose", () => {
    const subjectBox = document.getElementsByName('subjectbox')[0];
    subjectBox.addEventListener("change", findSubject);

    const messageBox = document.querySelector('.Am');
    messageBox.addEventListener('keypress', addPixel);
})

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
            .then(res => console.log(res));
    })
})

//find the subject title
function findSubject(event) {
    subject= event.target.value;
}

//add the pixel to message
function addPixel() {
    const pixel = document.createElement('img');
    pixel.id = 'tracker'
    pixel.src = `http://www.google-analytics.com/collect?v=1&tid=UA-117489240-1&cid=CLIENT_ID&t=event&ec=email&ea=open&el=${subject}${dateSent}&cs=newsletter&cm=email&cn=Campaign_Name`;

    const message = document.querySelector('.Am');
   
    //prevent multiple pixels being added
    if(!message.innerHTML.includes("www.google-analytics")) {
        message.appendChild(pixel);
    }
}


