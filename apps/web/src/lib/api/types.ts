import { apiContract } from '@genta/openapi/contracts'
import type { ServerInferRequest } from '@ts-rest/core'

export type TRequests = ServerInferRequest<typeof apiContract>
