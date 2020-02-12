/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/


function isValidId(string) {
    return /^[a-z_$]+[a-z_$0-9]*$/.test(string);
}

export function stringify(object, objects = new Set(), indent = 0, newLines?) {
    const maxDepth = 4;
    const maxLineLength = 100;
    const indentString = "  ";
    //  the current re-stringifying that happens to determine if we need to 
    //  break into a new line or leave object as single line is not efficient right now.
    //  it can result in n * depth rerenders of some objects.
    //  we limit max depth so this is probably not a big concern.
    //  the purpose of this object rendering is to aid in developer debugging.
    //  not intended to be performant for runtime console.logging of objects.
    //  for that users should use console.log(JSON.stringify(object))
    if (object === undefined) {
        return "undefined";
    }
    else if (object == null || typeof object !== "object") {
        if (indent === 0) {
            //  if this is a root primitive argument we do NOT stringify it, leave it unmodified.
            return object;
        }
        return JSON.stringify(object);
    }
    else if (objects.has(object)) {
        return "[Circular]";
    }
    else {
        const buffer: any[] = [];
        const originalObjects = new Set(objects);
        let writeIndent = () => {
            for (let i = 0; i < indent; i++) {
                buffer.push(indentString);
            }
        };
        let writeNewLine = (elseString?, dent = true) => {
            if (newLines) {
                buffer.push("\n");
            }
            else if (elseString) {
                buffer.push(elseString);
            }
            if (newLines && dent) {
                writeIndent();
            }
        };
        objects.add(object);
        if (Array.isArray(object)) {
            if (object.length === 0) {
                buffer.push("[]");
            }
            else if (indent > maxDepth) {
                return "[...]";
            }
            else {
                buffer.push("[ ");
                indent++;
                for (let i = 0; i < object.length; i++) {
                    let element = object[i];
                    writeNewLine();
                    buffer.push(stringify(element, objects, indent));
                    if (i + 1 < object.length) {
                        buffer.push(", ");
                    }
                }
                indent--;
                writeNewLine(" ");
                buffer.push("]");
            }
        }
        else {
            if (object.constructor && object.constructor !== Object && object.constructor.name) {
                buffer.push(object.constructor.name, " ");
            }
            if (indent > maxDepth) {
                return `${buffer.join('')} {...}`;
            }
            buffer.push("{");
            indent++;
            let count = 0;
            let names = Object.keys(object);
            for (let i = 0; i < names.length; i++) {
                let name = names[i];
                if (!name.startsWith("_")) {

                    let value = object[name];
                    writeNewLine();
                    buffer.push(isValidId(name) ? name : JSON.stringify(name), ": ");
                    buffer.push(stringify(value, objects, indent));
                    if (i + 1 < names.length) {
                        buffer.push(", ");
                    }
                }
            }
            indent--;
            writeNewLine();
            buffer.push("}");
        }
        let result = buffer.join("");
        // if this is too long then re-render forcing newlines.
        if (!newLines && result.length > maxLineLength) {
            result = stringify(object, originalObjects, indent, true);
        }
        return result;
    }
}

export function log(...args) {
    console.log(args.map(a => stringify(a)));
}