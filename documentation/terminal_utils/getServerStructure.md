# getServerStructure.js
## scanServers(ns)

### Parameters
| parameter| Type| Description|
|---|---|--------------------|
|ns | unknown| bit burner library|

### result
prints to terminal for each server:
- server name
- has root access
- files on server
- parent server

### example: 

```
/terminal_utils/getServerStructure.js: --> home
/terminal_utils/getServerStructure.js: root access: true
/terminal_utils/getServerStructure.js: ---> n00dles
/terminal_utils/getServerStructure.js: root access: true
/terminal_utils/getServerStructure.js: files: share.js,weaken_1.js
/terminal_utils/getServerStructure.js: parent server: home
/terminal_utils/getServerStructure.js: ----> CSEC
/terminal_utils/getServerStructure.js: root access: true
/terminal_utils/getServerStructure.js: files: contract-317085.cct,democracy-is-dead.lit,share.js
/terminal_utils/getServerStructure.js: parent server: n00dles
/terminal_utils/getServerStructure.js: ---> foodnstuff
/terminal_utils/getServerStructure.js: root access: true
/terminal_utils/getServerStructure.js: files: contract-356198.cct,sector-12-crime.lit,share.js,weaken_1.js
```