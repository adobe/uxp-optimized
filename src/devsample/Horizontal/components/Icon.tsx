import React from "react";
import "./Icon.css";

export default function Icon(props) {
    const { item, updateItem, ...otherProps } = props;
    return <img className="Horizontal_Icon" src={ item.image } {...otherProps}></img>;
}
