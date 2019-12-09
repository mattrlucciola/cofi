import React from 'react'

export default function Transport(props){
    function changePlayPause() {
        let pauseColor = props.playing !== true ? {color:'red'}:{color:'black'};
        let playColor  = props.playing === true ? {color:'red'}:{color:'black'};
        return(
            <div className='play-pause' onClick={props.togglePause}>
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