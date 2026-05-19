export class LocationUnavailableError extends Error {
  constructor(message = "현재 위치를 확인하지 못했어요. 브라우저 위치 권한을 허용한 뒤 다시 시도해주세요.") {
    super(message);
    this.name = "LocationUnavailableError";
  }
}

export function isLocationUnavailableError(error: unknown): error is LocationUnavailableError {
  return error instanceof LocationUnavailableError;
}
