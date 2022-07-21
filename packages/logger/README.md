## Description

A dead simple logging library

## Installation

```
npm i @nano-utils/logger
```

or

```
yarn add @nano-utils/logger
```

## Usage

```js
import { Logger } from '@nano-utils/logger';

const logger = new Logger('My Logger');

logger.log('Hi'); // [My Logger] Hi
```

```js
import { Logger } from '@nano-utils/logger';

const logger = new Logger('My Logger');

logger.log(2, 'arguments'); // [My Logger] 2 arguments
```
