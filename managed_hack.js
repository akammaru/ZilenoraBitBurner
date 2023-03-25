/** @param {NS} ns */
// import {resetServerItem, readServer, writeServer, getStats} from "db_management.js"

export function main(ns) {
    hackServer(ns, 'home', 'iron-gym', ns.getServerMoneyAvailable('iron-gym'), ns.getServerSecurityLevel('iron-gym'));
    // activateScript(ns, 'home', 'n00dles', 10, 'hack', 1);
}

export function hackServer(ns, server, target, targetMoney, targetSec) {
    // defined values
    const secWeaken = 0.05;
    const hackSecGrowth = 0.002;

    const lowestSec = ns.getServerMinSecurityLevel(target);
    let activeSec = targetSec;

    const growAmount = ns.getServerGrowth(target);
    const maxMoney = ns.getServerMaxMoney(target);
    const growMultiplier = 1 / ns.growthAnalyze(server, 2);
    let predictedMoney = targetMoney;

    let availableThreads = getAvailableThreads(ns, server);
    for(let i = 1; i <= availableThreads; i++) {
        let moneyRating = predictedMoney/maxMoney;
        let secRating = activeSec / lowestSec
        let action = 'nothing'
        let threads = 0;

        if (secRating >= 1.1) {
            action = 'weaken';
            threads = Math.ceil((activeSec - lowestSec) / secWeaken);
        } else if(moneyRating < 0.8) {
            threads = Math.ceil((maxMoney - predictedMoney) / growAmount);
            action = 'grow';
        } else {
            threads = Math.ceil(predictedMoney / ns.hackAnalyze(target));
            // threads = 8; // todo: set max 8 hack threads, to keep money levels high. update later on.'
            action = 'hack';

        }

        if (threads > availableThreads) {
            threads = availableThreads;
        }

        // if (threads >= 32) {
        // 	threads = 32;
        // }

        availableThreads = availableThreads - threads;

        switch(action) {
            case 'weaken': {
                activeSec = activeSec - ns.weakenAnalyze(threads);
                break;
            }
            case 'grow': {
                activeSec = activeSec + ns.growthAnalyzeSecurity(threads, target);
                predictedMoney += (growAmount * threads);
                break;
            }
            case 'hack': {
                activeSec = activeSec + ns.hackAnalyzeSecurity(threads);
                predictedMoney += (ns.hackAnalyze(server)*threads)*-1;
                break;
            }
        }

        activateScript(ns, server, target, threads, action, i, [threads, activeSec, predictedMoney]);
    }

    return {activeSec, predictedMoney};
}

async function activateScript(ns, server, target, threads, action, number, checkValues) {
    let actionFile = action + '.js';
    let iterativeName = action + '_' + number + '.js';

    // make sure action script is on server
    if (!ns.fileExists(actionFile, server) && server !== 'home') {
        ns.scp(
            actionFile,
            server,
            'home'
        )
    }

    // rename action script to revent duplicate script runs
    if (!ns.fileExists(iterativeName, server) && server !== 'home') {
        ns.mv(
            server,
            actionFile,
            iterativeName
        )
    }

    if (server === 'home') {
        iterativeName = actionFile;
    }

    // start script iteration
    await ns.exec(iterativeName, server, threads, target, ...checkValues)
}

function getAvailableThreads(ns, server) {
    const maxRam = ns.getServerMaxRam(server);
    let usedRam = ns.getServerUsedRam(server);

    if (server === 'home') {
        usedRam += 20;
    }

    // action scripts are slightly under 2GB.
    return Math.floor((maxRam - usedRam) / 1.75)
}