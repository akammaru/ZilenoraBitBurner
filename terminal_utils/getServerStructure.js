/** @param {NS} ns */
export function main(ns) {
    ns.tprint(scanServers(ns));
}

// todo: print clear view of all servers
// todo: print each file on the server
// split gaining the intel and printing it.
function scanServers(ns) {
    let list = [];
    let own = ns.getPurchasedServers();
    own.push('home'); // add home to own server.

    let serverScructure = {};
    function scanMore(server, count = 0, parentServer = '') {
        let depth = count + 1;
        let scannedServers = ns.scan(server);
        serverScructure[server] = [depth, ...scannedServers];
        list.push(server);

        let indicatorString = '';
        for(let i = 0; i <= depth; i++) {
            indicatorString = indicatorString + '-';
        }
        let baseString = indicatorString + '> ';
        ns.tprint(baseString + server);
        ns.tprint('root access: ' + ns.hasRootAccess(server));
        if (server !== 'home') {
            ns.tprint('files: ' + ns.ls(server));
            ns.tprint('parent server: ' + parentServer);
        }

        scannedServers.forEach(relatedServer => {
            if (!own.includes(relatedServer) && !list.includes(relatedServer)) {
                scanMore(relatedServer, depth, server);
            }
        });
    }
    scanMore('home');
}
