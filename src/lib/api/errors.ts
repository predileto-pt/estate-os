export class ApiError extends Error {
  status: number;
  validationErrors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    validationErrors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export async function parseApiError(res: Response): Promise<ApiError> {
  let text: string;
  try {
    text = await res.text();
  } catch {
    return new ApiError(`HTTP ${res.status}`, res.status);
  }

  try {
    const json = JSON.parse(text);

    // FastAPI HTTPValidationError format
    if (json.detail && Array.isArray(json.detail)) {
      const validationErrors = json.detail.map(
        (d: { loc: (string | number)[]; msg: string }) => ({
          field: d.loc
            .filter((l): l is string => typeof l === "string" && l !== "body")
            .join("."),
          message: d.msg,
        }),
      );
      return new ApiError(
        formatValidationErrors(validationErrors),
        res.status,
        validationErrors,
      );
    }

    return new ApiError(json.detail || json.message || text, res.status);
  } catch {
    return new ApiError(text || `HTTP ${res.status}`, res.status);
  }
}

export function formatValidationErrors(
  errors: Array<{ field: string; message: string }>,
): string {
  return errors.map((e) => `${e.field}: ${e.message}`).join("; ");
}
