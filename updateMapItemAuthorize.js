// https://www.twilio.com/docs/sync/api/maps
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMapName = process.env.SYNC_MAP_NAME;
const syncMapItem = process.env.PHONE_NUMBER_4;
const authorized = 'new';
console.log("++ Update Sync Service:Map:Item: " + syncServiceSid + ":" + syncMapName + ":" + syncMapItem);

client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems(syncMapItem)
    .fetch()
    .then((syncMapItems) => {
        console.log("+ name: " + syncMapItems.data.name + ", authorized: " + syncMapItems.data.authorized);
        let theData = {'name': syncMapItems.data.name, 'authorized': authorized};
        client.sync.services(syncServiceSid).syncMaps(syncMapName).syncMapItems(syncMapItem)
            .update({key: syncMapItem, data: theData})
            .then((sync_map_item) => {
                console.log("+ Updated authorized, to:" + authorized);
            }).catch(function (error) {
            console.log("- " + error);
            // callback("- " + error);
        });
    }).catch(function (error) {
    console.log("- " + error);
    // callback("- " + error);
});