# doosam-fleet agent rules

## Project-wide PR merge authority

- A user request to create, fix, update, continue, validate, or finish a PR authorizes the normal PR lifecycle through merge.
- The assistant or assigned worker decides merge readiness after verifying requested scope, diff, ownership, unresolved reviews, required checks/tests/builds, and mergeability.
- When those gates pass, merge without asking for an additional user approval. Do not ask `머지할까요?` merely because the requested PR now exists.
- Ask only for a genuine judgment boundary: materially ambiguous behavior, conflicting ownership/scope, knowingly unresolved defects, destructive external effects, new cost, public exposure, credential/account mutation, database writes, package or OS installation, vehicle commands, live TSL/BLE, app-data clear, uninstall, or another separately protected operation.
- Explicit instructions such as `PR만`, `머지하지 마`, `보류`, or `리뷰만` prohibit merge.
- Direct `main` modification or direct push is forbidden. Use a branch and PR. Force-push is forbidden unless explicitly approved for that exact history rewrite.
- Merge authority does not authorize deployment, service restart, external messaging, secret access, database mutation, package installation, Tesla commands, live TSL/BLE, app-data clear, uninstall, or public exposure.
- After merge, report the PR, head SHA, merge SHA, validation state, and every remaining `NOT VERIFIED` boundary.

## Repeated-failure systemic improvement and reporting

- Repeated retries, or one failure exposing a reusable contract, cleanup, retry, readiness, ownership, lease, receipt, or runner defect, must be treated as a system-improvement candidate rather than a one-off mistake.
- Stop repeating the unchanged failing action and identify the first broken boundary and the component that owns it.
- When scope and ownership are clear, apply the smallest safe permanent improvement and validate it with an appropriate regression test, terminal receipt, or bounded canary.
- Even when the original task eventually succeeds, report the failure pattern, root cause, permanent improvement, validation evidence, affected systems, and remaining `NOT VERIFIED` boundaries.
- If the improvement cannot be safely applied in the current scope, report the proposed change, target system, expected benefit, risk, and exact reason it remains unapplied.
- Classify a failure as a transient external outage only when bounded evidence shows no reusable local defect, and record that classification.

## Safety defaults

- Inspect current source, open PRs, logs, and relevant docs before changing code or operations.
- Never read, print, copy, commit, or expose tokens, credentials, private keys, cookies, sessions, `.env` values, or secret-bearing files.
- Do not claim tests, deployment, installation, or live behavior succeeded without evidence. Use `PASS`, `FAIL`, `BLOCKED`, `NOT VERIFIED`, and `NOT RUN` precisely.
