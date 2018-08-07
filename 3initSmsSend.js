const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncServiceMap = process.env.SYNC_MAP_NAME;
function listMaps() {
    console.log("++ Retrieve Sync Service:Maps: " + syncServiceSid);
    const group_client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
    group_client.sync.services(syncServiceSid).syncMaps.each(
        syncMapName => {
            console.log("+ Map name: " + syncMapName.uniqueName);
        });
}
// -----------------------------------------------------------------------------
console.log("++ Send Group SMS initialization message to: " + syncServiceMap);
const client = require('twilio')(process.env.SEND_ACCOUNT_SID, process.env.SEND_AUTH_TOKEN);
client.messages.create({
    from: process.env.PHONE_NUMBER_2,
    to: syncServiceMap,
    body: "!init Harry"
}, function (err, message) {
    if (err) {
        console.error("- Error: ", err.message);
        console.log("--- Exit.");
        exit();
    }
    console.log("+ Sent.");
    // ------------------------------------------
    console.log("+ Wait for 3 seconds, then list the maps.");
    setTimeout(function () {
        listMaps();
    }, 3000);
});
