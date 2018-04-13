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
let dateSent = new Date();

gmail.observe.on("compose", () => {
    const subject = document.getElementsByName('subjectbox')[0]
    subject.addEventListener("change", findSubject);
})

function findSubject(event) {
    subject= event.target.value;
}


