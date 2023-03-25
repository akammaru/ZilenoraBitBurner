/** @param {NS} ns */
export function main(ns) {
    let structure = scanServer(ns, 'home');
    printStructure(ns, structure);
}

function scanServer(ns, target, alreadyFound, counter = 0, targetParent = 'home') {
    let structure = {};
    let currentLocation = ns.scan(target);
    alreadyFound = alreadyFound ?? [];
    let indicatorString = "";

    for(let i = 0; i <= counter; i++) {
        indicatorString = indicatorString + '-';
    }

    currentLocation.forEach(server => {
        if (!alreadyFound.includes(server)) {
            alreadyFound.push(server);
            structure[server] = scanServer(ns, server, alreadyFound, counter, targetParent);
        }
    })

    return structure;
}

function printStructure(ns, structure, iteration = 0) {
    iteration++;
    let keys = Object.keys(structure);
    let indicator = '';

    for (let i = 0; i <= iteration; i++) {
        indicator = indicator + '-';
    }


    keys.forEach(server => {
        if (iteration !== 1) {
            ns.tprint(indicator + '> ' + server)
        }
        printStructure(server);
    });
    ns.tprint(keys)
}

// I have a list
// current -> has array of servers
// I want to show child servers.
