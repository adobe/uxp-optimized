import React from "react";
import "./Icon.css";

export default function Icon(props) {
    const { image, updateItem, ...otherProps } = props;
    return <img className="Container_Icon" src={ image } {...otherProps}></img>;
}
