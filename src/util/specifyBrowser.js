export default function specifyBrowser(){
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && (
        !!window.chrome.webstore || !!window.chrome.runtime
    );
    if (!(isFirefox || isChrome)){
        alert("Please use either Firefox or Chrome");throw new Error()
    }
}
specifyBrowser()