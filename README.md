# Match Audio API/CLI

> A command line interface for [match.audio][matchaudio]

## Usage

### Installation

This library is available from the NPM registry, using a compatible package manager such as NPM or yarn:

```
$ yarn [global] add match.audio
```

or

```
$ npm install match.audio [--global]
```

Perform a global installation in order to use the command-line tool.

### Command-line

Once installed, you can use `match` from the command-line to resolve song URLs:

```
Usage:
$ match [song URL]

Example:
$ match "https://play.google.com/music/m/Ts7e5ymntbh5dewmqxb3lvsgtqa"
```

If a URL exists in the clipboard, it will be used instead of the command line argument.

### Node.js API

```
const matchAudio = require('match-audio');

match(songUrl).then(console.log, console.error);
```

[matchaudio]: https://match.audio
