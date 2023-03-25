/** @param {NS} ns */
import {getAllServers} from "primary_scan.js";
import {hackServer} from "managed_hack.js";
import {upgradeServerCapacity} from "server_utils.js";
import {getTarget} from "target_hack.js";

export async function main(ns) {
    let loopIterator = 24;
    while(true) {
        upgradeServerCapacity(ns);

        // target stats
        let targetServer = getTarget(ns) != '' ? getTarget(ns) : 'home';
        let currentSec = ns.getServerSecurityLevel(targetServer);
        let currentMoney = ns.getServerMoneyAvailable(targetServer);

        // get my hacking level
        let hackLevel = ns.getHackingLevel();

        // scan for all servers
        let servers = getAllServers(ns);
        servers.public.forEach(server => {
            // get server required level
            const requiredLevel = ns.getServerRequiredHackingLevel(server);

            // check if I match level
            if (hackLevel >= requiredLevel) {
                // get root rights
                let requiredPorts = ns.getServerNumPortsRequired(server);
                let hacksAvailable = 0;
                if (!ns.hasRootAccess(server)) {
                    const homeServer = 'home';
                    if (requiredPorts > 0) {
                        if (ns.fileExists('BruteSSH.exe', homeServer)) {
                            hacksAvailable++;
                            ns.brutessh(server);
                        }
                        if (ns.fileExists('FTPCrack.exe', homeServer)) {
                            hacksAvailable++;
                            ns.ftpcrack(server);
                        }
                        if (ns.fileExists('relaySMTP.exe', homeServer)) {
                            hacksAvailable++;
                            ns.relaysmtp(server);
                        }
                        if (ns.fileExists('HTTPWorm.exe', homeServer)) {
                            hacksAvailable++;
                            ns.httpworm(server);
                        }
                        if (ns.fileExists('SQLInject.exe', homeServer)) {
                            hacksAvailable++;
                            ns.sqlinject(server);
                        }
                    }

                    if (requiredPorts <= hacksAvailable) {
                        ns.nuke(server);
                    }
                } else {
                    if (hackLevel < 250) {
                        let response = hackServer(
                            ns,
                            server,
                            targetServer,
                            currentMoney,
                            currentSec,
                        );
                        currentMoney = response.predictedMoney;
                        currentSec = response.activeSec;
                    } else {
                        shareServer(ns, server);
                    }

                }
            }
        });

        servers.private.forEach(server => {
            let response = hackServer(
                ns,
                server,
                targetServer,
                currentMoney,
                currentSec
            );
            currentMoney = response.predictedMoney;
            currentSec = response.activeSec;
        });
        ns.print('I am done, going to sleep', {currentMoney, currentSec});
        await ns.sleep(2500);
    }
}

async function shareServer(ns, server) {
    let fileName = 'share.js'
    let maxRam = ns.getServerMaxRam(server);
    let usedRam = ns.getServerUsedRam(server);
    let shareThreads = Math.floor((maxRam - usedRam)/ns.getScriptRam(fileName));

    if (!ns.fileExists(fileName, server)) {
        ns.scp(fileName, server, 'home');
    }

    if (shareThreads >= 1) {
        await ns.exec(fileName, server, shareThreads, shareThreads);
    }
}