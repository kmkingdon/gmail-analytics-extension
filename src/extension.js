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

//Identify the subject of the new composed email
gmail.observe.on("compose", () => {
    const subject = document.getElementsByName('subjectbox')[0].onchange=findSubject;
})

function findSubject(event) {
    console.log('changing')
    console.log(event.target.value)
}


