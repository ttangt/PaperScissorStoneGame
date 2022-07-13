const AWS = require("aws-sdk");

const EMAILS_TABLE = process.env.EMAILS_TABLE;
const PLAYERS_TABLE = process.env.PLAYERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const sendEmail = require("./sendEmail.js")

module.exports.queryResult = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const email = data.email // test@gmail.com
    const inputPassword = data.password // XXXXXX 

    // confirm email from email registration table
    const emailsParams = {
        TableName: EMAILS_TABLE,
        Key: {
            email: email
        },
    }

    dynamoDb.get(emailsParams, (error, data) => {
        if (error) {
            console.error(error);
        }

        const tablePassword = data.Item.password // correct password
        const passAllow = ((inputPassword).toString() == tablePassword) ? true : false
        // No response for wrong password
        if (passAllow == false) {
            return
        }

        const result_array = [] // [['Result', 'Player', 'Oppontent', 'Play At'], [win, 'paper', 'stone', XXXX-XX-XXTXX:XX:XX], ...]

        // query results from result table
        const params = {
            TableName: PLAYERS_TABLE,
            IndexName: 'email-index',
            ExpressionAttributeValues: {
                ':hkey': email
            },
            KeyConditionExpression: "email = :hkey"
        }

        dynamoDb.query(params, (error, data) => {
        if (error) {
            console.error(error);
        }

        for (let i = 0; i < data.Items.length; i++) {
            result_array.push([])
            result_array[i].push(data.Items[i].result)
            result_array[i].push(data.Items[i].player)
            result_array[i].push(data.Items[i].opponent)
            result_array[i].push(data.Items[i].updatedAt)
        }

        
        sendEmail.sendEmail(email, result_array) // send results

        const response = data.Items
        ? {
            statusCode: 200,
            body: JSON.stringify({message: "Successful"})
        } : {
            statusCode: 404,
            body: JSON.stringify({message: "Unsuccessful"})
        }

        callback(null, response)
    })


    })

}
