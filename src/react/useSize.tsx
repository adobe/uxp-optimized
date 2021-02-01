import { useEffect } from 'react';
import { isUXP } from '..';
import ResizeObserver from "../common/ResizeObserver";

export default function useSize<T extends HTMLElement>(
    ref: React.RefObject<T>,
    callback: (t: T) => void,
    dependencies: any[] = []
) {
    useEffect(() => {
        if (!isUXP) {
            // normal browsers calculate the correct size as soon as it's in the DOM.
            callback(ref.current!);
        }
        let resizeObserver = new ResizeObserver(() => {
            callback(ref.current!);
        })
        resizeObserver.observe(ref.current!);
        return () => {
            resizeObserver.unobserve(ref.current!);
        }
    }, [ref.current, ...dependencies]);
}
