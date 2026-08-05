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

## Safety defaults

- Inspect current source, open PRs, logs, and relevant docs before changing code or operations.
- Never read, print, copy, commit, or expose tokens, credentials, private keys, cookies, sessions, `.env` values, or secret-bearing files.
- Do not claim tests, deployment, installation, or live behavior succeeded without evidence. Use `PASS`, `FAIL`, `BLOCKED`, `NOT VERIFIED`, and `NOT RUN` precisely.
