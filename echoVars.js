// -----------------------------------------------------------------------------
console.log("+++ Start echo.");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const syncServiceSid = process.env.SYNC_SERVICE_SID;
const syncMap = process.env.SYNC_MAP_NAME;
const authorizedDefault = process.env.AUTHORIZED_DEFAULT || "new";   // default to "new" which requires authorization.
console.log("+ ACCOUNT_SID        :" + accountSid + ":");
console.log("+ AUTH_TOKEN         :" + authToken + ":");
console.log("+ SYNC_SERVICE_SID   :" + syncServiceSid + ":");
console.log("+ SYNC_MAP_NAME      :" + syncMap + ":");
console.log("+ AUTHORIZED_DEFAULT :" + authorizedDefault + ":");
// -------
const sendAccountSid = process.env.SEND_ACCOUNT_SID;
const sendAuthToken = process.env.SEND_AUTH_TOKEN;
const phoneNumber1 = process.env.PHONE_NUMBER_1;
const phoneNumber2 = process.env.PHONE_NUMBER_2;
const phoneNumber3 = process.env.PHONE_NUMBER_3;
const phoneNumber4 = process.env.PHONE_NUMBER_4;
console.log("+ SEND_ACCOUNT_SID   :" + sendAccountSid + ":");
console.log("+ SEND_AUTH_TOKEN    :" + sendAuthToken + ":");
console.log("+ PHONE_NUMBER_1     :" + phoneNumber1 + ":");
console.log("+ PHONE_NUMBER_2     :" + phoneNumber2 + ":");
console.log("+ PHONE_NUMBER_3     :" + phoneNumber3 + ":");
console.log("+ PHONE_NUMBER_4     :" + phoneNumber4 + ":");

// -----------------------------------------------------------------------------
console.log("+++ Exit.");
