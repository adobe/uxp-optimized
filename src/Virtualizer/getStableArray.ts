/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const defaultTypes = () => "default";

function mapValuesToIndex<T>(values: T[]) {
    let map = new Map<T,number>();
    for (let i = 0; i < values.length; i++) {
        map.set(values[i], i);
    }
    return map;
}

/**
 *  Returns a new array that contains as many values as possible
 *  within the same location as previous array. 
 *  We also try to reuse indexes by type and never return a array smaller than the old array unless items have been completely removed.
 */
export default function getStableArray<T>(
    oldValues: T[],
    newSet: Set<T>,
    oldTypes: (value: T) => any = defaultTypes,
    newTypes: (value: T) => any = defaultTypes,
) {
    let newSize = Math.max(oldValues.length, newSet.size);
    // console.log("newSize: " + JSON.stringify({ old: oldValues.length, new: newSet.size }));
    // let oldSet = new Set(oldValues);
    let oldMap = mapValuesToIndex(oldValues);
    let newMap = new Map<T,number>();
    let newValues: T[] = [];
    function assign(newValue: T, newIndex: number) {
        newValues[newIndex] = newValue;
        // also track in our new map of where it went.
        newMap.set(newValue, newIndex);
    }
    // 1. Reassign indexes to old values if value is present in both old and new
    for (let newValue of newSet) {
        let oldIndex = oldMap.get(newValue);
        if (oldIndex != null) {
            assign(newValue, oldIndex);
        }
    }
    //  2. Reassign new values to unused indexes
    let startIndex = 0;
    for (let newValue of newSet) {
        let oldIndex = oldMap.get(newValue);
        if (oldIndex == null) {
            //  these elements were not in the old array
            //  we must add them now.
            let foundUndefined = false;
            for (let index = startIndex; true; index++) {
                let oldValue = oldValues[index];
                let oldType = oldValue != null ? oldTypes(oldValue) : null;
                let newType = newTypes(newValue);
                if (newValues[index] === undefined) {
                    foundUndefined = true;
                    if (oldType == null || oldType === newType) {
                        assign(newValue, index);
                        break;
                    }
                }
                else {
                    //  we track where to start so that this isn't an
                    //  n^2 algorithm.
                    if (!foundUndefined) {
                        startIndex = index;
                    }
                }
            }
        }
    }
    //  3. Retain old values if there are still any unused indexes.
    for (let i = 0; i < newSize; i++) {
        let newValue = newValues[i];
        if (newValue === undefined) {
            let oldValue = oldValues[i];
            assign(oldValue, i);
        }
    }
    // return newValues removing any undefined values;
    return newValues;
    // return newValues.filter(value => value != null);
};

//  Return also a Set of removed values.
//  Those elements can be hidden and queued up for reuse by anything.
//  If those elements are not toggled back open then they could end up being reused
//  for their previous items which would be efficient and not uncommon.
