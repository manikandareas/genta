import { toast } from "sonner";

/**
 * Field-level error from API validation
 */
export interface FieldError {
  field: string;
  error: string;
}

/**
 * Action to be taken on error (e.g., redirect)
 */
export interface ApiAction {
  type: "redirect";
  message: string;
  value: string;
}

/**
 * Standard API error response structure
 * Matches backend HTTPError structure
 */
export interface ApiError {
  code: string;
  message: string;
  status: number;
  errors?: FieldError[];
  action?: ApiAction;
}

/**
 * Result of handling an API error
 */
export interface ErrorHandlerResult {
  /** Field-level validation errors for form display */
  fieldErrors?: Record<string, string>;
  /** Whether the error was handled (e.g., redirect occurred) */
  handled: boolean;
  /** The original error for further processing */
  error: ApiError;
}

/**
 * Type guard to check if a response body is an API error
 */
export function isApiError(body: unknown): body is ApiError {
  return (
    typeof body === "object" &&
    body !== null &&
    "code" in body &&
    "message" in body &&
    "status" in body &&
    typeof (body as ApiError).code === "string" &&
    typeof (body as ApiError).message === "string" &&
    typeof (body as ApiError).status === "number"
  );
}

/**
 * Handle API errors consistently across the application
 *
 * @param status - HTTP status code
 * @param body - Response body (may be ApiError)
 * @param options - Optional configuration
 * @returns ErrorHandlerResult with field errors and handling status
 */
export function handleApiError(
  status: number,
  body: unknown,
  options: {
    /** Router push function for redirects */
    onRedirect?: (path: string) => void;
    /** Custom error messages by status code */
    customMessages?: Partial<Record<number, string>>;
    /** Whether to show toast notifications (default: true) */
    showToast?: boolean;
  } = {},
): ErrorHandlerResult {
  const { onRedirect, customMessages = {}, showToast = true } = options;

  const error: ApiError = isApiError(body)
    ? body
    : {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
        status,
      };

  const result: ErrorHandlerResult = {
    handled: false,
    error,
  };

  switch (status) {
    case 400: {
      // Bad Request - validation errors
      if (error.errors && error.errors.length > 0) {
        result.fieldErrors = error.errors.reduce(
          (acc, { field, error: errorMsg }) => {
            acc[field] = errorMsg;
            return acc;
          },
          {} as Record<string, string>,
        );
      }
      if (showToast) {
        toast.error(customMessages[400] ?? error.message ?? "Validation failed");
      }
      break;
    }

    case 401: {
      // Unauthorized - redirect to sign-in
      if (onRedirect) {
        onRedirect("/sign-in");
        result.handled = true;
      }
      if (showToast && !result.handled) {
        toast.error(customMessages[401] ?? "Please sign in to continue");
      }
      break;
    }

    case 403: {
      // Forbidden
      if (showToast) {
        toast.error(
          customMessages[403] ??
            error.message ??
            "You don't have permission to perform this action",
        );
      }
      break;
    }

    case 404: {
      // Not Found
      if (showToast) {
        toast.error(customMessages[404] ?? error.message ?? "Resource not found");
      }
      break;
    }

    case 429: {
      // Rate Limited
      const retryAfter = error.action?.value;
      const message = retryAfter
        ? `Too many requests. Please try again in ${retryAfter} seconds.`
        : "Too many requests. Please try again later.";
      if (showToast) {
        toast.error(customMessages[429] ?? message);
      }
      break;
    }

    case 500:
    case 502:
    case 503:
    case 504: {
      // Server errors
      if (showToast) {
        toast.error(customMessages[status] ?? "Something went wrong. Please try again later.");
      }
      break;
    }

    default: {
      if (showToast) {
        toast.error(error.message ?? "An unexpected error occurred");
      }
    }
  }

  return result;
}

/**
 * Extract field errors from an API error response
 * Useful for form validation display
 */
export function extractFieldErrors(body: unknown): Record<string, string> | undefined {
  if (!isApiError(body) || !body.errors || body.errors.length === 0) {
    return undefined;
  }

  return body.errors.reduce(
    (acc, { field, error }) => {
      acc[field] = error;
      return acc;
    },
    {} as Record<string, string>,
  );
}

/**
 * Check if an API response indicates success (2xx status)
 */
export function isSuccessResponse(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Check if an API response indicates a client error (4xx status)
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500;
}

/**
 * Check if an API response indicates a server error (5xx status)
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600;
}
