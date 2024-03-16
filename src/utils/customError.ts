class CustomError extends Error {
	public statusCode: number;

	constructor(statusCode: number, message: string) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

export { CustomError };
