/**
 * brailleMap.js
 * Maps English alphanumeric characters to Unicode Braille patterns.
 */
const BRAILLE_MAP = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠇', 'l': '⠸', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
    '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔', '0': '⠴',
    ' ': ' ', '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', '-': '⠤'
};

export const convertToBraille = (text) => {
    if (!text) return '';
    return text.toLowerCase().split('').map(char => BRAILLE_MAP[char] || '').join('');
};
