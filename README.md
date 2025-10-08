# pacman-actions

Installing pacman and its tools on Ubuntu24 environment github actions.

Example:

```yml
jobs:
  example:
    runs-on: ubuntu-24.04
    name: Example
    steps:
      - uses: actions/checkout@v4
      - uses: termux-pacman/pacman-actions@v2.5
      - run: |
          pacman --help
          makepkg --help
          repo-add --help
          repo-remove --help
```
