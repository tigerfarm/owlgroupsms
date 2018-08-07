// https://www.twilio.com/docs/sync/api/maps
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = process.env.SYNC_MAP_NAME;
//
console.log("++ Retrieve Sync Service:Map: " + syncServiceSid + ":" + syncMapName);
//
client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems.each(
        syncMapItems => {
        console.log("+ Key: " + syncMapItems.key 
            + ", name: " + syncMapItems.data.name
            + ", authorized: " + syncMapItems.data.authorized
        );
    });
