const senderPhoneNumber = process.env.PHONE_NUMBER_3;
const syncServiceMap = process.env.SYNC_MAP_NAME;
function list() {
    // Docs: https://www.twilio.com/docs/sms/api/message
    console.log("++ List received messages.");
    // , to: senderPhoneNumber
    client.messages.each({from: syncServiceMap},
                    messages => console.log("+ " + messages.dateSent + " " + messages.to + " |" + messages.body + "|")
                );
}
// -----------------------------------------------------------------------------
theMessage = "! subscribe David ";
console.log("++ Send From: " + senderPhoneNumber + " to: " + syncServiceMap + " |" + theMessage + "|");
const client = require('twilio')(process.env.SEND_ACCOUNT_SID, process.env.SEND_AUTH_TOKEN);
client.messages.create({
    from: senderPhoneNumber,
    to: syncServiceMap,
    body: theMessage
}, function (err, message) {
    if (err) {
        console.error("- Error: ", err.message);
        console.log("--- Exit.");
        exit();
    }
    console.log("+ Sent.");
    // ------------------------------------------
    console.log("+ Wait for 3 seconds, then get the reply.");
    setTimeout(function () {
        list();
    }, 3000);
});
