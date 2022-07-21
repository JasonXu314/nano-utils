## Description

A small library to make object proxying easier

## Installation

```
npm i @nano-utils/object-proxy
```

or

```
yarn add @nano-utils/object-proxy
```

## Usage

The `makeProxy` function creates a proxy object, which will call the supplied listener upon property changes with the property's path (delimited by `.`), the new value of the property, and the old value of the property

```js
import { makeProxy } from '@nano-utils/object-proxy';

const obj = { foo: 'bar' };

const proxy = makeProxy(obj, (prop, newValue, oldValue) => console.log(prop, newValue, oldValue));

proxy.foo = 'baz'; // foo baz bar
```

This package comes fully typed:

```ts
import { makeProxy } from '@nano-utils/object-proxy';

type MyObject = {
	foo: string;
};

const obj: MyObject = { foo: 'bar' };

const proxy = makeProxy<MyObject>(obj, (prop, newValue, oldValue) => console.log(prop, newValue, oldValue));

proxy.foo = 'baz'; // foo baz bar
```
