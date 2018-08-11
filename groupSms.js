// -----------------------------------------------------------------------------
// Updates to do:
// New authorized subscriber needs to receive an authorized notice.
//
'use strict';
console.log("+ Group SMS");
const syncServiceSid = process.env.SYNC_SERVICE_SID;
console.log("+ SYNC_SERVICE_SID   :" + syncServiceSid + ":");
const notifyServiceSid = process.env.NOTIFY_SERVICE_SID;
console.log("+ NOTIFY_SERVICE_SID :" + notifyServiceSid + ":");
const authorizedDefault = process.env.AUTHORIZED_DEFAULT || "self";   // default to "self" which does not require authorization.
// const authorizedDefault = "new";   // default to "new" which requires authorization.
console.log("+ AUTHORIZED_DEFAULT :" + authorizedDefault + ":");
//
const initSuccessMessage = '+ Group phone number initialized and you are subscribed as the admin.';
const initFailMessageNameRequired = '- Init name required: "!init name".';
const initFailMessage = '- Group phone number already initialized.';
const helpMessage = 'Help: Text "!subscribe name" to join. "!authorize +PhoneNumber" to accept a new subscriber. "!unsubscribe" to leave the group. "!who" to receive a group list.';
const subscribeSuccessMessage = "+ You are subscribed to this Group's SMS messages.";
const subscribeFailMessage = '- Subscription process failed, try again.';
const subscribeFailMessageNameRequired = '- Subscription name required: "!subscribe name".';
const authorizeSuccessMessage = '+ You have authorized: ';
const authorizeFailMessage = '- Failed to authorize.';
const authorizeFailMessageNotAuthorized = '- You are not authorized to authorize.';
const authorizeFailMessageAlreadyAuthorized = '- Already authorized.';
const authorizeFailMessageNumberRequired = '- Authorize phone number required: "!authorize phone-number".';
const UnsubscribeMessage = '+ You have been unsubscribed from this group phone number.';
const UnsubscribeFailMessage = '- Failed to unsubscribe.';
const whoMessage = "+ Members: ";
const whoSuccessMessage = '';
const whoFailMessage = '- You must be a member of the group to make this request.';
const whoFailMessageNotAuthorized = '- You are not authorized.';
const broadcastSuccessMessage = '+ Your message was broadcast to the group.';
const broadcastFailMessage = '- Your message failed to send, try again.';
const broadcastFailMessageNotAuthorized = '- You are not authorized to broadcast messages.';
const broadcastNotAuthorizedMessage = '- You are not part of the group.';
// -----------------------------------------------------------------------------
class Command {
    // Create an instance with arguments from the incoming SMS
    constructor(event) {
        this.toNumber = event.To.trim();
        this.fromNumber = event.From.trim();
        this.body = event.Body.trim() || '';
        this.event = event;
        if (this.fromNumber.indexOf('+') !== 0) {
            // If missing "+country code", fix it
            this.fromNumber = `+${this.fromNumber}`;
        }
        if (this.toNumber.indexOf('+') !== 0) {
            // If missing "+country code", fix it
            this.toNumber = `+${this.toNumber}`;
        }
        // console.log("+ this.fromNumber: " + this.fromNumber);
        let smsTextArray = this.body.split(' ');
        this.word1 = this.body.trim().split(' ')[0].toLowerCase();
        this.word2 = '';
        if (this.word1 === "!") {
            this.word1 = "!" + smsTextArray[1].trim();
            if (smsTextArray.length === 3) {
                this.word2 = smsTextArray[2].trim();
            }
        } else {
            if (smsTextArray.length === 2) {
                this.word2 = smsTextArray[1].trim();
            }
        }
    }
    // Get an array of arguments after the first word for a command
    get commandArguments() {
        return this.body.trim().split(' ').slice(1);
    }
    // Get the full text after the command with spaces reinserted
    get commandText() {
        return this.commandArguments.join(' ');
    }
    // Execute command async (to be overridden by subclasses)
    run(callback) {
        callback(null, 'Command not implemented.');
    }
}

class HelpCommand extends Command {
    run(callback) {
        // console.log("++ callback: " + helpMessage);
        callback(null, helpMessage);
                    
        // ----------------
        // let whoInstance = new WhoCommand({Body: "who", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1});
        // whoInstance.run((err, message) => {
        //    let twiml2 = new Twilio.twiml.MessagingResponse();
        //    if (err) {
        //        message = 'There was a problem with your request.';
        //    }
        //    twiml2.message(message);
        //    callback(null, twiml2);
        // });
        // ----------------
    }
}

