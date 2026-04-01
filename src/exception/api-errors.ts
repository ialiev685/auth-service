export class ApiError extends Error {
  code;
  errors;

  constructor(code: number, message: string, errors = []) {
    super(message);
    this.code = code;
    this.errors = errors;
  }

  static BadRequestError(message: string) {
    return new ApiError(400, message);
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }
}
