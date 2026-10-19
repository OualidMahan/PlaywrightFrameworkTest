# SauceLabs Playwright tests

Standalone TypeScript automation project using the framework built and released
on GitHub. No local framework checkout or build is required.

## Setup

Run these commands from this directory:

```sh
cd playwright/saucelabs
npm ci
npx playwright install chromium
```

If this directory is already your project root, omit the `cd` command.
Create or edit the single `.env` file at this project root:

```dotenv
BASE_URL=https://www.saucedemo.com/
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce
```

These are public SauceDemo demo credentials. `.env` is ignored by Git.
Existing environment variables take precedence over `.env`.
The CI workflow supplies the public SauceDemo demo credentials.

## Commands

```sh
npm run typecheck
npm test
npm run test:ui
npm run test:headed
npm run report
```

To list tests without opening a browser:

```sh
npm test -- --list --reporter=line
```

`npm run report` opens the HTML report produced by a previous test run.

The framework dependency is downloaded from the GitHub release URL recorded
in `package.json` and `package-lock.json`. Page types are generated automatically
before tests and type checking. Run `npm run pages:generate` to refresh IDE types
immediately after adding a page.

## Structure

- `pages/`: exported Page Objects extending `BasePage` from `@automation/framework`.
- `fixtures/test.ts`: discovers pages and exports `test` and `expect`.
- `generated/`: automatically generated page registry types; do not edit manually.
- `tests/`: scenarios and assertions.

Tests import `test` and `expect` from `../fixtures/test`.
New pages are discovered from `.ts` files directly inside `pages/`.

## Add a Page Object

Create a file such as `pages/CheckoutPage.ts` with a named exported class
extending the framework's `BasePage`:

```ts
import { BasePage } from "@automation/framework";

export class CheckoutPage extends BasePage {
  readonly firstNameInput = this.page.getByTestId("firstName");

  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }
}
```

The class name becomes the fixture name by lowercasing its first letter:
`CheckoutPage` becomes `checkoutPage`. No manual registry entry is needed.
Tests can request this fixture through the shared `test` export.

## Generated types and runtime discovery

Two separate operations support automatic page fixtures:

| Component | Purpose |
| --- | --- |
| `creerPageRegistry` | Loads exported page classes when Playwright loads the tests. |
| Framework generator | Writes `generated/page-registry.generated.ts` so TypeScript knows each fixture's class and methods. |

Do not edit `page-registry.generated.ts` manually. It is regenerated before
`npm test`, `npm run test:ui`, `npm run test:headed`, and `npm run typecheck`.
To refresh autocomplete immediately after creating or deleting a page file:

```sh
npm run pages:generate
```

If the generated file is missing, these npm commands recreate it. Until then,
the IDE may report a missing module or an unknown fixture.
Direct commands such as `npx playwright test` and runs started from the IDE
do not invoke the npm generation hooks. Generate the types first when using
those entry points after changing page files.

## Reports and temporary files

`test-results/` contains test output such as failure screenshots and traces.
`playwright-report/` contains the HTML report. Both directories are generated
by test runs, ignored by Git, and can be deleted when no longer needed.
Keep `node_modules/` for installed dependencies; do not edit its framework files.

## Continuous integration

`.github/workflows/playwright.yml` installs dependencies and browsers, checks
types, runs tests, and uploads the HTML report. It expects this project to be
at the repository root. The framework is downloaded from GitHub; no local
framework source directory or compilation step is needed.

## Update the framework

Install the URL of the desired GitHub release archive, then commit both package files:

```sh
npm install https://github.com/OualidUchiha/PlayWrightRobot/releases/download/v1.0.1/automation-framework-1.0.1.tgz
```

Replace both version segments with the desired published release version.
After updating, run `npm run typecheck` and `npm test`. Commit the updated
`package.json` and `package-lock.json` so local and CI installations use the
same release.
