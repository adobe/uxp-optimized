import React from "react";
import "./Header.css";

export default function Header(props) {
    const { item, updateItem, ...otherProps } = props;
    return <div className="Horizontal_Header" {...otherProps}>{ item.text }</div>;
}
