import { readFileSync, writeFileSync } from 'fs';
import { array, boolean, number, object, string } from 'yup';
import { importJSON, requireJSON } from '../src/index';

type Test1Obj = {
	key: string;
};

type Test2Obj = {
	number: number;
	string: string;
	boolean: boolean;
};

type Test3Obj = {
	key: string;
	other: string;
};

type Test4Obj = {
	deeply: { nested: string };
	other: string;
};

type Test5Obj = {
	arr: number[];
};

const test1Obj = { key: 'value' };
const test2Obj = { number: 1, string: 'value', boolean: true };
const test3Obj = { key: 'value', other: 'value' };
const test4Obj = { deeply: { nested: 'property' }, other: 'value' };
const test5Obj = { arr: [1, 2, 3] };

beforeAll(() => {
	writeFileSync('1.json', JSON.stringify(test1Obj, null, 4));
	writeFileSync('2.json', JSON.stringify(test2Obj, null, 4));
	writeFileSync('3.json', JSON.stringify(test3Obj, null, 4));
	writeFileSync('4.json', JSON.stringify(test4Obj, null, 4));
	writeFileSync('5.json', JSON.stringify(test5Obj, null, 4));
});

const fileSystem = new Map<string, string>();

jest.mock('fs', () => ({
	__esModule: true,
	readFileSync: (name: string) => {
		return fileSystem.get(name);
	},
	writeFileSync: (name: string, contents: string) => {
		fileSystem.set(name, contents);
	}
}));

describe('Main Test Suite', () => {
	it('Reads from a file correctly', () => {
		const jsonObj1 = importJSON<Test1Obj>('1.json');
		const jsonObj2 = requireJSON<Test1Obj>('1.json');

		expect(jsonObj1).toMatchObject(test1Obj);
		expect(jsonObj2).toMatchObject(test1Obj);
	});

	it('Checks types correctly', () => {
		expect(() => {
			const jsonObj = importJSON<Test2Obj>(
				'2.json',
				object({
					number: number().required(),
					string: string().required(),
					boolean: boolean().strict().required()
				})
			);

			expect(jsonObj).toMatchObject(test2Obj);
		}).not.toThrow();
		expect(() => {
			const jsonObj = importJSON<Test2Obj>(
				'2.json',
				// @ts-expect-error
				object({
					number: number().required(),
					string: string().required(),
					boolean: string().strict().required()
				})
			);

			expect(jsonObj).toMatchObject(test2Obj);
		}).toThrow();
	});

	it('Modifies file correctly', () => {
		const jsonObj = importJSON<Test3Obj>(
			'3.json',
			object({
				key: string().required(),
				other: string().required()
			})
		);

		expect(jsonObj).toMatchObject(test3Obj);

		jsonObj.key = 'value 2';
		test3Obj.key = 'value 2';

		const newJSON = JSON.parse(readFileSync('3.json').toString()) as Test3Obj;

		expect(newJSON).toEqual(test3Obj);
	});

	it('Modifies nested properties correctly', () => {
		const jsonObj = importJSON<Test4Obj>(
			'4.json',
			object({
				deeply: object({
					nested: string().required()
				}).required(),
				other: string().required()
			})
		);

		expect(jsonObj).toMatchObject(test4Obj);

		jsonObj.deeply.nested = 'stuff';
		test4Obj.deeply.nested = 'stuff';

		const newJSON = JSON.parse(readFileSync('4.json').toString()) as Test4Obj;

		expect(newJSON).toMatchObject(test4Obj);
	});

	it('Modifies arrays', () => {
		const jsonObj = importJSON<Test5Obj>('5.json', object({ arr: array(number().required()).required() }));

		expect(jsonObj).toMatchObject(test5Obj);

		jsonObj.arr[0] = 2;
		test5Obj.arr[0] = 2;

		const newJSON = JSON.parse(readFileSync('5.json').toString()) as Test5Obj;

		expect(newJSON).toMatchObject(test5Obj);
	});
});
