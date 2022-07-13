const AWS = require("aws-sdk");

const EMAILS_TABLE = process.env.EMAILS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const sgMail = require("@sendgrid/mail") // sendgrid email server

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmail(receiver, array) {
    let html = "<table><tr><td>Result</td><td>Player</td><td>Oppontent</td><td>Play At</td></tr>" // email content

    for (let i = 0; i < array.length; i++) {
        html += "<tr>"
        for (let j = 0; j < 4; j++) {
            html += "<td>"
            html += array[i][j]
            html += "</td>"
        }
        html += "</tr>"
    }

    html += "</table>"

    const msg = {
        to: receiver,
        from: "supertim0215@gmail.com",
        subject: "Game Result",
        html: html
    }

    sgMail
        .send(msg)
        .catch((error) => {
            console.error(error);
        })
}

module.exports.sendPassword = (event, context, callback) => {
    const data = JSON.parse(event.body)
    const email = data.email
    const randomDigit = Math.floor(100000 + Math.random() * 900000); // XXXXXX

    const params = {
        TableName: EMAILS_TABLE,
        Item: {
            email:data.email,
            password:randomDigit

        }
    }

    dynamoDb.put(params, (error, data) => {
        if (error) {
            console.error(error);
            return;
        }

        const msg = {
            to: email,
            from: "supertim0215@gmail.com",
            subject: "Paper Scissor Stone Game Password",
            html: "Your password is <h1>" + randomDigit + "</h1>" // Your password is XXXXXX
        }
    
        sgMail
            .send(msg)
            .catch((error) => {
                console.error(error);
            })

        // const msg = {
        //     to: 'timsingsing@gmail.com', // Change to your recipient
        //     from: 'supertim0215@gmail.com', // Change to your verified sender
        //     subject: 'Sending with SendGrid is Fun',
        //     text: 'and easy to do anywhere, even with Node.js',
        //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // }
          
        // sgMail
        //     .send(msg)
        //     .catch((error) => {
        //         console.error(error);
        //     })

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    })
}

module.exports.sendEmail = sendEmail;