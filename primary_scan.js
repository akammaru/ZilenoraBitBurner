/** @param {NS} ns */
export function getAllServers(ns) {
    let list = {private: [], public: []};
    let own = ns.getPurchasedServers();
    own.push('home');

    function scanMore(server) {
        ns.scan(server).forEach(server => {
            if (own.includes(server) && !list.private.includes(server)) {
                list.private.push(server);
            } else if (!list.public.includes(server)) {
                list.public.push(server);
                scanMore((server));
            }
        })
    }

    scanMore('home');
    return list;
}