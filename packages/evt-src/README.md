## Description

A lightweight event source library inspired by the nanoevents library

## Installation

```
npm i @nano-utils/event-src
```

or

```
yarn add @nano-utils/event-src
```

## Usage

```js
import { EventSrc } from '@nano-utils/event-src';

const src = new EventSrc();

src.on('MY_EVENT', (evt) => {
	console.log(`Foo: ${evt.foo}`);
});

src.dispatch('MY_EVENT', { foo: 'bar' }); // Foo: bar
```

This package comes fully typed:

```ts
import { EventSrc } from '@nano-utils/event-src';

type Events = {
	MY_EVENT: [{ foo: string }];
};

const src = new EventSrc<Events>();

src.on('MY_EVENT', (evt) => {
	console.log(`Foo: ${evt.foo}`);
});

src.dispatch('MY_EVENT', { foo: 'baz' }); // Foo: baz
```

The type `Events` may also be declared as an interface:

```ts
import { EventSrc } from '@nano-utils/event-src';

interface Events {
	MY_EVENT: [{ foo: string }];
}

const src = new EventSrc<Events>();

src.on('MY_EVENT', (evt) => {
	console.log(`Foo: ${evt.foo}`);
});

src.dispatch('MY_EVENT', { foo: 'fizz' }); // Foo: fizz
```

## EventSrc.wrap

EventSrc may also be used to "wrap" existing event sources with an addEventListener method (ie. DOM Elements). An array of the underlying events to listen to must be passed in.

```ts
import { EventSrc } from '@nano-utils/event-src';

const btn = document.getElementById<HTMLButtonElement>('my-btn');

const src = EventSrc.wrap<HTMLElementEventMap>(btn, 'click');

src.on('click', (evt) => console.log(evt));
```

## Usage Notes:

-   All listeners for each event are run synchronously, in the order in which they are added
