/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import React from "react";
import { Provider } from "@react-spectrum/provider";
import { theme } from '@react-spectrum/theme-default';
import { Button, ActionButton, ClearButton } from "../../react-spectrum/button";
import { Checkbox } from "../../react-spectrum/checkbox";

export default function ReactSpectrum(props) {
    return <div>
        <Provider theme={ theme }>
            <Button variant="primary">Primary Button</Button>
            <ActionButton>Action Button</ActionButton>
            <label>
                Clear Button
                <ClearButton></ClearButton>
            </label>
            <Checkbox>Checkbox</Checkbox>
        </Provider>
    </div>
}
