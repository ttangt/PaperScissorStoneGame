const sgMail = require('@sendgrid/mail')

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// SENDGRID_API_KEY="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"
// sgMail.setApiKey(SENDGRID_API_KEY)

const msg = {
  to: 'timsingsing@gmail.com', // Change to your recipient
  from: 'supertim0215@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })