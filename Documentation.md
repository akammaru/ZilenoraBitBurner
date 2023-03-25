# file documentation

This project is for the (steam) game BitBurner: https://store.steampowered.com/app/1812820/Bitburner/

This project was created by: **Zilenora**

## file by file description
### master-script.js
Starts a fully automated script to:

- weaken, grow and hack targets
- gain root access to all servers found with scan
- get the best target for hacking money
- buy and upgrade purchasedServers to the max ram possible
  - and use these servers for hacking money
- start sharing remote servers beyond a certain hack level
  - this is hardcoded at 250 hacking level for now

### database_management.js
functions to write and retrieve data from a file based database structure.

### getServerStructure.js
WIP once done, will print a complete readout of the scan network (more than what scan-analyze can do)

### managed_hack.js
handles all the growing, weakening and hacking on all servers.

### primary_scan.js
scans the network and returns an object with two arrays
private: home and all purchased servers
public: all servers that are not owned by the player

### server_utils.js
will buy servers if there are no private servers, 
or if it is cheaper to buy than to upgrade. 

this is by default set to use a 100% of the users assets to do so.
this can be changed by passing a number between 0 and 1 as second argument with the upgradeServerCapacity function

### target_hack.js
decides what server is best to hack. 

This file needs more work. 
currently only decides on the best target by: 

- largest amount of max money
- hack success chance

### test.js
this is a file with random bits of code used for testing and debugging specific parts.