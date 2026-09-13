/**
 * Client-Side JavaScript Code Execution & Test Runner Service
 * Runs candidate code safely in browser, evaluates hidden test cases,
 * calculates score, and fetches Qwen2.5 3B AI hints on failed attempts.
 */

import { generateStructuredJSON } from "@/lib/ollama";

/**
 * Evaluates candidate code string against a set of test cases.
 * @param {string} userCode - JavaScript code string submitted by candidate.
 * @param {Array<{ input: any, expected: any }>} testCases - List of test case inputs & expected outputs.
 * @param {string} functionName - Target function name to execute (e.g., "findMax").
 * @returns {Promise<{ success: boolean, score: number, results: Array, logs: Array }>}
 */
export async function executeJavaScriptChallenge(userCode, testCases = [], functionName = "solution") {
  const results = [];
  const logs = [];
  let passedCount = 0;

  // Intercept console.log statements safely
  const originalLog = console.log;
  const capturedLogs = [];
  const safeConsoleLog = (...args) => {
    capturedLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
  };

  try {
    // Construct sandbox function from code string
    const sandboxFunction = new Function("console", `${userCode}\n return typeof ${functionName} === 'function' ? ${functionName} : null;`);
    const fn = sandboxFunction({ log: safeConsoleLog });

    if (!fn) {
      throw new Error(`Function '${functionName}' is not defined in your code.`);
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const startTime = performance.now();
      let actualOutput;
      let passed = false;

      try {
        // Deep clone input args to prevent mutations
        const inputArgs = JSON.parse(JSON.stringify(tc.input));
        actualOutput = Array.isArray(inputArgs) ? fn(...inputArgs) : fn(inputArgs);

        // Compare expected vs actual output
        passed = JSON.stringify(actualOutput) === JSON.stringify(tc.expected);
      } catch (err) {
        actualOutput = `Runtime Error: ${err.message}`;
        passed = false;
      }

      const executionTime = (performance.now() - startTime).toFixed(2);

      if (passed) passedCount++;

      results.push({
        testCaseIndex: i + 1,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: JSON.stringify(actualOutput),
        passed,
        executionTimeMs: executionTime
      });
    }
  } catch (err) {
    results.push({
      testCaseIndex: 0,
      input: "Compilation",
      expected: "Syntax OK",
      actual: err.message,
      passed: false,
      executionTimeMs: "0"
    });
  }

  const total = testCases.length || 1;
  const score = Math.round((passedCount / total) * 100);

  return {
    success: score >= 70,
    score,
    passedCount,
    totalCount: total,
    results,
    logs: capturedLogs
  };
}

/**
 * Fetches an intelligent AI hint from local Qwen2.5 3B when a candidate fails code test cases.
 */
export async function getAiDebuggingHint(userCode, problemDescription, failedTestCase) {
  const prompt = `
The student is trying to solve this coding challenge:
"${problemDescription}"

Here is the student's current JavaScript code:
\`\`\`javascript
${userCode}
\`\`\`

Failed Test Case Information:
- Input: ${failedTestCase ? failedTestCase.input : "N/A"}
- Expected Output: ${failedTestCase ? failedTestCase.expected : "N/A"}
- Actual Output: ${failedTestCase ? failedTestCase.actual : "N/A"}

Provide a short, encouraging 2-sentence debugging hint. DO NOT reveal the complete solution code. Focus on pointing out logic flaws or off-by-one errors.

Return ONLY a JSON object:
{
  "hintTitle": "Short Hint Title",
  "hintMessage": "2-sentence hint message",
  "conceptKey": "Key concept to review"
}
`;

  try {
    return await generateStructuredJSON(prompt, "You are a friendly computer science TA giving hints.");
  } catch (err) {
    return {
      hintTitle: "Debugging Tip",
      hintMessage: "Check your loop termination boundaries and initial variable values.",
      conceptKey: "Array Traversal"
    };
  }
}
