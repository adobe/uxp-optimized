import React from "react";
import "./Header.css";

export default function Header(props) {
    const { children, updateItem, ...otherProps } = props;
    return <div className="Container_Header" {...otherProps}>{ children }</div>;
}
