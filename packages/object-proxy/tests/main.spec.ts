import { makeProxy } from '../src/index';

type Test1Obj = {
	foo: string;
};

type Test2Obj = {
	string: string;
	number: number;
	boolean: boolean;
	object: {
		foo: string;
	};
};

type Test3Obj = Test2Obj;

type Test4Obj = {
	nested: {
		property: string;
	};
};

type Test5Obj = Test4Obj;

describe('Main Test Suite', () => {
	it('Allows property access', () => {
		const obj: Test1Obj = { foo: 'bar' };

		const proxy = makeProxy(obj, () => {});

		expect(proxy).toMatchObject({ foo: 'bar' });
	});

	it('Allows property mutation', () => {
		const obj: Test2Obj = {
			string: 'string',
			number: 1,
			boolean: true,
			object: {
				foo: 'bar'
			}
		};

		const proxy = makeProxy(obj, () => {});

		proxy.string = 'hi';
		proxy.number = 0;
		proxy.boolean = false;
		proxy.object = {
			foo: 'baz'
		};

		expect(proxy).toMatchObject({ string: 'hi', number: 0, boolean: false, object: { foo: 'baz' } });
	});

	it('Notifies on property mutation', () => {
		const obj: Test3Obj = {
			string: 'string',
			number: 1,
			boolean: true,
			object: {
				foo: 'bar'
			}
		};

		const listener = jest.fn();

		const proxy = makeProxy(obj, listener);

		proxy.string = 'hi';
		proxy.number = 0;
		proxy.boolean = false;
		proxy.object = {
			foo: 'baz'
		};

		expect(listener).toHaveBeenCalledTimes(4);
		expect(listener).toHaveBeenNthCalledWith(1, 'string', 'hi', 'string');
		expect(listener).toHaveBeenNthCalledWith(2, 'number', 0, 1);
		expect(listener).toHaveBeenNthCalledWith(3, 'boolean', false, true);
		expect(listener).toHaveBeenNthCalledWith(4, 'object', { foo: 'baz' }, { foo: 'bar' });
	});

	it('Notifies on nested property mutation', () => {
		const obj: Test4Obj = {
			nested: {
				property: 'hi'
			}
		};

		const listener = jest.fn();

		const proxy = makeProxy(obj, listener);

		proxy.nested.property = 'foo';

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith('nested.property', 'foo', 'hi');
	});

	it('Notifies on nested property mutation after nested object replacement', () => {
		const obj: Test5Obj = {
			nested: {
				property: 'hi'
			}
		};

		const listener = jest.fn();

		const proxy = makeProxy(obj, listener);

		proxy.nested = { property: 'foo' };

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith('nested', { property: 'foo' }, { property: 'hi' });

		proxy.nested.property = 'bar';

		expect(listener).toHaveBeenCalledTimes(2);
		expect(listener).toHaveBeenLastCalledWith('nested.property', 'bar', 'foo');
	});
});