class InitCommand extends Command {
    run(callback) {
        if (this.word2 === "") {
            callback(null, initFailMessageNameRequired);
            return;
        }
        // The Twilio to-phone-number, the group phone number. This is the Sync Map name.
        sync.syncMaps.create({ttl: 0, uniqueName: this.toNumber})
        .then((sync_map) => {
            console.log("+ Initialized, created group SMS phone number Map: " + sync_map.uniqueName);
            //
            // Create the Admin's Sync enter using their phone number as the key and broadcast a message to let them know.
            let theData = {'name': this.word2, 'authorized': 'admin'};
            sync.syncMaps(this.toNumber).syncMapItems
                .create({key: this.fromNumber, data: theData})
                .then((sync_map_item) => {
                    console.log("+ Group initialized and you are subscribed: " + this.word2 + " " + this.fromNumber);
                    callback(null, initSuccessMessage);
                }).catch(function (error) {
                callback(error, subscribeFailMessage);
            });
        })
        .catch(function (error) {
            callback(error, initFailMessage);
        });
    }
}

class AuthorizeCommand extends Command {
    run(callback) {
        if (this.word2 === "") {
            callback(null, authorizeFailMessageNumberRequired);
            return;
        }
        sync.syncMaps(this.toNumber).syncMapItems(this.fromNumber).fetch()
        .then((syncMapItems) => {
            let senderName = syncMapItems.data.name;
            let authorized = syncMapItems.data.authorized;
            console.log("+ Sender name: " + senderName + ", authorized: " + authorized);
            if (authorized === 'new') {
                callback(null, authorizeFailMessageNotAuthorized);
                return;
            }
            sync.syncMaps(this.toNumber).syncMapItems(this.word2).fetch()
            .then((syncMapItems) => {
                let personName = syncMapItems.data.name;
                let authorized = syncMapItems.data.authorized;
                console.log("+ name: " + personName + ", authorized: " + syncMapItems.data.authorized);
                if (authorized !== 'new') {
                    callback(null, authorizeFailMessageAlreadyAuthorized);
                    return;
                }
                let theData = {'name': personName, 'authorized': this.fromNumber};
                sync.syncMaps(this.toNumber).syncMapItems(this.word2)
                    .update({key: this.word2, data: theData})
                    .then((sync_map_item) => {
                        console.log("+ Updated authorized, to: " + this.fromNumber);
                        callback(null, authorizeSuccessMessage + personName);
                    }).catch(function (error) {
                        callback(error, authorizeFailMessage);
                    });
            }).catch(function (error) {
                console.log("- AuthorizeCommand, retrieve parameter:  " + error);
                callback(error, authorizeFailMessage);
            });
        }).catch(function (error) {
            console.log("- AuthorizeCommand, retrieve from-phone-number:  " + error);
                callback(error, authorizeFailMessage);
        });
    } // run(callback)
}

class SubscribeCommand extends Command {
    // Add the person into the DB.
    // Broadcast that they have joined.
    // Need error checking for this.word2, that it is valid.
    run(callback) {
        if (this.word2 === "") {
            callback(null, subscribeFailMessageNameRequired);
            return;
        }
        let theData = {'name': this.word2, 'authorized': authorizedDefault};
        sync.syncMaps(this.toNumber).syncMapItems
        .create({key: this.fromNumber, data: theData})
        .then((sync_map_item) => {
            console.log("+ Subscribed, name: " + this.word2 + " " + this.fromNumber);
            // ---------------------------------------------------------------------
            // Broadcast notice of new subscriber.
            let counter = 0;
            let sendList = [];
            let sendNameList = [];
            sync.syncMaps(this.toNumber).syncMapItems.list()
            .then(syncMapItems => {
                syncMapItems.forEach((syncMapItem) => {
                    // console.log("+ Key: " + syncMapItem.key + ", authorized: " + syncMapItem.data.authorized);
                    if (this.fromNumber !== syncMapItem.key && syncMapItem.data.authorized !== "new") {
                        // Don't send to the sender, nor to unauthorized numbers ("new").
                        sendList[counter] = JSON.stringify({"binding_type": "sms", "address": syncMapItem.key});
                        sendNameList[counter] = syncMapItem.data.name;
                        counter += 1;
                    }
                });
                if (counter === 0) {
                    console.log("+ New subscription notice not sent because there is no one yet to receive the notice.");
                    return;
                }
                let theMessage = "Application notice, new ";
                if (authorizedDefault === "new") {
                    theMessage += "unauthorized ";
                }
                theMessage += "group subscriber: " + this.word2;
                console.log("+ The message |" + theMessage + "| " + " Sent to: " + sendNameList);
                notify.notifications.create({body: theMessage, toBinding: sendList})
                .then((response) => {
                    console.log("+ Notify response.sid: " + response.sid);
                    // callback(null, subscribeSuccessMessage + ' Notice of your new subscription was sent to the group.');
                }).catch(err => {
                    // console.log(err);
                    callback(err, broadcastFailMessage);
                });
            });
            // ---------------------------------------------------------------------
            callback(null, subscribeSuccessMessage);
        }).catch(function (error) {
            callback(error, subscribeFailMessage);
        });
    }
}

