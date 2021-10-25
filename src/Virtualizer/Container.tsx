/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/
import React, { forwardRef, Ref, ForwardRefRenderFunction, CSSProperties } from 'react';
import Virtualizer from '.';

type VirtualItem = JSX.Element | Element | null | boolean | VirtualItems
type VirtualItems = Array<VirtualItem>

type Properties = {
  children: VirtualItem | VirtualItems
  id?: string
  className?: string
  style?: CSSProperties
}

type InputHandles = {
}

/**
 * This component provides a higher level, simpler interface for virtualization.
 * Each child must be a react element with a key specified.
 * The element type should be a uniquely named function or class.
 * Elements will be recycled during virtualization based upon element type name.
 * @see the NewContainer sample for usage.
 */
export default forwardRef(function Container<T>(properties: Properties, ref: Ref<InputHandles>) {
  let { children, ...rest } = properties;
  let items = ((Array.isArray(children) ? children : [children]) as VirtualItem[]).flat(Number.MAX_SAFE_INTEGER).filter(Boolean);
  console.log("....", items);
  // console.log(items.map(item => item.type.toString()))
  // we need type field.

  return (
    <Virtualizer
      items={items}
      itemKey="key"
      itemType={item => item.type.name || item.type.toString()}
      ref={ref}
      {...rest}
    >
      { (item) => item }
    </Virtualizer>
  );

}) as ForwardRefRenderFunction<InputHandles, Properties>;
