export default function assignGlobalKeyPress(bindsObj){
    // set all keypress events here
    document.onkeypress = (e) => {
        let eventKey = e.key;

        // if we're in the main body scope
        if (document.activeElement === document.body) {
            e.preventDefault()

            if (bindsObj.hasOwnProperty(eventKey)) {
                bindsObj[eventKey](e)
            }
        }
        else {
            if (eventKey === 'Escape') {document.activeElement.blur()}
        }
    }
}