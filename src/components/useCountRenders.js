import {useRef} from 'react';

export const useCountRenders = (location) => {
    const renders = useRef(0);
    console.log(`${location}: `, renders.current++);
}