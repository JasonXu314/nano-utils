import { EventSrc } from '../src';

type ObjectArg = {
	str: string;
	num: number;
	bool: boolean;
};

interface TestEvents {
	TEST_EVENT: never;
	TEST_EVENT_WITH_SIMPLE_ARG: string;
	TEST_EVENT_WITH_OBJECT_ARG: ObjectArg;
}

describe('Main test suite', () => {
	it('Should construct properly', () => {
		const evtSrc = new EventSrc<TestEvents>();

		expect(evtSrc).toBeDefined();
	});

	it('Should attach and detatch event listeners properly', () => {
		const evtSrc = new EventSrc<TestEvents>();
		const listener = jest.fn(() => {});

		const unsub = evtSrc.on('TEST_EVENT', listener);
		unsub();

		evtSrc.dispatch('TEST_EVENT');

		expect(listener).not.toHaveBeenCalled();
	});

	it('Should dispatch events properly', () => {
		const evtSrc = new EventSrc<TestEvents>();
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT', listener);

		evtSrc.dispatch('TEST_EVENT');

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it('Should gracefully ignore events for which no listeners have been registered', () => {
		const evtSrc = new EventSrc<TestEvents>();

		expect(() => {
			evtSrc.dispatch('TEST_EVENT');
		}).not.toThrow();
	});

	it('Should dispatch events with arguments properly', () => {
		const evtSrc = new EventSrc<TestEvents>();
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT_WITH_SIMPLE_ARG', listener);

		evtSrc.dispatch('TEST_EVENT_WITH_SIMPLE_ARG', 'test');

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith('test');
	});

	it('Should dispatch events with complex arguments properly', () => {
		const evtSrc = new EventSrc<TestEvents>();
		const listener = jest.fn(() => {});

		evtSrc.on('TEST_EVENT_WITH_OBJECT_ARG', listener);

		evtSrc.dispatch('TEST_EVENT_WITH_OBJECT_ARG', { str: 'test', num: 1, bool: true });

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith({ str: 'test', num: 1, bool: true });
	});

	it('Should wrap existing event sources properly', () => {
		const btn = document.createElement('button');
		const evtSrc = EventSrc.wrap<HTMLElementEventMap>(btn, ['click']);
		const listener = jest.fn(() => {});
		const evt = new Event('click');

		evtSrc.on('click', listener);

		btn.dispatchEvent(evt);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith(evt);
	});
});
