/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {classNames, filterDOMProps, useFocusableRef, useStyleProps} from '@react-spectrum/utils';
import CornerTriangle from '@spectrum-icons/ui/CornerTriangle';
import {FocusableRef} from '@react-types/shared';
import {FocusRing} from '@react-aria/focus';
import React, {cloneElement} from 'react';
import {SpectrumActionButtonProps} from '@react-types/button';
import styles from '@adobe/spectrum-css/dist/components/button/vars.css';
import {useButton} from '@react-aria/button';
import {useProviderProps} from '@react-spectrum/provider';

function ActionButton(props: SpectrumActionButtonProps, ref: FocusableRef) {
  props = useProviderProps(props);
  let {
    elementType: ElementType = 'sp-action-button', // uxp
    isQuiet,
    isSelected,
    isDisabled,
    // isEmphasized,
    icon,
    children,
    holdAffordance,
    autoFocus,
    ...otherProps
  } = props;

  let domRef = useFocusableRef(ref);
  let {buttonProps, isPressed} = useButton(props, domRef);
  let {
    className: groupClassName,
    ...otherButtonProps
  } = buttonProps;
  let {styleProps} = useStyleProps(otherProps);

  return (
    <FocusRing focusRingClass={classNames(styles, 'focus-ring')} autoFocus={autoFocus}>
      <ElementType
        {...filterDOMProps(otherProps)}
        {...styleProps}
        {...otherButtonProps}
        quiet={ isQuiet }   // uxp
        selected={ isSelected } //  uxp
        disabled={ isDisabled } //  uxp
        hold-affordance={ holdAffordance }  // uxp
        ref={domRef}
        className={
          classNames(
            styles,
            'spectrum-ActionButton',
            {
            //   'spectrum-ActionButton--quiet': isQuiet,
            //   'spectrum-ActionButton--emphasized': isEmphasized,
            //   'is-active': isPressed,
            //   'is-selected': isSelected,
            //   'is-disabled': isDisabled
            },
            styleProps.className!,
            groupClassName!
          )
        }>
        {icon && cloneElement(
          icon, 
          {
            size: 'S',
            UNSAFE_className: classNames(
              styles,
              'spectrum-Icon', 
              icon.props.UNSAFE_className
            )
          }
        )}
        <span className={classNames(styles, 'spectrum-ActionButton-label')}>{children}</span>
        {/* {holdAffordance &&
          <CornerTriangle UNSAFE_className={classNames(styles, 'spectrum-ActionButton-hold')} />
        } */}
      </ElementType>
    </FocusRing>
  );
}

let _ActionButton = React.forwardRef(ActionButton);
export {_ActionButton as ActionButton};