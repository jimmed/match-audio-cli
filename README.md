# Match Audio API/CLI

> A command line interface for [match.audio][matchaudio]

## Usage

### Installation

Not published to NPM yet. Install as:

```
yarn add github:jimmed/match-audio-cli.git

// or

npm install github:jimmed/match-audio-cli.git
```

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
