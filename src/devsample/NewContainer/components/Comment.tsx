import React, { useState } from "react";
import "./Comment.css";

export default function Comment(props) {
    const { children, ...otherProps } = props;
    return <div
        className="Container_Comment"
        {...otherProps}
    >{children}</div>;
}
