// App.js > Top.jsx > MainTransport.jsx

// react
import React from "react";

// modules

// components

// start
export default function MainTransport({togglePause, playing}){

    const changePlayPause = () => {
        let pauseColor = playing !== true ? {color:'red'}:{color:'black'};
        let playColor  = playing === true ? {color:'red'}:{color:'black'};
        return(
            <div className='play-pause' onClick={togglePause}>
                <span className='pause' style={pauseColor} >&#1231;&#1231;</span>
                <span className='play' style={playColor} >&#9654;</span>
            </div>
        )
    }
    return(
        <div className='transport-container'>
            <div className='transport'>
                <div className='rewind'>{`<`}</div>
                {changePlayPause()}
                <div className='stop'>&#9617;</div>
                <div className='forward'>{`>`}</div>
            </div>
        </div>
    )
}