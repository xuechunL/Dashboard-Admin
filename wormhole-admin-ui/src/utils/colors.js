// import $ from 'jquery'

// Color related utility functions go in this object
export const bnbColors = [
  '#ff5a5f', // rausch
  '#7b0051', // hackb
  '#007A87', // kazan
  '#00d1c1', // babu
  '#8ce071', // lima
  '#ffb400', // beach
  '#b4a76c', // barol
  '#ff8083',
  '#cc0086',
  '#00a1b3',
  '#00ffeb',
  '#bbedab',
  '#ffd266',
  '#cbc29a',
  '#ff3339',
  '#ff1ab1',
  '#005c66',
  '#00b3a5',
  '#55d12e',
  '#b37e00',
  '#988b4e',
]

// const spectrums = {
//   blue_white_yellow: [
//     '#00d1c1',
//     'white',
//     '#ffb400',
//   ],
//   fire: [
//     'white',
//     'yellow',
//     'red',
//     'black',
//   ],
//   white_black: [
//     'white',
//     'black',
//   ],
//   black_white: [
//     'black',
//     'white',
//   ],
// }

export const category21 = (function () {
  // Color factory
  const seen = {}
  return function (s) {
    if (!s) {
      return
    }
    let stringifyS = String(s)
    // next line is for superset series that should have the same color
    stringifyS = stringifyS.replace('---', '')
    if (seen[stringifyS] === undefined) {
      seen[stringifyS] = Object.keys(seen).length
    }
    /* eslint consistent-return: 0 */
    return bnbColors[seen[stringifyS] % bnbColors.length]
  }
}())
