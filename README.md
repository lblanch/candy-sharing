# Candy Sharing Game

This is a Javascript based candy crush type game. It was a hobby project I created to explore the newest additions to the ECMAScript standard, as it had been a while since I programmed in Javascript. 

It purposely doesn't use any framework, or file bundler, to keep things focused on the original practice goal (although I will probably use a bundler at some point).

I got the inspiration to make a game after finishing Chris DeLeon's Udemy course [How to Program Games: Tile Classics in JS for HTML5 Canvas](https://www.udemy.com/course/how-to-program-games/). The game itself doesn't make a lot of sense as I didn't spend much time on game design: my main interest was to dwelve further into the core aspects of game programming (game loop, animations, collisions).

I didn't do any of the art or assets of the game, you can find the original artists and links to their work below in the **Assets** section.

## Installation

If you simply want to play the game, its latest version is playable [here](http://lblanch.com/games/candy).

Otherwise, just download the files and locate them in your server. If you want to execute it locally, you will need to use a local server. A couple of easy options I have used are [Python's http.server](https://docs.python.org/3.9/library/http.server.html#http-server-cli) and [Visual Studio Code's extension Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

## How to play

You and your friend just bought candy bags! Eat and exchange candies with your buddy in order to make as many points as you can. 

![Gameplay example](http://lblanch.com/games/candy/gameplay.gif)

Points are awarded for each candy you click on, and any candy of the same flavour adjacent to the one you selected will be taken at the same time, and will award you with extra points! 
You will also get extra points by eating candies of your favourite flavour, and if you click on a candy with your friend's favourite flavour, you'll automatically send it to them. Make sure to keep them happy by sending candies their way often, so they will send you more candies of your favourite flavour too!


## Assets & third party libraries

I didn't do any of the art, instead, I used free and public domain assets. Below are the links to the original assets and their authors:
* Candies: https://opengameart.org/content/candy-pack-1
* Tiles: https://free-game-assets.itch.io/free-match-3-game-assets
* Background image: https://free-game-assets.itch.io/free-parallax-2d-backgrounds
* Friend character: https://ossus.itch.io/iris

This project also uses the [gettex.js](https://github.com/guillaumepotier/gettext.js) library to implement the support for different languages.

I'm grateful to all the authors who made their work available for others to use for free! Thank you! :)

## License
[MIT](https://choosealicense.com/licenses/mit/)