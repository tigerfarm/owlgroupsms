echo "+++ Set variables."
# ------------------------------------------------------------------------------
export ACCOUNT_SID=your_account_SID
export AUTH_TOKEN=your_account_auth_token
export SYNC_SERVICE_SID=your_sync_service_SID
export SYNC_MAP_NAME=your_sync_mapname_or_groupsms_phonenumber
export NOTIFY_SERVICE_SID=your_notify_service_SID
# -------
# For Group SMS:
export SEND_ACCOUNT_SID=your_account_SID
export SEND_AUTH_TOKEN=your_account_auth_token
export PHONE_NUMBER_1=your_test_phonenumber1
export PHONE_NUMBER_2=your_test_phonenumber2
export PHONE_NUMBER_3=your_test_phonenumber3
export PHONE_NUMBER_4=your_test_phonenumber4

export SYNC_MAP_NAME=counters
node echoVars.js
# ------------------------------------------------------------------------------
