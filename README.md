After wiring together a basic Connect 4 game over my first weekend at General Assembly, I discovered that the code I had written was pretty brittle. The state lived everywhere at once, and the logic only worked because of shims inserted here and there. In other words, it was impossible to debug intelligently.

For this project, I decided to apply some concepts from Elm and Redux: the Model-View-Update pattern, strongly typed data, and immutability.

Type is implemented using Typescript, and immutability is implemented using Immutabile.js. The Immutable.js documentation is written with Typescript in mind, but it seems pitched at someone who is some weeks further along in JS knowledge than I have. Thus, getting the TS ad I.js to play well together has been a major challenge.

In order to keep myself sane, inside functions, arrays and objects are mutable, but to preserve the benefits of immutability, return values are immutable.

The model is made up of two parts: 1. A board map which shows which tiles the fox and geese may be on the board, and what directions may be taken from each active tile. 2. A state object which tracks who won, whose turn, where the fox and geese are on the board, and

The view function is very simpplistic. It removes all of the pieces from the view and places the pieces from scratch. In future development, I plan to use React or some other library to perform DOM diffing. Here, the DOM is not particularly complicated.

This is the source of the cute foxk, geese, and grass SVGs:

http://thecraftchop.com/entries/svg/fox

https://commons.wikimedia.org/wiki/File:BarnacleGoose_svg_element.svg

https://pixabay.com/en/grass-landscape-wallpaper-37305/
