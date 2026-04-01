export class ApiError<T> extends Error {
  code;
  errors;

  constructor(code: number, message: string, errors?: T[]) {
    super(message);
    this.code = code;
    this.errors = errors;
  }

  static BadRequestError<T>(message: string, errors?: T[]) {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }
}
