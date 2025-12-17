import { initContract } from "@ts-rest/core";
import { healthContract } from "./health.js";
import { userContract } from "./user.js";
import { questionContract } from "./question.js";
import { attemptContract } from "./attempt.js";
import { sessionContract } from "./session.js";
import { readinessContract } from "./readiness.js";
import { analyticsContract } from "./analytics.js";

const c = initContract();

export const apiContract = c.router({
  Health: healthContract,
  User: userContract,
  Question: questionContract,
  Attempt: attemptContract,
  Session: sessionContract,
  Readiness: readinessContract,
  Analytics: analyticsContract,
});
