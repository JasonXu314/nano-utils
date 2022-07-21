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

We support using the [`yup`](https://www.npmjs.com/package/yup) library to perform validation:

```ts
import { importJSON } from '@nano-utils/json-import';
import { object, string } from 'yup';

type MyObject = {
	foo: string;
};

const schema = object({
	foo: string()
});

/** data.json
 * 	{
 * 		"foo": "bar"
 * 	}
 */
const obj: MyObject = importJSON<MyObject>('./data.json', schema);

console.log(obj); // { foo: 'bar' }
```

## Usage Notes:

-   When working with arrays, make sure to always assign values, do not use methods such as `push` or `splice`. Otherwise, the underlying proxy will not detect your changes.
-   When validating with `yup`, it is recommended to use strict mode for your types, otherwise you may run into type coercion issues (see [here](https://github.com/jquense/yup/issues/54) for more information.)
-   `requireJSON` is equivalent to `importJSON`
