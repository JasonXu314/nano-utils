/**
 * Logging module for fancier log messages
 */
export class Logger {
	/**
	 * Creates a logger with the given name
	 * @param name the name of this logger (could be the module the log messagesare coming from)
	 */
	constructor(private name: string) {}

	/**
	 * Logs a message to console
	 * @param message the main message to be logged
	 * @param args any other parts of the message
	 */
	public log(message: any, ...args: any[]): void {
		console.log(`[${this.name}]`, message, ...args);
	}

	/**
	 * Logs a message to console as an error
	 * @param message the main message to be logged
	 * @param args any other parts of the message
	 */
	public error(message: any, ...args: any[]): void {
		console.error(`[${this.name}]`, message, ...args);
	}

	/**
	 * Logs a message to console along with its stack trace
	 * @param message the main message to be logged
	 * @param args any other parts of the message
	 */
	public trace(message: any, ...args: any[]): void {
		console.trace(`[${this.name}]`, message, ...args);
	}

	/**
	 * Starts a timer with label ``label``
	 * @param label the label of the timer
	 */
	public time(label: string): void {
		console.time(`[${this.name}] ${label}`);
	}

	/**
	 * Ends the timer with label ``label`` and prints the output
	 * @param label the label of the timer
	 */
	public timeEnd(label: string): void {
		console.timeEnd(`[${this.name}] ${label}`);
	}

	/**
	 * Counts in the console the number of times this function is called with the given label
	 * @param label the display label for the counter
	 */
	public count(label?: string | undefined): void {
		console.count(label ? `[${this.name}] ${label}` : `[${this.name}]`);
	}

	/**
	 * Resets the counter corresponding to label
	 * @param label the display label for the counter
	 */
	public countReset(label?: string | undefined): void {
		console.countReset(label ? `[${this.name}] ${label}` : `[${this.name}]`);
	}

	/**
	 * Aseserts that the given condition is true, and if not, then dumps the data
	 * @param condition the condition being asserted
	 * @param data any data to dump upon false condition
	 */
	public assert(condition?: boolean | undefined, ...data: any[]): void {
		console.assert(condition, `[${this.name}]`, ...data);
	}
}
