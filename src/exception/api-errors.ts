export class ApiError extends Error {
  code;
  errors;

  constructor(code: number, message: string, errors = []) {
    super(message);
    this.code = code;
    this.errors = errors;
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }

  static Unauthorized(message: string) {
    return new ApiError(401, message);
  }
}
