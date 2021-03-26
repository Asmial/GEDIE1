import { resolve } from 'path';

export const entry = './js/index.js';
export const mode = 'development';
export const watch = true;
export const output = {
    filename: 'bundle.js',
    path: resolve(__dirname, 'html/bundle')
};