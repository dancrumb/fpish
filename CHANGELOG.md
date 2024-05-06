# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [7.0.0](https://github.com/dancrumb/fpish/compare/v6.0.3...v7.0.0) (2024-05-06)


### ⚠ BREAKING CHANGES

* **result, either:** Removes the Result class

### Features

* **result, either:** remove Result and add `throwError` ([e519df0](https://github.com/dancrumb/fpish/commit/e519df069139a8c875abb7a8d363fbd8021dbdd2)), closes [#202](https://github.com/dancrumb/fpish/issues/202)


### Bug Fixes

* **result:** remove export from index.ts ([e876899](https://github.com/dancrumb/fpish/commit/e87689910eea15f60c0dc90dfcd79fc91bf88d31))

## [6.0.3](https://github.com/dancrumb/fpish/compare/v6.0.2...v6.0.3) (2024-05-06)


### Bug Fixes

* **result:** add missing export of Result type ([22ff198](https://github.com/dancrumb/fpish/commit/22ff1987670d64db707fcec1551e9737f8b587a8))

## [6.0.2](https://github.com/dancrumb/fpish/compare/v6.0.1...v6.0.2) (2024-05-05)

## [6.0.1](https://github.com/dancrumb/fpish/compare/v6.0.0...v6.0.1) (2024-05-05)

## [6.0.0](https://github.com/dancrumb/fpish/compare/v5.2.1...v6.0.0) (2024-05-05)


### ⚠ BREAKING CHANGES

* 🧨 `proceedLeftAsync` and `proceedRightAsync` are no longer supported. Use `proceedLeft` and `proceedRight` instead

✅ Closes: 195

### Features

* 🎸 make Result more user friendly ([d55fd2d](https://github.com/dancrumb/fpish/commit/d55fd2db45c1fc2ea0bec231ec8f361be71b642a))

## v5.2.1 (2023-08-07)

## v5.2.0 (2023-08-07)

### Feat

- **Result**: add Result type

### Refactor

- **dependencies**: update typescript
- **dependencies**: update typescript
- **dependencies**: update lint and prettier

## v5.1.0 (2022-10-23)

## v5.0.8 (2022-10-16)

## v5.0.7 (2022-09-28)

## v5.0.6 (2022-09-28)

## v5.0.5 (2022-09-28)

## v5.0.4 (2022-09-28)

## v5.0.3 (2022-09-28)

## v5.0.2 (2022-09-25)

## v5.0.1 (2022-09-25)

## v5.0.0 (2022-09-25)

### Fix

- 🐛 add runs-on back to CI config
- 🐛 import resolve in ESLint file
- 🐛 remove insecure code
- rename Travis file

### Refactor

- 💡 convert to yarn

## v4.0.0 (2022-04-20)

## v3.5.1 (2022-04-20)

## v3.5.0 (2022-04-20)

## v3.4.1 (2021-12-09)

### Feat

- 🎸 add `orElse` for `Optional.ifPresent`

## v3.3.0 (2021-09-10)

### Feat

- 🎸 add `AsyncData.containsData`

### Refactor

- 💡 fix npm audit issues

## v3.1.2 (2021-09-09)

## v3.1.1 (2021-09-09)

## v3.1.0 (2021-09-09)

### Feat

- 🎸 add `AsyncData.append`

## v3.0.2 (2021-09-04)

## v3.0.1 (2021-09-04)

## v3.0.0 (2021-09-04)

### Feat

- 🎸 add support for follow up loading

### Fix

- 🐛 check the right value for `isRight`

## v2.6.1 (2021-03-16)

## v2.6.0 (2020-12-18)

### Feat

- 🎸 add `loadedSingle` and make `loaded` take readonly

## v2.5.1 (2020-10-28)

### Fix

- 🐛 allow falsy defaults for Optional.property

## v2.5.0 (2020-10-28)

### Feat

- 🎸 ensure that `Optional.property` does not return undef

## v2.4.0 (2020-10-26)

### Feat

- 🎸 add .orElse to AsyncData

### Fix

- 🐛 improve AsyncData behaviour on failed loads
- package.json & package-lock.json to reduce vulnerabilities
- 🐛 improve AsyncData behaviour on failed loads

## v2.3.3 (2020-10-19)

### Fix

- 🐛 clean up some typing and lint issues

## v2.3.2 (2020-10-19)

### Fix

- 🐛 add `property` method
- package.json & package-lock.json to reduce vulnerabilities
- upgrade standard-version from 8.0.1 to 8.0.2

## v2.3.1 (2020-06-19)

## v2.3.0 (2020-06-19)

### Feat

- 🎸 add support for JSON

## v2.2.4 (2020-05-04)

### Fix

- 🐛 resolve build errors

## v2.2.3 (2020-05-04)

### Fix

- 🐛 ensure overloading types in Either are declared

## v2.2.2 (2020-05-04)

### Fix

- 🐛 update types for Either

## v2.2.1 (2020-04-02)

## v2.2.0 (2020-04-02)

### Feat

- add getAllOptional

## v2.1.1 (2020-02-05)

## v2.1.0 (2020-01-05)

### Feat

- add `partial` and `partialRight` functions

## v2.0.1 (2019-12-06)

### Fix

- 🐛 correct the way that AsyncData provides an Optional

## v2.0.0 (2019-12-03)

## v1.3.1 (2019-12-02)

### Fix

- 🐛 ensure that Lazy is exported

## v1.3.0 (2019-12-02)

### Feat

- 🎸 add Lazy<T> type

### Fix

- 🐛 remove auto release on master

## v1.2.2 (2019-11-28)

## v1.2.1 (2019-11-28)

## v1.2.0 (2019-11-28)

### Feat

- 🎸 allow the use of a custom comparator for `equals`

## v1.1.0 (2019-11-25)

## v1.0.8 (2019-11-25)

## v1.0.7 (2019-11-25)

### Fix

- **release**: ensure dist files are included in package

## v1.0.6 (2019-11-25)

## v1.0.5 (2019-11-25)

## v1.0.4 (2019-11-25)

## v1.0.2 (2019-11-25)

## v1.0.1 (2019-11-25)
