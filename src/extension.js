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

//Identify the subject and date of the new composed email

let subject = '';
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


gmail.observe.on("compose", () => {
    const subject = document.getElementsByName('subjectbox')[0]
    subject.addEventListener("change", findSubject);
})

function findSubject(event) {
    subject= event.target.value;
    const pixel = document.createElement('img');
    pixel.src = `http://www.google-analytics.com/collect?v=1&tid=UA-117489240-1&cid=CLIENT_ID_NUMBER&t=event&ec=email&ea=open&el=${subject}${dateSent}&cs=newsletter&cm=email&cn=Campaign_Name`;
    console.log(pixel)
}


