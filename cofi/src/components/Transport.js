import React from 'react'

export default function Transport(){
    return(
        <div className='transport'>
            <div className='rewind'>{`<`}</div>
            <div className='play'>{`|>`}</div>
            <div className='stop'>{`/`}</div>
            <div className='forward'>{`>`}</div>
        </div>
    )
}