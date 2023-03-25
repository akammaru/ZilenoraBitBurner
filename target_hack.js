/** @param {NS} ns */
import {getAllServers} from "primary_scan.js";

export function getTarget(ns) {
    let serverList = getAllServers(ns).public;
    let bestTarget = '';
    let bestMoney = 0;
    let bestScore = 0;
    serverList.forEach(server => {
        let maxMoney = ns.getServerMaxMoney(server);
        let rootAccess = ns.hasRootAccess(server);
        let score = 0;

        if (maxMoney > bestMoney) {
            score = maxMoney/1000000;
        }

        score = score * ns.hackAnalyzeChance(server);

        if (maxMoney <= 1 || !rootAccess) {
            score = 0
        }

        if (bestScore < score) {
            bestTarget = server;
            bestMoney = maxMoney;
            bestScore = score;
        }
    })

    return bestTarget;
}