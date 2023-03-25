/** @param {NS} ns */
export function upgradeServerCapacity(ns, moneyUsePercentage = 1) {
    let servers = ns.getPurchasedServers();
    let serverCount = servers.length;
    let serverCountLimit = ns.getPurchasedServerLimit();

    // base servers are set to 16GB RAM.
    let baseCost = ns.getPurchasedServerCost(16);
    let weakestLink = upgradeCandidate(ns, servers);
    let balance = (ns.getPlayer().money * moneyUsePercentage);

    let action = 'nothing';
    if (serverCount === 0 || (baseCost < weakestLink.cost)) {
        action = 'buy';
    } else {
        action = 'upgrade'
    }

    if (serverCount >= serverCountLimit) {
        action = 'upgrade';
    }

    if (action === 'buy' && balance < baseCost) {
        action = 'nothing';
    }

    // todo: add max ram check
    if (action === 'upgrade' &&
        balance < weakestLink.cost &&
        weakestLink.name !== ''
    ) {
        action = 'nothing';
    }

    if (action === 'upgrade') {
        ns.upgradePurchasedServer(weakestLink.name, (weakestLink.ram * 2));
    } else if (action === 'buy') {
        let newServerName = 'private_server_' + serverCount; // might need to add a +1
        ns.purchaseServer(newServerName, 16);
    }
}

function upgradeCandidate(ns, serverList) {
    let lowest = {
        name: '',
        ram: ns.getPurchasedServerMaxRam(),
        cost: 0,
    };

    serverList.forEach(server => {
        let serverRam = ns.getServerMaxRam(server);
        if (serverRam < lowest.ram) {
            lowest.name = server;
            lowest.ram = serverRam;
            lowest.cost = ns.getPurchasedServerUpgradeCost(server, (serverRam * 2))
        }
    })

    return lowest;
}