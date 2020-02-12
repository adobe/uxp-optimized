/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

export default function memoize<INPUT,OUTPUT>(fn: (input: INPUT) => OUTPUT): (input: INPUT) => OUTPUT {
    const symbol = Symbol();
    return (input: INPUT) => {
        if (input == null) {
            debugger;
        }
        let value = input[symbol];
        if (value === undefined) {
            value = input[symbol] = fn(input);
        }
        return value;
    }
}