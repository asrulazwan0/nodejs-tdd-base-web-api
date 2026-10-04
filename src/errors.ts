/** Expected failures with a stable, public API code. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const emailConflict = (): ApiError =>
  new ApiError(409, 'EMAIL_CONFLICT', 'Email already exists');
