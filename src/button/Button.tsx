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
import {FocusableRef} from '@react-types/shared';
import {FocusRing} from '@react-aria/focus';
import React, {cloneElement} from 'react';
import {SpectrumButtonProps} from '@react-types/button';
import styles from '@adobe/spectrum-css/dist/components/button/vars.css';
import {useButton} from '@react-aria/button';
import {useProviderProps} from '@react-spectrum/provider';

// todo: CSS hasn't caught up yet, map
let VARIANT_MAPPING = {
  negative: 'warning'
};

function Button(props: SpectrumButtonProps, ref: FocusableRef) {
  props = useProviderProps(props);
  let {
    elementType: ElementType = 'sp-button', // uxp
    children,
    variant,
    isQuiet,
    isDisabled,
    icon,
    autoFocus,
    ...otherProps
  } = props;
  let domRef = useFocusableRef(ref);
  let {buttonProps, isPressed} = useButton(props, domRef);
  let {styleProps} = useStyleProps(otherProps);

  let buttonVariant = variant;
  if (VARIANT_MAPPING[variant]) {
    buttonVariant = VARIANT_MAPPING[variant];
  }

  return (
    <FocusRing focusRingClass={classNames(styles, 'focus-ring')} autoFocus={autoFocus}>
      <ElementType
        {...filterDOMProps(otherProps)}
        {...styleProps}
        {...buttonProps}
        ref={ domRef }
        quiet={ isQuiet }   //  uxp
        variant={ variant } //  uxp
        className={
          classNames(
            styles,
            'spectrum-Button',
            `spectrum-Button--${buttonVariant}`,
            {
              'spectrum-Button--quiet': isQuiet,
              'is-disabled': isDisabled,
              'is-active': isPressed
            },
            (styleProps as any).className
          )
        }>
        {icon && cloneElement(
          icon,
          {
            size: 'S',
            UNSAFE_className: classNames(
              styles,
              'spectrum-Icon',
              icon.props && icon.props.UNSAFE_className
            )
          }
        )}
        <span className={classNames(styles, 'spectrum-Button-label')}>{children}</span>
      </ElementType>
    </FocusRing>
  );
}

/**
 * Buttons allow users to perform an action or to navigate to another page.
 * They have multiple styles for various needs, and are ideal for calling attention to
 * where a user needs to do something in order to move forward in a flow.
 */
let _Button = React.forwardRef(Button);
export {_Button as Button};