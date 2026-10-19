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

Run all commands from the directory containing `package.json`:
`PlaywrightFrameworkTest` after cloning, or `playwright/saucelabs` in the existing
local workspace. Install dependencies and Chromium, then configure `.env` as
shown above. The configuration loads `.env` automatically.

Before the first run and after adding or removing a page file, generate fixture
types:

```sh
npm run pages:generate
```

Check TypeScript and run all tests without a visible browser:

```sh
npx tsc --noEmit
npx playwright test
```

Run only the product and cart scenario:

```sh
npx playwright test tests/product-cart-pom.spec.ts
```

Watch that scenario in a visible browser:

```sh
npx playwright test tests/product-cart-pom.spec.ts --headed
```

Open the interactive test interface:

```sh
npx playwright test --ui
```

List tests without running them:

```sh
npx playwright test --list --reporter=line
```

Open the HTML report after a test run:

```sh
npx playwright show-report
```

The `npx` commands do not generate fixture types. If page files have not changed
and the generated types are up to date, no additional generation is needed.
Local execution uses Chromium and the installed framework release; no local
framework build is required.

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

Do not edit `page-registry.generated.ts` manually. Generate it with the command below.
To refresh autocomplete immediately after creating or deleting a page file:

```sh
npm run pages:generate
```

If the generated file is missing, run the generation command above to recreate it.
Run it after changing page files before using npx or running tests from the IDE.

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
After updating, run `npm run pages:generate`, `npx tsc --noEmit`, and `npx playwright test`. Commit the updated
`package.json` and `package-lock.json` so local and CI installations use the
same release.
