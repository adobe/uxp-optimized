/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

export default function memoize<INPUT extends object,OUTPUT>(fn: (input: INPUT) => OUTPUT): (input: INPUT) => OUTPUT {
    const symbol = Symbol();
    const cache = new WeakMap<INPUT,OUTPUT>();
    return (input: INPUT) => {
        const e = Object.isExtensible(input);
        let value = e ? input[symbol] : cache.get(input);
        if (value === undefined) {
            value = fn(input);
            if (e) {
                input[symbol] = value;
            }
            else {
                cache.set(input, value)
            }
        }
        return value;
    }
}