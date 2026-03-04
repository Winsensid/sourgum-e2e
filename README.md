# Sourgum E2E Automation Framework

end-to-end test automation framework built with **Playwright** and **TypeScript**, targeting [sourgum.com](https://www.sourgum.com).

- **Page Object Model (POM)** — all selectors and interactions abstracted into typed page classes
- **Custom Fixtures** — Playwright's `test` is extended to auto-inject page objects into every test
- **Strict TypeScript** — full `strict` mode, no `any`, typed credentials and environment config
- **Modular Config** — browser projects, reporters, and environment are split into separate modules
- **Clean Code** — single-responsibility classes, self-documenting names, comprehensive inline comments

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.53 | Browser automation + test runner |
| [TypeScript](https://www.typescriptlang.org) | ^5.8 | Strict static typing |
| [dotenv](https://github.com/motdotla/dotenv) | ^16 | Environment variable management |
| Node.js | ≥18 | Runtime |

---

## Prerequisites

- **Node.js ≥ 18** — [download](https://nodejs.org)
- **npm ≥ 9** — bundled with Node.js

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd sourgum-e2e

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (Chromium only by default)
npx playwright install chromium

# 4. Set up environment variables
cp .env.example .env
# Edit .env and fill in TEST_USER_EMAIL / TEST_USER_PASSWORD if running positive login tests

# 5. Run the tests
npm test
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests headlessly |
| `npm run test:headed` | Run tests with a visible browser window |
| `npm run test:ui` | Open Playwright's interactive UI mode |
| `npm run test:report` | Open the last HTML test report |
| `npm run codegen` | Launch Playwright's code generation tool |

---

## Folder Structure

```text
sourgum-e2e/
├── fixtures/
│   └── baseTest.ts          # Extends Playwright test with auto-injected page objects
├── pages/
│   ├── base.page.ts         # Abstract base class shared by all page objects
│   └── login.page.ts        # POM for the Sourgum authentication flow
├── playwright-config/
│   ├── env.ts               # Typed environment variable loader (.env → frozen object)
│   ├── projects.ts          # Browser project matrix (Chromium active; Firefox/WebKit commented)
│   └── reporters.ts         # Reporter config: list, HTML, JUnit
├── tests/
│   └── auth/
│       └── login.spec.ts    # Auth test suite (negative login covered; positive ready to add)
├── utils/
│   ├── api-client.ts        # Reusable typed HTTP client for API-level test setup
│   └── logger.ts            # Structured timestamped logger
├── .env                     # Local environment variables (git-ignored)
├── .env.example             # Template — copy to .env and fill in values
├── playwright.config.ts     # Root Playwright configuration
├── tsconfig.json            # Strict TypeScript compiler settings
└── package.json
```

---

## Test Coverage

### `tests/auth/login.spec.ts`

| Test | Type | Status |
|---|---|---|
| Shows error for invalid credentials | Negative / UI | ✅ Passing |
| Authenticates a valid user | Positive / UI | 🔜 Ready to add credentials |

**Flow tested (negative case):**
1. Navigate to `sourgum.com` → assert page title
2. Click top-right **Login** link
3. Assert `dashboard.sourgum.com/signin` loaded with welcome message
4. Submit invalid credentials
5. Assert transient error toast is visible
6. Assert URL remains on sign-in page

---

## Environment Variables

See [.env.example](.env.example) for the full reference. Key variables:

| Variable | Description |
|---|---|
| `BASE_URL` | Marketing site base URL (`https://sourgum.com`) |
| `API_BASE_URL` | API base URL for `ApiClient` |
| `HEADLESS` | `true` = no browser window, `false` = headed |
| `CI` | Enables retries and stricter settings for CI pipelines |
| `TEST_USER_EMAIL` | Valid user email for positive login tests |
| `TEST_USER_PASSWORD` | Valid user password for positive login tests |
| `TEST_INVALID_EMAIL` | Invalid email used in negative login tests |
| `TEST_INVALID_PASSWORD` | Invalid password used in negative login tests |

---

## Design Decisions

**Why Page Object Model?**
Selectors and actions are defined once in a class. When the UI changes, only the page object needs updating — not every test.

**Why custom fixtures?**
`base.extend()` means page objects are instantiated fresh per test automatically. Tests stay clean — no `beforeEach` setup boilerplate.

**Why modular playwright-config/?**
Splitting env, projects, and reporters into separate files keeps `playwright.config.ts` readable and makes individual concerns easy to modify without touching the root config.

**Why move credentials to .env?**
Hardcoded credentials in test files are a security risk and a maintenance burden. Environment variables let CI inject secrets without touching source code.
