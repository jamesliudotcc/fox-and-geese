# Fox and Geese

Fox and Geese is a classic assymetric board game in the
[tafl family](https://en.wikipedia.org/wiki/Tafl_games). The
animals only move along the lines drawn on the board. Some squares
allow diagonal moves but others do not. The fox can move one square or
jump a goose in any allowed direction. The fox can jump only one goose at
a time, but can continue jumping geese in its turn as long as a jump is
possible. The geese can only move one square. Since the fox can only jump
over a single goose, a goose with another goose behind it is safe from
jumping. The geese win by trapping the fox. The fox wins when there are
four or fewer geese (and so the fox can no longer be trapped).

Since it is an ancient game, there are many variations on fox and geese. Here is one [example](https://www.whatdowedoallday.com/fox-and-geese/). Future versions may have alternate rules-sets as options.

## Motivations for code choices

After wiring together a basic Connect 4 game over my first weekend at General Assembly, I discovered that the code I had written was pretty brittle. The state lived everywhere at once, and the logic only worked because of shims inserted here and there. In other words, it was impossible to debug intelligently.

For this project, I decided to apply some concepts from Elm and Redux: the Model-View-View-Update pattern, strongly typed data, and immutability.

Type is implemented using Typescript, and immutability is implemented using Immutabile.js. The Immutable.js documentation is written with Typescript in mind, but it seems pitched at someone who is some weeks further along in JS knowledge than I have. Thus, getting the TS ad I.js to play well together has been a major challenge. It turns out, I am not [the](https://www.reddit.com/r/reactjs/comments/7mfaxy/it_aint_pretty_typescript/) [only](https://blog.mgechev.com/2018/01/18/react-typescript-redux-immutable/) [one](https://themapguyde.blogspot.com/2018/03/making-immutablejs-objects-easier-to.html) have this problem.

All of the solutions I found would take too long to implement for a week-long project, for example, [this](https://medium.com/@alexxgent/enforcing-types-with-immutablejs-and-typescript-6ab980819b6a). Also, when I was researching another Typescript feature, I discovered that it is possible to declare properties of objects and arrays as read-only. So, Immutable.js was probably not needed at all.

In order to keep myself sane, inside functions, arrays and objects are mutable, but to preserve the benefits of immutability, return values are immutable. Making everything immutable can be a refactoring project for later. Or I can just implement this in Elm.

The model is made up of two parts: 1. A board map which shows which tiles the fox and geese may be on the board, and what directions may be taken from each active tile. 2. A state object which tracks who won, whose turn, where the fox and geese are on the board, and anything else that may change during the game.

The view-update function is very simpplistic. It removes all of the pieces from the view and places the pieces from scratch. In future development, I may use React or some other library to perform DOM diffing. Here, the DOM is not particularly complicated.

I chose not to have sounds. As it turns out, foxes sound like screeching seaguls? And George Clooney's voice as a fox ("VaaF") is subject to copyright. Geese sounds are also not cute.

## Typescript

Refactoring is much easier using Typescript. For example, I wanted to add a new property to the messageToUpdate function, so I added it to the type declaration and to the object at one point in the code. The compiler hunted down all the other instances so I could be sure to pass on sensible values at each point in the program. This is as they say in the podcasts about strong type systems: you refactor by making changes and chasing down all of the compiler errors.

This is the source of the cute foxk, geese, and grass SVGs:

http://thecraftchop.com/entries/svg/fox

https://commons.wikimedia.org/wiki/File:BarnacleGoose_svg_element.svg

https://pixabay.com/en/grass-landscape-wallpaper-37305/

I still need to implement this polyfill for [touchscreens](https://github.com/timruffles/mobile-drag-drop).
