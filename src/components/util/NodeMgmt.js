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