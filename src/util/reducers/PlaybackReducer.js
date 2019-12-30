// ../App
export const playbackReducer = (state, action) => {
    let {measure, bpm, timeSignature} = state;
    state['stepLength'] = 60/bpm;

    switch (action.type) {
        case 'totalSteps': {state = {...state, totalSteps: action.totalSteps}; break}

        // change measure states
        case 'measure+'     : {state = {...state, 'measure'         : measure + 1}; break}
        case 'measure-'     : {state = {...state, 'measure'         : measure - 1}; break}
        case 'measureEnd'   : {state = {...state, 'measureEnd'      : action.time}; break}
        case 'scheduledTime': {state = {...state, 'scheduledTime'   : action.time}; break}
        case 'scheduledStep': {state = {...state, 'scheduledStep'   : action.step}; break}
        case 'queue'        : {
            state = {
                ...state, 
                'scheduledTime': action.time,
                'scheduledStep': action.step,
            }; 
            break;
        }
        case 'resetMeasure' : {state = {...state, 'measureEnd'      : action.time};break;}

        // time signature
        case 'timeSignature': {state = {...state, 'timeSignature': timeSignature};break;}

        // bpm states
        case 'bpm': {state = {...state, 'bpm': bpm}; break}
        default:
            console.log('incorrect action type: ',action['type']);
            
            throw new Error();
    }
    console.log(`Reducers: (USEREDUCER):    measure-end:${state.measureEnd}       action:${action.type}`);
    return state
}
