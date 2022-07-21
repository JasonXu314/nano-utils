## Description

A library to make changes to objects imported from JSON files reflected in the file

## Installation

```
npm i @nano-utils/json-import
```

or

```
yarn add @nano-utils/json-import
```

## Usage

```js
import { importJSON } from '@nano-utils/json-import';

/** data.json
 * 	{
 * 		"foo": "bar"
 * 	}
 */
const obj = importJSON('./data.json');

console.log(obj); // { foo: 'bar' }
```

This package comes fully typed:

```ts
import { importJSON } from '@nano-utils/json-import';

type MyObject = {
	foo: string;
};

/** data.json
 * 	{
 * 		"foo": "bar"
 * 	}
 */
const obj: MyObject = importJSON<MyObject>('./data.json');

console.log(obj); // { foo: 'bar' }
```

Pass in a template object to enable type validation:

```ts
import { importJSON, Types, Obj, ObjectModel } from '@nano-utils/json-import';

type MyObject = {
	foo: string;
};

const template: Obj<ObjectModel<MyObject>> = Types.OBJECT({
	foo: Types.STRING;
});

/** data.json
 * 	{
 * 		"foo": "bar"
 * 	}
 */
const obj: MyObject = importJSON<MyObject>('./data.json', template);

console.log(obj); // { foo: 'bar' }
```

JS:

```js
import { importJSON, Types } from '@nano-utils/json-import';

const template = Types.OBJECT({
	foo: Types.STRING;
});

/** data.json
 * 	{
 * 		"foo": "bar"
 * 	}
 */
const obj = importJSON('./data.json', template);

console.log(obj); // { foo: 'bar' }
```

## Usage Notes:

-   `requireJSON` is equivalent to `importJSON`
