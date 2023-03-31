/** @param {NS} ns */
export function getAllServers(ns) {
    let list = {private: ns.getPurchasedServers(), public: []};
    list.private.push('home');
    function scanMore(server) {
        ns.scan(server).forEach(foundServer => {
            if (!list.private.includes(foundServer) && !list.public.includes(foundServer)) {
                list.public.push(foundServer);
                scanMore(foundServer);
            }
        })
    }

    scanMore('home');
    return list;
}