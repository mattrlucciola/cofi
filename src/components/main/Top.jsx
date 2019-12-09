// App.js > Top.jsx

// react
import React from "react";

// modules

// components
import MainTransport from '../hud/MainTransport';

// start
export default function Top({transportParams}){
    return(
        <div className="Top">
            <MainTransport transportParams={transportParams} />
        </div>
    )
}