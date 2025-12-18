import { apiContract } from "@genta/openapi/contracts";
import type { ServerInferRequest } from "@ts-rest/core";

export type TRequests = ServerInferRequest<typeof apiContract>;

// Re-export error handling types
export type { ApiError, ApiAction, FieldError, ErrorHandlerResult } from "./error-handler";

// Re-export query keys
export { queryKeys } from "./query-keys";
export type { QueryKeys } from "./query-keys";
