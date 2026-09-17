export class SisterApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly safeCode: string,
    message = "SISTER request failed",
  ) {
    super(message);
    this.name = "SisterApiError";
  }
}

export class SisterContractError extends Error {
  constructor(message = "SISTER response does not match the documented contract") {
    super(message);
    this.name = "SisterContractError";
  }
}

export class SisterNotFoundError extends Error {
  constructor(message = "SISTER resource was not found") {
    super(message);
    this.name = "SisterNotFoundError";
  }
}
