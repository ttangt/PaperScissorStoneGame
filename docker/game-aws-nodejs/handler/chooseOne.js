const AWS = require("aws-sdk");

const PLAYERS_TABLE = process.env.PLAYERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const uuid = require("uuid"); // random id

module.exports.chooseOne = (event, context, callback) => {
    const datetime = new Date().toISOString(); // XXXX-XX-XXTXX:XX:XX:XX.XXXZ
    const datetimeshort = datetime.slice(0, datetime.length - 5) // XXXX-XX-XXTXX:XX:XX
    const data = JSON.parse(event.body); // {"key": "value"} -> '{"key": "value"}'
    const opponent = data.opponent; // paper, scissor, stone
    const result = data.result; // win, lose, draw

    // result table format
    const params = {
        TableName: PLAYERS_TABLE,
        Item: {
            id: uuid.v4(),
            email:data.email,
            player: data.player,
            opponent: opponent,
            result: result,
            updatedAt: datetimeshort
        }
    }

    // data into result table
    dynamoDb.put(params, (error, data) => {
        if (error) {
            console.error(error);
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    })
}