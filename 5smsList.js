// Docs: https://www.twilio.com/docs/sms/api/message
const senderPhoneNumber = process.env.PHONE_NUMBER_2;
const syncServiceMap = process.env.SYNC_MAP_NAME;
const client = require('twilio')(process.env.SEND_ACCOUNT_SID, process.env.SEND_AUTH_TOKEN);
console.log("++ List received messages from: " + syncServiceMap);
// , to: senderPhoneNumber
client.messages.each({from: syncServiceMap},
        messages => console.log("+ " + messages.dateSent + " " + messages.to + " " + messages.body)
);