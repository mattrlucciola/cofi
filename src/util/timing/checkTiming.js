export function checkTiming(thelist, t){
    thelist.push(t);
    let sum = 0;
    let difflist = [];
    thelist.forEach((elem, idx) => {
        if (idx > 0) {
            let diff = thelist[idx + 1] - elem;
            difflist.push(diff);
        }
    });
    difflist.pop();
    difflist.forEach(element => {
        sum += element
    });
    console.log(`avg: ${sum / difflist.length}`, difflist);
    return thelist
}