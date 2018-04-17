# Dat daemon client

## Installation

```
npm install dat-daemon-client
```

## Usage

```javascript
const Client = require('dat-daemon-client')
const client = await Client('ws://localhost:8477')

const dat = await client.add('/path/to/at')

const stream = await client.createWriteStream(a.key, path)
stream.write('test')
```

## API
