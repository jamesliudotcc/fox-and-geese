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

There is a cheat mode that I made in order to test the end of the game. It is not particularly well-hidden. If you decide to cheat, that is on you.

## Motivations for code choices

After wiring together a basic Connect 4 game over my first weekend at General Assembly, I discovered that the code I had written was pretty brittle. The state lived everywhere at once, and the logic only worked because of shims inserted here and there. In other words, it was impossible to debug intelligently.

For this project, I decided to apply some concepts from Elm and Redux: the [Model-Update-View pattern]:(https://guide.elm-lang.org/architecture/), strongly typed data, and immutability. Before starting the design of the state machine, I watched a few videos from [Dan Abramov's Redux tutorial](https://egghead.io/courses/getting-started-with-redux) in order to get a better idea of how to work with state.

Type is implemented using Typescript, and immutability is implemented using Immutabile.js. The Immutable.js documentation is written with Typescript in mind, but it seems pitched at someone who is some weeks further along in JS knowledge than I have. Thus, getting the TS ad I.js to play well together has been a major challenge. It turns out, I am not [the](https://www.reddit.com/r/reactjs/comments/7mfaxy/it_aint_pretty_typescript/) [only](https://blog.mgechev.com/2018/01/18/react-typescript-redux-immutable/) [one](https://themapguyde.blogspot.com/2018/03/making-immutablejs-objects-easier-to.html) have this problem.

All of the solutions I found would take too long to implement for a week-long project, for example, [this](https://medium.com/@alexxgent/enforcing-types-with-immutablejs-and-typescript-6ab980819b6a). Also, when I was researching another Typescript feature, I discovered that it is possible to declare properties of objects and arrays as read-only. So, Immutable.js was probably not needed at all.

In order to keep myself sane, inside functions, arrays and objects are mutable, but to preserve the benefits of immutability, return values are immutable. Making everything immutable can be a refactoring project for later. Or I can just implement this in Elm.

Also, I chose to do this without jQuery. At this point, the better familiarity I have with vanilla JS DOM manipulation, the better.

### Model-Update-View

The main game.js file only listens for events and dispatches messages to the update function. The update function is made up of a series of if statements (which can eventually be turned into a single switch statement) which calls various functions inside of the update function. The message from the main file is passed as a single object, which in this project is only one layer deep. If more functionality is added, it will have to be an object of objects so that things can remain organized. The message to view is likewise a single object.

The model is made up of two parts: 1. A board map which shows which tiles the fox and geese may be on the board, and what directions may be taken from each active tile. 2. A state object which tracks who won, whose turn, where the fox and geese are on the board, and anything else that may change during the game. A piece being dragged over a tile is also handled though the update function.

The view-update function is very simple. It removes all of the pieces from the view and places the pieces from scratch. In future development, I may use React or some other library to perform DOM diffing. Here, the DOM is not particularly complicated.

## Conclusions about coding choices

### Immutable

Adding Immutable.js was a mistake. It makes the code less readable, and more difficult to reason about. Further, it did not really end up enforcing any constraints since I could break out of immutable at any time. Instead of spending my time and energy fighting the Immutable.js library, I could have spent it figuring out how to accomplish my tasks by having functions always return values, instead of creating and updating a state object for each turn.

I intend to pull out Immutable.js. If I really want immutability for a project, there are plenty of other choices that are more idiomatically Javascript.

### Typescript

Refactoring is much easier using Typescript. For example, I wanted to add a new property to the messageToUpdate function, so I added it to the type declaration and to the object at one point in the code. The compiler hunted down all the other instances so I could be sure to pass on sensible values at each point in the program. This is as they say in the podcasts about strong type systems: you refactor by making changes and chasing down all of the compiler errors.

Near the end of project week, I learned how to declare type interfaces separately from the object, and about optional properties for objects. This will make it much easier to change the message into a layered object. Each type of message can be declared to be an optional property of the message object, and within the message, there can be a mix of required and optional properties. That way, the compiler can ensure that everything required from the message is provided by whatever is passing the function.

Typescript is also much better at catching typos, such as, "Foo is not a function, did you mean food?" Yes, of course, I am always thinking about food.

Also, since Typescript knows the shape of the object I am working with, it can provide better hints to my editor about the properties I can work with.

## The Challenges

### Still with the flying spaghetti code monster

Somewhere in the middle of the week, I realized I was having trouble reasoning about my code. Sure, I had the model, update, and view separated, but none of those functions were well organized. It took the better part of a day to refactor to get the code better organized. That exercise finally solidified how to extract logic into functions. Now, looking back, I have a much better idea of what I should do to pass data into and out of functions in order to avoid mutating global state (well, regional, but update is a big region). That is a goal I have for moving forward.

The second big refactor took place on Saturday. On Friday, I discovered I could not get a reset button working because the board setup function was so poorly organized. Unlike the update function, I had not refactored it yet. And worse, it was older code because I needed a board and a game set up initially so that I could test whether the update code worked. But as long as I was going to rip that code out, I used it as an opportunity to reuse the update functions for calculating the legal moves and setting pieces on the board. The process was pretty easy because the architecture made it very clear what needed to be done: a message with the starting state needed to be passed to the updater, where an if statement caught it and composed the correct functions to get the right result.

### Fighting the mouse

Mouse events turn out to be difficult. At first after getting the drag functionality initially working, it was hard to hit the target when the animals were dropped onto squares. It turned out that the problem was that only the squares were listening for a drop, not the children, so the SVG lines were not valid targets. Then I tried to have the squares highlight when an animal hovered over it, and discovered a way to fix this issue.

I also tried to implement a feature where picking up an animal would highlight what moves are legal. This worked, but I could not find a good way to turn off the highlighting. They were like the pheremone trails in Sim Ant, except they never went away. Mouseover works well, but mouseout is flaky, so that turned out not to be a solution. I also ran into trouble trying to use dragstart and dragend to control when the highlighting would turn on. It was even a real struggle getting the highlighting for the animal being dragged around to turn on and off correctly, and for that, the tile being highlighted knows that it is highlighted. I can solve this, but it will have to wait until after I reorganize the object for passing messages to state.

I would not be surprised if developers generally use libraries to deal with common mouse interactions.

## Images

I chose to use SVGs as my graphics in order to make the game scale well to all screen sizes and in order to have a minimal footprint. This was done with mobile in mind, although it turns out that mobile-device touch controls do not work with mouse events.

This is the source of the cute fox and goose SVGs:

http://thecraftchop.com/entries/svg/fox

https://commons.wikimedia.org/wiki/File:BarnacleGoose_svg_element.svg

I chose not to have sounds. As it turns out, foxes sound like screeching seaguls? And George Clooney's voice as a fox ("VaaF") is subject to copyright. Geese sounds are also not cute.

I still need to implement this polyfill for [touchscreens](https://github.com/timruffles/mobile-drag-drop).
