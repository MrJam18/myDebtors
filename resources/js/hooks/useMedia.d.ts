/**
 *  media query hook using Javascript
 * @param {string} mediaQuery  media query. Example: 'max-width: 900px'.
 * @param {object} styles styles which applied when media query match;
 * @param {function} setStyles function(set state) which change styles.
 * @param {object} defaultStyles styles which applied when media query don't match;
 */
export declare const useMedia: (mediaQuery: any, styles: any, setStyles: any, defaultStyles?: any) => void;
