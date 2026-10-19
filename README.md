# SauceLabs Playwright tests

Standalone TypeScript automation project using the framework built and released
on GitHub. No local framework checkout or build is required.

- Automation project: [PlaywrightFrameworkTest](https://github.com/OualidMahan/PlaywrightFrameworkTest).
- Reusable framework: [PlayWrightRobot](https://github.com/OualidUchiha/PlayWrightRobot).
- Framework dependency: `@automation/framework`, installed from the GitHub release archive pinned in `package.json`.

## Setup

Clone this repository and install its dependencies:

```sh
git clone https://github.com/OualidMahan/PlaywrightFrameworkTest.git
cd PlaywrightFrameworkTest
npm ci
npx playwright install chromium
```

If you already have a checkout, run the installation commands from the directory
containing this project's `package.json`. In the existing local workspace,
that directory is `playwright/saucelabs`.
Create or edit the single `.env` file at this project root:

```dotenv
BASE_URL=https://www.saucedemo.com/
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce
```

These are public SauceDemo demo credentials. `.env` is ignored by Git.
Existing environment variables take precedence over `.env`.
The CI workflow supplies the public SauceDemo demo credentials.

## Run tests locally

Open a terminal in the project root, where `package.json` is located.
For the existing local workspace, this is `playwright/saucelabs`. After cloning
the GitHub repository, it is `PlaywrightFrameworkTest`.

Before the first run, install dependencies and Chromium using the setup commands
above, then configure your local `.env` file. All three variables (`BASE_URL`,
`TEST_USERNAME`, and `TEST_PASSWORD`) must have a value. The `.env` file is loaded
automatically; you do not need to export these variables in your terminal.

Run the type check and all tests locally (the browser runs without a visible window):

```sh
npm run typecheck
npm test
```

Run only the product and cart scenario:

```sh
npm test -- tests/product-cart-pom.spec.ts
```

Watch the test execute in a visible browser:

```sh
npm run test:headed -- tests/product-cart-pom.spec.ts
```

Open Playwright's interactive test interface:

```sh
npm run test:ui
```

After execution, open the HTML report:

```sh
npm run report
```

These npm test commands generate page fixture types automatically before
starting Playwright. Local execution uses Chromium and does not require
GitHub Actions or a locally built framework.

### Run Playwright directly with npx

Both `npm test` and `npx playwright test` run the Playwright test runner.
The difference is that `npm test` also runs this project's `pretest` hook to
generate page fixture types first. `npx playwright test` does not run that hook.

When using `npx`, generate the types before the first run and after adding or
removing a page file:

```sh
npm run pages:generate
npx playwright test
```

Run the product and cart scenario in a visible browser:

```sh
npx playwright test tests/product-cart-pom.spec.ts --headed
```

Open the interactive test interface or an existing HTML report:

```sh
npx playwright test --ui
npx playwright show-report
```

If page files have not changed and the generated types are already up to date,
there is no need to regenerate them before every `npx` run.

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

The workflow runs on pushes and pull requests targeting `main` or `master`.
Check execution results in the repository's
[Actions tab](https://github.com/OualidMahan/PlaywrightFrameworkTest/actions).
The HTML report is uploaded as the `playwright-report` artifact and retained
for 30 days.

## Update the framework

Install the URL of the desired GitHub release archive, then commit both package files:

```sh
npm install https://github.com/OualidUchiha/PlayWrightRobot/releases/download/v1.0.1/automation-framework-1.0.1.tgz
```

Replace both version segments with the desired published release version.
After updating, run `npm run typecheck` and `npm test`. Commit the updated
`package.json` and `package-lock.json` so local and CI installations use the
same release.
