// https://www.twilio.com/docs/sync/api/maps#create-a-map
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = process.env.SYNC_MAP_NAME;
const syncMapItem = '+12223331234';
console.log("++ Create Sync Service:Map:Item: " + syncServiceSid + ":" + syncMapName + ":" + syncMapItem);
let theData = {'name': 'myname', 'authorized': 'new'};
client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems
    .create({key: syncMapItem, data: theData})
    .then((sync_map_item) => {
        console.log("+ Created.");
    }).catch(function (error) {
        console.log("- " + error);
        // callback("- " + error);
    });
