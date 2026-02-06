import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    size?: number | string;
    fill?: boolean;
}

export function Icon({ name, size = 24, fill = false, className, style, ...props }: IconProps) {
    return (
        <span
            className={`material-symbols-outlined select-none ${className || ""}`}
            style={{
                fontSize: size,
                fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0",
                ...style,
            }}
            {...props}
        >
            {name}
        </span>
    );
}
