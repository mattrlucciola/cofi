// ../App
export const clickToggleReducer = (state, action) => {
    let {addInstrumentOpen} = state;

    switch (action.type) {
        // open/close add-instrument menu
        case 'addInstrumentOpen': {state = {...state, addInstrumentOpen: action.addInstrumentOpen}; break}

        default:
            console.log('incorrect action type: ', action['type']);
            throw new Error();
    }
    console.log(`ClickToggleReducers: (USEREDUCER):    add-instrument:${state.addInstrumentOpen}       action:${action.type}`);
    return state
}
