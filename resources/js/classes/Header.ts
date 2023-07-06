import React, {CSSProperties, ReactElement} from "react";
import {capitalizeFirstLetter} from "../utils/text/capitalize";

type Options = {
    className?: string,
    type?: HeaderType
    button?: ReactElement<{data: string}>,
    styles?: CSSProperties
}
export type HeaderType = 'button' | 'date';

export class Header {
    public name: string;
    public key: string;
    public type?: HeaderType;
    public className?: string|null;
    public button?: ReactElement | Element|null;
    public styles?: CSSProperties

    constructor(name: string, key: string, options: Options = {}) {
        this.name = capitalizeFirstLetter(name);
        this.key = key;
        this.type = options.type ?? null;
        if(options.className) this.className = options.className;
        if(options.type === 'button') this.button = options.button;
        if(options.styles) this.styles = options.styles;
    }
}