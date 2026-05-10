# GitHub Setup Checklist (Upptime CURC)

Complete these once in GitHub for `d33bs/upptime-curc`.

## 1) Actions permissions

Repo Settings -> Actions -> General:

- Workflow permissions: **Read and write permissions**
- Enable: **Allow GitHub Actions to create and approve pull requests** (recommended)

## 2) Pages

Repo Settings -> Pages:

- Source: **Deploy from a branch**
- Branch: **`gh-pages`** (root)

Upptime deploys via `peaceiris/actions-gh-pages` in `Static Site CI`.

## 3) Optional PAT secret (if org policy blocks default token)

If workflow commits or page deploy fail due to token restrictions, add a PAT:

- Repo Settings -> Secrets and variables -> Actions
- New repository secret: `GH_PAT`
- Scopes: `repo` (private) or public-repo equivalent as needed

Workflows already use `${{ secrets.GH_PAT || github.token }}`.

## 4) First run bootstrap

After pushing config changes, run this manually once:

- Actions -> **Setup CI** -> **Run workflow**

Then confirm these workflows succeed:

- Uptime CI
- Response Time CI
- Summary CI
- Graphs CI
- Static Site CI

## 5) Expected schedules

- Uptime CI: hourly (`0 * * * *`)
- Response Time CI: hourly (`0 * * * *`)
- Other maintenance/site workflows: daily
