export const gameQuestions = [
  // STAGE 1: Logic Gates (Novice Tier)
  {
    stageId: 1,
    stage: 1,
    stageTitle: 'Stage 1: Logic Gates',
    tier: 'Novice Tier',
    questions: [
      {
        id: 's1q1',
        stage: 1,
        question: 'In a standard two-pointer search on a sorted array where sum = arr[left] + arr[right], if sum < target, which pointer must advance to reach the target sum?',
        options: [
          'right-- (Move right pointer inward)',
          'Both pointers move inward simultaneously',
          'left++ (Increment left pointer toward higher values)',
          'Reset left = 0'
        ],
        correctIndex: 2, // Option C
        explanation: 'In an ascending sorted array, advancing left++ increases the sum toward the target, whereas decrementing right-- decreases it.',
        wrongReason: 'Decreasing right-- reduces the sum further away from target. Moving both inward collapses search space without guaranteed target match.'
      },
      {
        id: 's1q2',
        stage: 1,
        question: 'What is the time and space complexity of searching a sorted pair using the two-pointer approach compared to a naive brute-force nested loop?',
        options: [
          'O(N) time, O(1) space vs O(N²) time, O(1) space',
          'O(N log N) time, O(N) space vs O(N²) time',
          'O(1) time, O(N) space vs O(N) time',
          'O(log N) time, O(1) space vs O(N) time'
        ],
        correctIndex: 0, // Option A
        explanation: 'Two pointers sweep the array in a single linear pass O(N) using zero additional auxiliary memory O(1).',
        wrongReason: 'Brute-force requires O(N²) nested loops. Two pointers operate in linear O(N) time without sorting overhead or extra arrays.'
      },
      {
        id: 's1q3',
        stage: 1,
        question: 'What is the output of logging a variable declared with var versus let before its actual assignment line?',
        options: [
          'Both throw ReferenceError',
          'Both log undefined',
          'var logs null; let logs undefined',
          'var logs undefined due to hoisting; let throws ReferenceError due to Temporal Dead Zone (TDZ)'
        ],
        correctIndex: 3, // Option D
        explanation: 'Variables declared with var initialize to undefined during creation; let remains in the TDZ until initialized.',
        wrongReason: 'var is hoisted and initialized to undefined, while accessing let/const before declaration hits TDZ and throws ReferenceError.'
      },
      {
        id: 's1q4',
        stage: 1,
        question: 'If you pass an array or object to a function and mutate its internal property, does the mutation reflect outside the function scope? Why?',
        options: [
          'No, JavaScript functions always clone parameters by deep value',
          'Yes, objects and arrays are passed by reference / call-by-sharing',
          'Only if the function explicitly returns the mutated object',
          'Only when running in non-strict mode'
        ],
        correctIndex: 1, // Option B
        explanation: 'Objects and arrays pass their memory reference address; mutations to properties alter the shared heap instance.',
        wrongReason: 'JavaScript passes references to object memory addresses. Mutating properties inside functions modifies the caller’s original object.'
      },
      {
        id: 's1q5',
        stage: 1,
        question: 'What is the correct chronological loop termination condition for checking an in-place string palindrome with two pointers?',
        options: [
          'Loop while left < right; terminate and return false immediately if str[left] !== str[right], otherwise return true',
          'Loop while left <= arr.length; return true if str[left] === str[right]',
          'Loop while left !== right; increment both pointers rightward',
          'Loop until right === 0'
        ],
        correctIndex: 0, // Option A
        explanation: 'Pointers converge inward. Any character mismatch immediately invalidates symmetry; meeting without mismatch confirms the palindrome.',
        wrongReason: 'Pointers must start at opposite ends (0 and length-1) and move inward (left++, right--). Incrementing both rightward causes index overflow.'
      },
      {
        id: 's1q6',
        stage: 1,
        question: 'What is the fundamental difference between == and === in JavaScript evaluation?',
        options: [
          '== checks references, while === checks primitive values',
          '=== is deprecated in modern ECMAScript standards',
          '== performs implicit type coercion before comparison; === performs strict comparison without coercion',
          'There is no runtime behavioral difference'
        ],
        correctIndex: 2, // Option C
        explanation: 'Loose equality (==) coerces operands to matching data types before comparing; strict equality (===) evaluates value and type strictly.',
        wrongReason: 'Loose equality (==) attempts type casting (e.g., "5" == 5 is true), whereas === checks both value equality and identical types.'
      }
    ]
  },
  // STAGE 2: Algorithmic Dungeon (Apprentice Tier)
  {
    stageId: 2,
    stage: 2,
    stageTitle: 'Stage 2: Algorithmic Dungeon',
    tier: 'Apprentice Tier',
    questions: [
      {
        id: 's2q1',
        stage: 2,
        question: 'Why does top-down memoization reduce the runtime of recursive Fibonacci from O(2ⁿ) to O(N)?',
        options: [
          'It optimizes call stack memory by using bitwise shifts',
          'It compiles JavaScript directly into WebAssembly',
          'It converts the recursive function into multi-threaded worker pools',
          'It caches evaluated subproblems in an O(1) lookup table, eliminating redundant recursion branches'
        ],
        correctIndex: 3, // Option D
        explanation: 'Storing evaluated subproblem results in a hash map prevents identical recursive subtrees from executing more than once.',
        wrongReason: 'Unmemoized Fibonacci calls fib(n-1) and fib(n-2) redundantly, creating an exponential tree O(2ⁿ). Caching results reduces depth to O(N).'
      },
      {
        id: 's2q2',
        stage: 2,
        question: 'What is the core architectural difference between bottom-up tabulation and top-down memoization in DP?',
        options: [
          'Memoization never uses extra memory, whereas tabulation does',
          'Tabulation is iterative starting from base cases upwards; memoization is recursive breaking down from N on demand',
          'Tabulation cannot solve 2D grid path problems',
          'Memoization is strictly iterative and stack-free'
        ],
        correctIndex: 1, // Option B
        explanation: 'Tabulation avoids call-stack limits by iteratively populating table rows starting from known base values.',
        wrongReason: 'Tabulation builds solutions iteratively from base cases (dp[0], dp[1]), while memoization recurses top-down on demand.'
      },
      {
        id: 's2q3',
        stage: 2,
        question: 'In the Unbounded Coin Change problem, what represents the recurrence relation for using coin C_i on remaining amount A?',
        options: [
          'dp[A] = Math.min(dp[A], 1 + dp[A - C_i])',
          'dp[A] = Math.max(dp[A], dp[A - 1])',
          'dp[A] = dp[A] + dp[C_i]',
          'dp[A] = dp[A - C_i] * 2'
        ],
        correctIndex: 0, // Option A
        explanation: 'The minimum coins needed for amount A is 1 plus the precalculated optimal solution for (A - C_i).',
        wrongReason: 'To minimize total coins, we compare current minimum dp[A] against taking 1 new coin plus the optimal answer for (A - C_i).'
      },
      {
        id: 's2q4',
        stage: 2,
        question: 'Why does React require a unique, stable key prop when rendering dynamic arrays of components?',
        options: [
          'To bind CSS styling to the virtual DOM element',
          'To serialize components into JSON for network transport',
          'To enable the diffing algorithm to identify which items changed, moved, or were deleted without re-rendering the whole list',
          'To prevent memory leaks in global Zustand stores'
        ],
        correctIndex: 2, // Option C
        explanation: 'Stable keys allow React\'s reconciliation engine to preserve state and reuse existing DOM nodes efficiently.',
        wrongReason: 'Without unique keys, array re-ordering causes React to mutate DOM nodes indiscriminately and reset local component state.'
      },
      {
        id: 's2q5',
        stage: 2,
        question: 'What happens if you attach a global window.addEventListener inside useEffect without specifying a cleanup return function?',
        options: [
          'React throws a fatal compile-time syntax error',
          'The listener stays in memory across unmounts/re-mounts, causing memory leaks and duplicate handler executions',
          'The browser automatically removes the listener upon component re-render',
          'The listener only triggers once and auto-destructs'
        ],
        correctIndex: 1, // Option B
        explanation: 'Omitting a cleanup function causes event listeners to accumulate on each render cycle.',
        wrongReason: 'Event listeners persist on window across component re-renders unless explicitly detached via removeEventListener in the cleanup return function.'
      },
      {
        id: 's2q6',
        stage: 2,
        question: 'What is the correct order of operations inside a JavaScript debounce utility function?',
        options: [
          'Execute callback → start timeout → clear timeout',
          'Set new timer → clear all browser intervals',
          'Wait for event loop to idle → trigger callback immediately',
          'Clear existing timer via clearTimeout(timerId) → set new timer via setTimeout(...) to invoke callback'
        ],
        correctIndex: 3, // Option D
        explanation: 'Debouncing resets the delay timer on every trigger, executing only after the user stops input for the specified interval.',
        wrongReason: 'Debouncing delays execution until a quiet period occurs. If you execute callback first, it acts as throttle or immediate execution.'
      }
    ]
  },
  // STAGE 3: System Scaler (Apprentice Tier)
  {
    stageId: 3,
    stage: 3,
    stageTitle: 'Stage 3: System Scaler',
    tier: 'Apprentice Tier',
    questions: [
      {
        id: 's3q1',
        stage: 3,
        question: 'In which phase of the Node.js event loop are setImmediate() callbacks processed relative to setTimeout(fn, 0)?',
        options: [
          'setTimeout runs in the Timers phase; setImmediate runs in the Check phase after I/O polling',
          'setImmediate runs in Timers phase; setTimeout runs in Close phase',
          'Both execute simultaneously in the Poll phase',
          'setImmediate runs prior to all microtasks'
        ],
        correctIndex: 0, // Option A
        explanation: 'setTimeout executes during the Timers phase, while setImmediate executes during the Check phase following I/O events.',
        wrongReason: 'Timers phase evaluates expired setTimeout timers first. Check phase processes setImmediate callbacks after Poll phase completes.'
      },
      {
        id: 's3q2',
        stage: 3,
        question: 'Between resolved Promise callbacks (process.nextTick, Promise.then) and a timer callback (setTimeout), which executes first?',
        options: [
          'setTimeout macrotask always executes first',
          'Only setTimeout executes in Node.js',
          'Microtasks (process.nextTick followed by Promise.then) drain completely before the next macrotask runs',
          'Execution order is completely non-deterministic'
        ],
        correctIndex: 2, // Option C
        explanation: 'Microtasks have priority and drain immediately after the current operation finishes before the event loop advances.',
        wrongReason: 'The microtask queue (nextTick + promises) is processed immediately after the current phase completes before moving to macrotasks.'
      },
      {
        id: 's3q3',
        stage: 3,
        question: 'What are the sequential steps of the Cache-Aside reading strategy when serving a user profile query?',
        options: [
          'Write to PostgreSQL → invalidate Redis → return',
          'Check Redis → on hit return; on miss query PostgreSQL → write to Redis with TTL → return response',
          'Query PostgreSQL and Redis in parallel → return whichever responds first',
          'Cache data in browser LocalStorage only'
        ],
        correctIndex: 1, // Option B
        explanation: 'Cache-Aside lazily loads data into the cache only after a read cache miss occurs.',
        wrongReason: 'Cache-Aside checks memory cache first. On miss, it queries primary storage and populates cache asynchronously for subsequent calls.'
      },
      {
        id: 's3q4',
        stage: 3,
        question: 'What is a cache stampede (thundering herd), and how do you protect against it during high traffic spikes?',
        options: [
          'When Redis runs out of memory; mitigated by deleting keys',
          'When SQL queries are improperly indented',
          'When API rate limits are set too high',
          'When a hot key expires and concurrent requests overload the database; mitigated using mutex locks or probabilistic early recomputation'
        ],
        correctIndex: 3, // Option D
        explanation: 'A cache stampede occurs when an expired hot key causes simultaneous DB queries; locking guarantees only one worker rebuilds the cache.',
        wrongReason: 'Thousands of concurrent reads on an expired key bombard the database. Distributed locking guarantees only 1 request computes the result.'
      },
      {
        id: 's3q5',
        stage: 3,
        question: 'Why does adding a B-Tree index speed up SELECT ... WHERE email = ? queries but slightly slow down bulk INSERT statements?',
        options: [
          'B-Trees compress data on reads but decompress on writes',
          'Search takes O(log N) traversal, but every write requires rebalancing the tree and updating disk blocks for each index',
          'Indexes disable transaction logging',
          'B-Trees convert relational tables into document stores'
        ],
        correctIndex: 1, // Option B
        explanation: 'Indexes require overhead on mutation operations because both the raw data table and the indexed search tree must stay synchronized.',
        wrongReason: 'Indexes accelerate read lookups via binary search tree traversal, but every INSERT/UPDATE requires disk updates to rebalance index nodes.'
      },
      {
        id: 's3q6',
        stage: 3,
        question: 'Why is PUT designated as an idempotent operation under REST specifications while POST is non-idempotent?',
        options: [
          'Multiple identical PUT requests result in the exact same server state; multiple POST requests create duplicate resources',
          'POST requires encryption while PUT is plaintext',
          'PUT is only supported in HTTP/2',
          'Both are non-idempotent by specification'
        ],
        correctIndex: 0, // Option A
        explanation: 'Idempotence means making N identical requests produces the exact same system side-effects as making a single request.',
        wrongReason: 'PUT replaces or sets resource state completely (repeating produces identical state). POST appends new sub-resources, creating duplicates.'
      }
    ]
  },
  // STAGE 4: Google X-Y-Z Boss Battle (Job-Ready Tier)
  {
    stageId: 4,
    stage: 4,
    stageTitle: 'Stage 4: Google X-Y-Z Boss Battle',
    tier: 'Job-Ready Tier (Final Boss)',
    questions: [
      {
        id: 's4q1',
        stage: 4,
        question: 'What are the exact components of the Google X-Y-Z formula for describing engineering achievements?',
        options: [
          'Explain [X] (task) by detailing [Y] (time spent) using [Z] (programming language)',
          'Mastered [X] as proven by [Y] (certificate) by studying [Z] (courses)',
          'Developed [X] for client [Y] under budget [Z]',
          'Accomplished [X] (outcome/impact) as measured by [Y] (quantifiable metric) by doing [Z] (technical method/tool)'
        ],
        correctIndex: 3, // Option D
        explanation: 'The Google formula highlights business outcome first, backed by measurable data, concluded with the technical implementation.',
        wrongReason: 'Resumes must highlight business results first [X], quantified baseline metrics [Y], and the technical architecture [Z].'
      },
      {
        id: 's4q2',
        stage: 4,
        question: 'Which of the following refactors the weak bullet "Worked on reducing latency of APIs" into an optimal Google X-Y-Z placement bullet?',
        options: [
          '"Accomplished 45% reduction in API latency, as measured by sub-50ms p99 response times across 20k req/min, by implementing Redis pooling and PostgreSQL query index tuning."',
          '"Helped backend team make APIs faster with Redis and database queries."',
          '"Reduced API latency significantly using modern cloud architectures and best practices."',
          '"Wrote fast Node.js code that improved latency for all active users."'
        ],
        correctIndex: 0, // Option A
        explanation: 'Option A includes quantified impact (45% reduction), precise metric threshold (sub-50ms p99 at 20k req/min), and specific technical actions taken.',
        wrongReason: 'Vague bullets without percentages, load figures, or specific tools fail ATS key metric filters.'
      },
      {
        id: 's4q3',
        stage: 4,
        question: 'What is the mechanical difference between Token Bucket and Sliding Window Log algorithms for API rate limiters?',
        options: [
          'Token bucket requires Redis; sliding window runs only in memory',
          'Sliding window log is susceptible to double-burst attacks at boundary windows',
          'Token Bucket adds tokens at a fixed rate with O(1) memory; Sliding Window Log stores individual timestamps in a sorted set with higher memory usage',
          'Token bucket does not support burst traffic'
        ],
        correctIndex: 2, // Option C
        explanation: 'Token bucket tracks an integer count, while sliding window log records exact request timestamps to calculate precise rolling rates.',
        wrongReason: 'Token Bucket consumes simple integer counters O(1), while Sliding Window Log keeps timestamp logs per client, incurring higher memory.'
      },
      {
        id: 's4q4',
        stage: 4,
        question: 'What conditions cause a browser to initiate an OPTIONS preflight request before sending a cross-origin API call?',
        options: [
          'Any request sent over HTTPS',
          'Non-simple HTTP methods (PUT, DELETE, PATCH) or custom headers like Authorization or Content-Type: application/json',
          'Whenever cookies are disabled',
          'Only when querying local host addresses'
        ],
        correctIndex: 1, // Option B
        explanation: 'Cross-Origin Resource Sharing (CORS) rules mandate preflight checks for any request that could mutate server state beyond simple GET/POST forms.',
        wrongReason: 'Browsers send preflight OPTIONS requests for CORS requests with non-simple methods (PUT/DELETE/PATCH) or custom headers like Authorization.'
      },
      {
        id: 's4q5',
        stage: 4,
        question: 'When an order service and payment service reside in separate databases, how does the Saga Pattern guarantee eventual consistency upon payment failure?',
        options: [
          'By executing a sequence of local transactions and triggering automated compensating transactions (e.g., refund order, restock) if a step fails',
          'By locking both databases using two-phase distributed hardware locks',
          'By rolling back disk snapshots',
          'By automatically retrying payments infinitely'
        ],
        correctIndex: 0, // Option A
        explanation: 'Sagas handle failure in distributed microservices by executing backward-compensating actions to revert prior steps.',
        wrongReason: 'Distributed transactions avoid blocking 2PC locks by executing compensating rollback actions (e.g. canceling order) if step N fails.'
      },
      {
        id: 's4q6',
        stage: 4,
        question: 'Since standard JSON Web Tokens (JWT) are stateless, how do you handle immediate token invalidation when a user logs out or is compromised?',
        options: [
          'Delete the token from the user\'s local disk',
          'Change the server\'s public IP address',
          'Use short-lived access tokens, maintain a token blacklist/revocation list in Redis, and rotate refresh tokens via secure HTTP-only cookies',
          'JWTs cannot be revoked under any design'
        ],
        correctIndex: 2, // Option C
        explanation: 'Pairing short-lived access tokens with a fast in-memory blacklist (or refresh token family revocation) provides secure revocation while maintaining performance.',
        wrongReason: 'Deleting local tokens on the client leaves active JWT signatures valid on the backend. Fast Redis revocation lists ensure immediate invalidation.'
      }
    ]
  }
];

export const getQuestionsByStageId = (stageId) => {
  const stageData = gameQuestions.find((s) => s.stageId === stageId || s.stage === stageId);
  return stageData ? stageData.questions : [];
};

export default gameQuestions;
