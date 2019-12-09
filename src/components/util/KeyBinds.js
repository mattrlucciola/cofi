export const KeyBinds = (togglePause, toggleAdvance) => {
    document.onkeypress = (e) => {
        let key = e.key;
        // if we're in the main body scope
        if (document.activeElement === document.body) {
            e.preventDefault();
            
            // 1. press space bar to start
            if (key === ' '){togglePause();}
            // 2. press ","/"." to advance/devance current step
            if ([',','.'].includes(key)){toggleAdvance(key);}
        }
    }
}
