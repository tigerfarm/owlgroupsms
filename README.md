# Twilio Sync PHP Samples

Sync components created using these repository's programs:
````
Sync Service: name = counters (use the Twilio Console to create)
   |
Sync Map: name = counters (create, retrieve, delete)
   |
Sync Map item: key name = countera, data = {"counter":  1 } --- Initial counter value = 1
               (create, retrieve, update, delete)
````

For now, use the [Twilio Console](https://www.twilio.com/console/sync/services) to create a Sync Service (no program yet).
Click the create icon and create:
````
Friendly name: counters
Example:
Sync service SID: ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
````

After creating your Sync Service, create environment variables for use in these repository's programs:
````
ACCOUNT_SID=your_account_SID
AUTH_TOKEN=your_account_auth_token
SYNC_SERVICE_SID=your_sync_service_SID
SYNC_MAP_NAME=counters
export ACCOUNT_SID
export AUTH_TOKEN
export SYNC_SERVICE_SID
export SYNC_MAP_NAME
````
Note, you can use the shell script to maintain your variables ([setvars.sh](setvars.sh)).
````
Run using: source setvars.sh
````

Requirements:

- Twilio account. A free Trial account will work.
- PHP installed to run programs locally on your computer. Note, the Twilio PHP Helper Library is not required.

Note, it is possible to create a Service Map with an empty name (UniqueName=""). However, you cannot delete it with delete Map program (delMap.php).

## Files

Programs to manage Sync service Map items:
- [listServices.php](listServices.php) : List Sync Services. Note, by default, there is a default service, friendly_name="Default Service".
- [createMap.php](createMap.php) : Given a Sync service, create a Map.
- [listMaps.php](listMaps.php) : List Sync Maps.
- [delMap.php](delMap.php) : Delete a specific Sync Map, which deletes all the related Items.
- [createMapItem.php](createMapItem.php) : Given a Sync service and a Map, create a Map Item.
- [listMapItem.php](listMapItem.php) : List a specific Sync Map Item.
- [listMapItems.php](listMapItems.php) : List Sync Map Items.
- [updateMapItem.php](listMapItem.php) : Update a specific Sync Map Item.
- [delMapItem.php](delMapItem.php) : Delete a specific Sync Map Item.
- [setvars.sh](setvars.sh) : Set program environment variables.

API documentation link: [https://www.twilio.com/docs/sync/api/maps](https://www.twilio.com/docs/sync/api/maps)

Sync Maps JavaScript SDK documentation: https://www.twilio.com/docs/sync/maps
Sync tokens: https://www.twilio.com/docs/sync/identity-and-access-tokens

To do:
- Create a service.
- List error checking.
- Consider a library for: GET and POST, and standard error handling messages (example: createMap.php).

## Implementation

- Create a Sync Service using [Twilio Console](https://www.twilio.com/console/sync/services).
- Create a Sync map by running it: php createMap.php
- List the new Sync Map using: php listMaps.php

...
