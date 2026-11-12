# PDF automation

The [Build and release CV PDF](../.github/workflows/cv-pdf.yml) workflow builds
`README.md` into `cv.pdf` whenever the CV, its PDF styling, dependencies, or
workflow changes on `main`. Push these files to `main` to create the first release.
You can also use **Actions → Build and release CV PDF → Run workflow** on `main`.

Every successful run creates a new GitHub release with a unique
`cv-<run-number>-<run-attempt>` tag pointing to the source commit, attaches
`cv.pdf`, and marks the release as latest. Earlier releases remain available.
Builds also retain a workflow artifact for 14 days.

The permanent download link is:

**https://github.com/andrianovsky/cv/releases/latest/download/cv.pdf**

The link starts working after the first successful release. Keep the asset name
`cv.pdf` unchanged to preserve it. Publishing another release as latest should
also include this asset if you want the link to continue working.

The workflow uses GitHub's automatic `GITHUB_TOKEN` with `contents: write`;
no personal access token or additional secrets are needed. GitHub Actions must
be enabled, and repository or organization policy must allow the workflow's
write permission.

## Local build

Local setup is optional: GitHub Actions installs everything and publishes the
PDF automatically. You only need the commands below to generate a preview on
your own computer.

With Node.js 24 or newer installed, run from the repository root:

```sh
npm ci
npm run build:pdf
```

`npm ci` installs the exact package versions from `package-lock.json`. The
`postinstall` script in `package.json` then automatically installs the Chromium
headless shell used to print the PDF. A separate browser-install command is not
needed. If that browser version is already cached, it is reused.

After setup, use just `npm run build:pdf` when editing the CV. Run `npm ci` again
after dependency changes or when setting up a fresh checkout.

On Linux, use `npx playwright install-deps chromium` to install any missing
system libraries too; the workflow does this automatically. The generated file
is `output/pdf/cv.pdf` and is ignored by Git. To build with an existing Chromium
browser, set `CHROMIUM_EXECUTABLE_PATH` to its executable path before building.

The build uses Markdown and Chromium with A4 print styles from
[`scripts/pdf.css`](../scripts/pdf.css). Edit `README.md` to update the CV;
there is no separate copy of its content. Blocks between
`<!-- pdf:exclude:start -->` and `<!-- pdf:exclude:end -->` are omitted from the
PDF, so the README can display its download link without adding it to the CV.
