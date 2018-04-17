# Gmail Analytics Chrome Extension
Welcome to the Gmail Analytics chrome extension. 

## Features
### Build a chrome extension
    * Basic Chrome Extension that can be uploaded manually in the developer mode of chrome extensions.

### Extension adds a pixel to all emails sent from Gmail web client to track opening
    * Adds a pixel tracker that includes your google analytics id, the subject of the email, the date sent, and the ids of the recipient emails
    * Recipient emails stored in a heroku database due to to google analytics terms of service 

### Extension creates and pushes an event to Google Analytics including which email was opened and to whom the email was sent
    * Upon opening of the email, the pixel tracker sends an event to google analytics including the subject, date sent, and the recipient email ids

### Extension parses hyperlinks within an email to a proxy link
    * Users can choose to parse links with a proxy link using the "Track Links" button that is added to the compose menu.

## Installation

### Setup Chrome Extension
After forking and cloning this repo:
```
cd gmail-analytics-extension
npm install
npm run build
```

Go to [Chrome Extensions Dashboard](chrome://extensions/)
Turn on Developer Mode
Click Load Unpacked and select the gmail-analytics-extension directory

* If you get errors, you may need to remove the key files from the node_module/public-encrypt directory

### Setup Google Analytics
* Go to [Google Analytics](https://www.google.com/analytics/#?modal_active=none)
* Sign in to Google Account
* Click the Admin button in the lower left screen 
* Create a new Property by entering a name and generic url
* Click Get Tracking Id
* Take Tacking Id (UA-XXXXXXXXX-X) and replace the tracking id on line 8  of the extension.js
* Run the build function to update /dist directory
```
npm run build
```

## Library Integration
This chrome extension relies on the gmail.js library and the was built with the basic boilerplate model. 
* [Gmail.js](https://github.com/KartikTalwar/gmail.js/tree/master)
* [Node.js Boilerplate](https://github.com/josteink/gmailjs-node-boilerplate)


## Dashboard Integration
This chrome extension also has a Demo Dashboard that creates a easy to understand user interface that tracks sent emails and the google analytics data of how many people have opened the email. 

### Vue Dashboard 
* [Github](https://github.com/kmkingdon/gmail-analytics-extension-dashboard)
* [Deployed Link](https://analytics-dashboard-62e6d.firebaseapp.com/)

![dashboard](https://user-images.githubusercontent.com/32685092/38891539-ea8f113e-4241-11e8-88f4-03b41c80cde2.gif)

### Database Integration
The database tracks recipient emails due to Google Analytic's policy of not allowing personally identifying information being sent back in events. 

[Github](https://github.com/kmkingdon/gmail-analytics-extension-db)

The database can also track sent email information. To include this feature, add the following function to the src/extension.js file. 

First, add the function call in the send_message event listener.
```
//add pixel and send email data to server before email is sent
gmail.observe.before('send_message', ()=> {
    addPixel();
    postEmailData(); 
});
```

Second, add the function. 
```
//sends a copy of analytics data to server
function postEmailData() {

    const sentEmailObject = {
        'emailSent': dateSent,
        'subject': subject,
        'recipients': { "recipients": to },
        'eventLabel': `${subject}_on_${dateSent}_to_${to}`
    }

    fetch('https://gmail-db.herokuapp.com/sent', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(sentEmailObject),
    })
        .then(res => res.json())
        .then(clearPixelData());
}
```
Finally, run the build function to update /dist directory
```
npm run build
```

* Note- this is just a demo feature and does not include full authorization/security


## License
MIT License Copyright (c) 2018 Kevin Kingdon

## Author contact

|<img src="https://user-images.githubusercontent.com/32685092/35702971-d0b4e966-0757-11e8-8098-c2819dff5e58.png" width="100"> | Kevin Kingdon                    |
| ------------- | ------------- |
| Website  | [kmkingdon.info](https://kmkingdon.info) |
| LinkedIn   | [/in/kevin-kingdon/](https://www.linkedin.com/in/kevin-kingdon/) |