class UnsubscribeCommand extends Command {
    // Remove the person into the DB.
    run(callback) {
        sync.syncMaps(this.toNumber).syncMapItems(this.fromNumber)
        .remove()
        .then((sync_map) => {
            console.log("+ Deleted.");
            callback(null, UnsubscribeMessage);
        }).catch(function (error) {
            console.log("- " + error);
            callback(error, UnsubscribeFailMessage);
        }); 
    }
}

class WhoCommand extends Command {
    run(callback) {
        let returnMessage = '';
        // Check that the requester is in the group.
        // Need a proper error message returned to the requester.
        sync.syncMaps(this.toNumber).syncMapItems(this.fromNumber).fetch()
        .then((syncMapItems) => {
            let senderName = syncMapItems.data.name;
            let authorized = syncMapItems.data.authorized;
            console.log("+ Sender name: " + senderName + ", authorized: " + authorized);
            if (authorized === 'new') {
                callback(null, whoFailMessageNotAuthorized);
                return;
            }
            sync.syncMaps(this.toNumber).syncMapItems.list()
            .then(
                syncMapItems => {
                    syncMapItems.forEach((syncMapItem) => {
                        authorized = syncMapItem.data.authorized;
                        // console.log("+ Key: " + syncMapItem.key + ", authorized: " + authorized);
                        if (returnMessage === '') {
                            returnMessage = syncMapItem.data.name;
                        } else {
                            returnMessage += ", " + syncMapItem.data.name;
                        }
                        if (authorized === 'new') {
                            returnMessage += '(new)';
                        }
                    });
                    callback(null, whoMessage + returnMessage);
                });
            }).catch(function (error) {
                callback(error, whoFailMessage);
            });
    }
}

