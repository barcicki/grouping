# Grouping

Grouping is a simple library for grouping items. It can be used e.g. for randomly pairing players with each other or dividing teams into groups.

## Installation

For Node / NPM-based projects: `npm install grouping` (add `-g` for CLI).
For browsers: use NPM and [webpack](https://webpack.github.io/) or [browserify](http://browserify.org).

Note: the library is written in ES2015 so it will be supported only by latest versions of Node.js and browsers.

## Examples use cases

### Pairing players

```js
const grouping = require('grouping');
const players = ['Player A', 'Player B', 'Player C', 'Player D'];

grouping.group(players); // [['Player A', 'Player C'], ['Player D', 'Player B']]
```

### Dividing teams

```js
const grouping = require('grouping');
const teams = Array.from({ length: 16 }, (x, i) => `Team ${i+1}`);

grouping.group(teams, { maxGroupSize: 4 }); // [['Team 11', 'Team 3', 'Team 5', 'Team 7'], [...]]
```

### Teaming up players from two baskets (DYP)

```js
const grouping = require('grouping');
const players = {
    strong: ['Player A', 'Player B', 'Player C', 'Player D'],
    notThatStrong: ['Player E', 'Player F', 'Player G', 'Player H']; 
} 

grouping.group(players); // [['Player B', 'Player F'], ['Player C', 'Player H'], ...]
```

## CLI

The library comes with command line interface that supports YAML files.
Remember to install `grouping` with `-g` flag to take advantage of this feature.

Sample input YAML file:

```yaml
- Player A
- Player B
- Player C
- Player D 
```

Usage:

```bash
group-items --input players.yml --output pairing.yml
```

Output:

```yaml
- - Player B
  - Player D
- - Player A
  - Player C
```

Run `group-items help` for details.

## [License](LICENSE)