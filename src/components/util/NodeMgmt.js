export const connectSrcGainDest = (src, dest) => {
    if (( typeof src !== typeof {} ) || ( !src['source'] ) || ( !src['gain'] )) {
        console.log('please enter valid source');
        // yield('please enter valid source');
        alert('please enter valid source');
    } else {
        src['gain'].connect(dest);
        src['source'].connect(src['gain']);
        return src;
    }
}

export const connectSerialNodes = (NodesObj, destination) => {
    if (typeof NodesObj === typeof {}) {
        // {source:source, env:env, gain:gain, dest:ac.destination}
        let node1, node2;
        for (let key in NodesObj) {
            node2 = NodesObj[key];
            if (!!node1) {
                node1.connect(node2)
            }
            node1 = NodesObj[key];
        }
    } else if (typeof NodesObj === typeof []) {
        // [source, env, gain, ac.destination]
        for (let idx = 0; idx < NodesObj.length; idx++) {
            const node1 = NodesObj[idx];
            const node2 = NodesObj[idx + 1];
            node1.connect(node2)
        }
    }
}