class BroadcastTheMessage extends Command {
    run(callback) {
        sync.syncMaps(this.toNumber).syncMapItems(this.fromNumber).fetch()
        .then((syncMapItems) => {
            // Check that the requester is in the group and that they are not "new".
            let senderName = syncMapItems.data.name;
            let authorized = syncMapItems.data.authorized;
            console.log("+ Sender name: " + senderName + ", authorized: " + authorized);
            if (authorized === 'new') {
                callback(null, broadcastFailMessageNotAuthorized);
                return;
            }
            // ---------------------------------------------------------------------
            // Broadcast message.
            let counter = 0;
            let sendList = [];
            let sendNameList = [];
            sync.syncMaps(this.toNumber).syncMapItems.list()
            .then(syncMapItems => {
                syncMapItems.forEach((syncMapItem) => {
                    // console.log("+ Key: " + syncMapItem.key + ", authorized: " + syncMapItem.data.authorized);
                    if (this.fromNumber !== syncMapItem.key && syncMapItem.data.authorized !== "new") {
                        // Don't send to the sender, nor to unauthorized numbers ("new").
                        sendList[counter] = JSON.stringify({"binding_type": "sms", "address": syncMapItem.key});
                        sendNameList[counter] = syncMapItem.data.name;
                        counter += 1;
                    }
                });
                if (counter === 0) {
                    console.log("+ New subscription notice not sent because there is no one yet to receive the notice.");
                    return;
                }
                let theMessage = "From: " + senderName + ", " + this.body;
                console.log("+ The message |" + theMessage + "| " + " Sent to: " + sendNameList);
                notify.notifications.create({body: theMessage, toBinding: sendList})
                .then((response) => {
                    console.log("+ Notify response.sid: " + response.sid);
                    // callback(null, broadcastSuccessMessage);
                    callback(null, null);
                }).catch(err => {
                    // console.log(err);
                    callback(err, broadcastFailMessage);
                });
            });
            // ---------------------------------------------------------------------
        }).catch(function (error) {
            callback(error, broadcastFailMessage);
        });
    }
}
// -----------------------------------------------------------------------------
// Handle incoming SMS commands
//
//------------------
// For testing:
var event;
event = {Body: "!help", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!init", From: process.env.PHONE_NUMBER_2, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!init David", From: process.env.PHONE_NUMBER_2, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!help", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1};
// 
// event = {Body: "!subscribe", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!subscribe Name3", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!subscribe Name4", From: process.env.PHONE_NUMBER_4, To: process.env.PHONE_NUMBER_1};
//
// event = {Body: "!subscribe David2", From: "+16508662222", To: process.env.PHONE_NUMBER_1};
// event = {Body: "!unsubscribe", From: "+16508662222", To: process.env.PHONE_NUMBER_1};
// 
// event = {Body: "!who", From: "+16508662222", To: process.env.PHONE_NUMBER_1};
// event = {Body: "!who", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!who are you", From: process.env.PHONE_NUMBER_3, To: process.env.PHONE_NUMBER_1};
// 
// event = {Body: "!authorize", From: process.env.PHONE_NUMBER_2, To: process.env.PHONE_NUMBER_1};
// event = {Body: "!authorize " + process.env.PHONE_NUMBER_4, From: process.env.PHONE_NUMBER_2, To: process.env.PHONE_NUMBER_1};
//
// event = {Body: "Hello to all!", From: process.env.PHONE_NUMBER_4, To: process.env.PHONE_NUMBER_1};
//
function callback(aValue, theText) {
    console.log("++ function callback: " + theText);
}
const Twilio = require('twilio');
const client = Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const sync = client.sync.services(syncServiceSid);
const notify = client.notify.services(notifyServiceSid);
//------------------
// For Twilio Functions:
// https://about-time-1235.twil.io/groupsms?To=+16503791233&From=16508661234&body=okay
// exports.handler = (context, event, callback) => {
//------------------
{
    //
    let twiml = new Twilio.twiml.MessagingResponse();
    //
    let smsText = event.Body || '';
    let smsTextArray = smsText.split(' ');
    let cmd = smsText.trim().split(' ')[0].toLowerCase();
    if (cmd === "!") {
        cmd = "!" + smsTextArray[1].trim().toLowerCase();
    }
    let echoSms = "+ Text |" + smsText + "| cmd: " + cmd + ", From: " + event.From + ", To: " + event.To;
    //
    console.log(echoSms);
    let cmdInstance;
    switch (cmd) {
        case '!subscribe':
            cmdInstance = new SubscribeCommand(event);
            break;
        case '!authorize':
            cmdInstance = new AuthorizeCommand(event);
            break;
        case '!unsubscribe':
            cmdInstance = new UnsubscribeCommand(event);
            break;
        case '!who':
            cmdInstance = new WhoCommand(event);
            break;
        case '!help':
            cmdInstance = new HelpCommand(event);
            break;
        case '!init':
            cmdInstance = new InitCommand(event);
            break;
        default:
            cmdInstance = new BroadcastTheMessage(event);
    }
    cmdInstance.run((err, message) => {
        if (err) {
            // console.log(err);
            console.log("- cmdInstance.run, " + cmdInstance.word1 + " error: " + err.status + ":" + err.message);
            if (err.status === 409 && cmdInstance.word1 === '!subscribe') {
                message = '- You are already subscribed.';
            } else if (err.status === 404 && (cmdInstance.word1 === '!unsubscribe' || cmdInstance.word1 === '!who')) {
                message = '- You are not subscribed.';
            } else if (err.status === 404) {
                message = 'There was a problem with your request, value not found: ' + cmdInstance.word2;
            } else if (err.status === 409 && cmdInstance.word1 === '!init') {
                message = initFailMessage;
            } else {
                message = 'There was a problem with your request.';
            }
        }
        if (message === null) {
            console.log("+ No reply.");
            callback(null);
        } else {
            console.log("+ Reply message: " + message);
            twiml.message(message);
            callback(null, twiml);
        }
    });
}
// -----------------------------------------------------------------------------
