<p align="center">
  <a href="https://github.com/Libra-foundation/radon-comment/actions"><img alt="radon-comment status" src="https://github.com/Libra-foundation/radon-comment/workflows/build-test/badge.svg"></a>
  <a href="https://github.com/Libra-foundation/radon-comment/actions"><img alt="radon-comment status" src="https://github.com/Libra-foundation/radon-comment/actions/workflows/lint.yml/badge.svg"></a>
</p>

# Show Radon's metrics on your PRs

This action aims to convert the raw radon output into nicer comment on your PR so that you can keep track of all the great metrics radon produce.</br>
We higly recommend you to check up [radon](https://pypi.org/project/radon/) if you do not know this tool.

## Usage:

```yml
name: Example
on:
  pull_request:
    branches: ["main"]

jobs:
  comment:
    permissions:
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Radon's reports
        run: |
          radon cc src/ -j >cc.json
          radon mi src/ -j >mi.json
          radon hal src/ -j >hal.json
      - name: Comment the results on the PR
        uses: Libra-foundation/radon-comment@V1.0
        with:
          cc: "cc.json"
          mi: "mi.json"
          hal: "hal.json"
```

All the arguments are optionals and all the types of reports you give to the action will be processed and added to the comment.
We currently do not handle deltas but this feature is planned.
