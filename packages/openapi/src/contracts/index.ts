import { initContract } from "@ts-rest/core";
import { healthContract } from "./health.js";
import { userContract } from "./user.js";
import { questionContract } from "./question.js";
import { attemptContract } from "./attempt.js";

const c = initContract();

export const apiContract = c.router({
  Health: healthContract,
  User: userContract,
  Question: questionContract,
  Attempt: attemptContract,
});
