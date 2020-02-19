import React, { useState } from "react";
import "./Comment.css";

export default function Comment(props) {
    const { item, updateItem, ...otherProps } = props;
    const [editing, setEditing] = useState(false);
        return <div
            className="Comment"
            onClick={e => {
                if (!editing) {
                    setEditing(!editing);
                }
            }}
            {...otherProps}
        >
            {
                !editing ? item.text : <input
                    type="text"
                    autoFocus
                    defaultValue={item.text}
                    onKeyDown={e => {
                        if (e.key === "Escape") {
                            setEditing(false);
                        }
                        if (e.key === "Enter") {
                            updateItem(item, { text: (e.target as any).value })
                            setEditing(false);
                        }
                    }}
                />
            }
        </div>;
}
