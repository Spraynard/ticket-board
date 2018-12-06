const fs = require('fs');
/**
 * Recursively goes through any number nested amount array and flattens it out to a single array
 */
export const flatten_arrays = arr => arr.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten_arrays(b) : b), []
);

const identity: any = x => x;

/**
 * Single Argument Pipe function used to apply function transforms to an argument.
 */
export const pipe: any = ( ...functions ) => functions.reduce(
	( acc, curr ) => x => curr( acc( x ) ), identity
);

export const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })