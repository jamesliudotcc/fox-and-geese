// //@ts-ignore
// .forEach(a => {
//   document.getElementById(String(a)).classList.add('light-foxy');
// });

// if (message.tileMouseOver) {
//   const legalMoves = currentState
//     .get('legalMoves')
//     //@ts-ignore
//     .filter(a => a[0] === Number(message.tileMouseOver))
//     //@ts-ignore
//     .map(a => a[1]);

//   const legalJumps = currentState
//     .get('legalJumps')
//     //@ts-ignore
//     .filter(a => a[0] === Number(message.tileMouseOver))
//     //@ts-ignore
//     .map(a => a[1]);
//   newState.moveSuggest = legalMoves.concat(legalJumps);
//   return fromJS(newState);
// }

// if (message.tileMouseOut) {
//   console.log('Implement clearing pickup shadow');
//   newState.clearSuggestions = true;
//   return fromJS(newState);
// }
