// https://www.twilio.com/docs/sync/api/maps
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = process.env.SYNC_MAP_NAME;
//
console.log("++ Retrieve Sync Service:Map: " + syncServiceSid + ":" + syncMapName);
//
let returnMessage = '';
client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems.list()
    .then(
        syncMapItems => {
            // console.log("++ Load syncMapItems.");
            syncMapItems.forEach((syncMapItem) => {
                console.log("+ Key: " + syncMapItem.key 
                + ", name: " + syncMapItem.data.name
                + ", authorized: " + syncMapItem.data.authorized
            );
            if (returnMessage === '') {
                returnMessage = syncMapItem.data.name;
            } else {
                returnMessage += ", " + syncMapItem.data.name;
            }
        });
        if (returnMessage === '') {
            console.log('+ None.');
        } else {
            console.log('+ List of names: ' + returnMessage);
        }
        
    });

