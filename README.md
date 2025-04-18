
# SkySurvey - Client Application

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18.x or higher recommended (Check SvelteKit documentation for current minimums).
*   **npm** (or pnpm/yarn): Comes bundled with Node.js.

## Getting Started

Follow these steps to set up the project locally for development:

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [repository-directory-name]
    ```

2.  **Install dependencies:**
    *   Using npm:
        ```bash
        npm install
        ```
    *   Using pnpm:
        ```bash
        pnpm install
        ```
    *   Using yarn:
        ```bash
        yarn install
        ```
    *(Choose the package manager used by the project, typically indicated by a `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` file).*

## Running the Development Server

To run the application locally with hot-reloading:

```bash
npm run dev -- --open


(Replace npm with pnpm or yarn if you used a different package manager).

This will typically start the development server on http://localhost:5173. The --open flag automatically opens the application in your default web browser.

Building for Production

To create an optimized production build:

npm run build
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

(Replace npm with pnpm or yarn if necessary).

This command will generate the necessary static assets or server code, depending on the SvelteKit adapter configured in svelte.config.js (e.g., adapter-static, adapter-node, adapter-vercel). The output location will vary based on the adapter (often a build/, .svelte-kit/output/, or similar directory).

Refer to the specific adapter's documentation for details on deploying the built output.

Project Structure (Key Directories)

src/

lib/: Contains shared Svelte components (like SurveyForm.svelte), utility functions, stores, and library code.

routes/: Defines the application's pages and API routes. Each sub-directory typically corresponds to a URL path. Files like +page.svelte define the UI for a route.

app.html: The main HTML template file.

static/: Contains static assets (like images, fonts, favicons) that are served directly without processing.

svelte.config.js: Configuration file for SvelteKit, including adapters and preprocessors.

vite.config.js: Configuration file for Vite, the underlying build tool.

package.json: Lists project dependencies and scripts.

Environment Variables

If the application needs to connect to an API or requires configuration keys:

Create a .env file in the project root.

Define environment variables, prefixing those intended for client-side browser access with VITE_. For example:

VITE_API_BASE_URL=https://api.example.com/v1
SECRET_KEY=do-not-expose-this-in-vite-prefixed-vars
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Env
IGNORE_WHEN_COPYING_END

Access client-safe variables in your Svelte code using import.meta.env.VITE_VARIABLE_NAME.

Important: Do not commit your .env file directly to version control if it contains sensitive information. Use .env.example as a template.

Key Technologies

SvelteKit: The application framework.

Svelte: The UI component language.

Vite: The frontend tooling (dev server, bundler).

CSS: Styling (potentially with preprocessors like PostCSS or SCSS if configured).

Remember to replace placeholders like [your-repository-url] and [repository-directory-name] with your actual project details.

IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END