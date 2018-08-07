// https://www.twilio.com/docs/sync/api/maps
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
console.log("++ Retrieve Sync Service:Maps: " + syncServiceSid);
client.sync.services(syncServiceSid).syncMaps
    .each(
        syncMapName => {
        console.log("+ Map name: " + syncMapName.uniqueName);
    });