/** @param {NS} ns */
// export async function main(ns) {}

export function readServer(ns, server) {
    let availableServers = getFromFile(ns).servers;

    let currentServer = '';
    availableServers.forEach(server => {
        if (server.name === server) {
            currentServer = availableServers[server];
        }
    })

    // initialise empty server
    if (!currentServer) {
        currentServer = createDbItem(server);
    }

    return currentServer;
}

export function resetServerItem(ns, server) {
    let cleanItem = createDbItem(server);

    writeServer(ns, server, cleanItem);
}

export function writeServer(ns, server, data) {
    const totalDb = getFromFile(ns);

    let current = find(totalDb.servers, 'name', server);

    if (current !== -1) {
        totalDb.servers[find(totalDb, 'name', server, true)];
    } else {
        totalDb.servers.push(data)
    }

    ns.write('database.txt', JSON.stringify(totalDb), 'w');
}

export function getStats(ns) {
    let database = getFromFile(ns);
    let result = createDbItem('stats');

    database.servers.forEach(server => {
        result.grow = result.grow + server.grow;
        result.hack = result.hack + server.hack;
        result.weaken = result.weaken + server.weaken;
    });

    return result;
}

function getFromFile(ns) {
    let databaseFile = ns.read('database.txt');

    // initialise
    if (!databaseFile) {
        databaseFile = '{"servers": []}';
    }

    return JSON.parse(databaseFile);
}

function find(array, field, value, returnKey = false) {
    array.forEach((item, key) => {
        if (item[field] == value) {
            return returnKey ? key : item[field];
        }
    });

    return -1;
}

function createDbItem(server) {
    return {
        name: server,
        grow: 0,
        hack: 0,
        weaken: 0,
    }
}