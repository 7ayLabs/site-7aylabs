# Branching and commits

How work moves from a laptop to 7aylabs.com. The rules here are enforced by
the workflows in `.github/workflows/`; if this document and a workflow
disagree, fix both in the same commit.

## 1. The flow

```
feat/<scope>/<name>  ─┐
fix/<scope>/<name>   ─┴─>  epic/vX.Y.Z-<name>  ──>  testing  ──>  main
                                                     staging      production
```

1. **Work branches** are short-lived and branch from the current epic:
   `feat/<scope>/<name>` for new behaviour, `fix/<scope>/<name>` for
   corrections. `<scope>` is one of the commit scopes in section 4.
   Examples: `feat/contact/form-validation`, `fix/nav/mobile-focus-trap`.
2. **Epic branches**, `epic/vX.Y.Z-<name>`, collect the work for one
   release. Work branches merge into the epic through pull requests.
   Example: `epic/v2.0.0-company-site`.
3. **`testing`** is the staging branch. An epic merges into `testing` when
   it is ready to be looked at as a whole.
4. **`main`** is production. Only `testing` (a release) or a `hotfix/*`
   branch merges into `main`.

Nobody pushes directly to `main` or `testing`; changes arrive by pull
request with CI green.

## 2. Branches and environments

| Branch | Environment | URL | Deploys |
| --- | --- | --- | --- |
| `main` | production | https://7aylabs.com | automatically, on every push |
| `testing` | staging | https://test.7aylabs.com | on request: `gh workflow run deploy.yml --ref testing` |
| `epic/*`, `feat/*`, `fix/*`, `hotfix/*` | none | | CI only |

Staging is deployed on request rather than on every push, so iterating on
`testing` does not rebuild an image nobody has asked to see. Staging is
served with `X-Robots-Tag: noindex, nofollow`.

## 3. Hotfixes

For a production problem that cannot wait for the next release:

1. Branch `hotfix/<scope>/<name>` from `main`.
2. Open a pull request into `main`. CI must pass.
3. After it merges and deploys, merge `main` back into `testing` and into
   any open epic, so the fix is not lost by the next release.

If production is broken right now, roll back first (Actions, Rollback; see
`docs/ops/runbook.md`) and fix afterwards.

## 4. Commit messages

Conventional commits, checked by `.github/workflows/commit-conventions.yml`
on every push and pull request:

```
type(scope): description
```

- The description starts lowercase, uses the imperative ("add", not
  "added"), and has no trailing period.
- The scope is optional but expected whenever one fits.
- `!` after the type or scope marks a breaking change: `feat(api)!: ...`.

**Types:** `feat` `fix` `refactor` `test` `docs` `chore` `perf` `build`
`ci` `style` `revert` `merge` `release` `security` `copy`

**Scopes:**

| Area | Scopes |
| --- | --- |
| Pages | `home` `vizzor` `about` `updates` `contact` `legal` |
| Shared interface | `nav` `footer` `ui` `motion` |
| Content and reach | `i18n` `seo` `en` `es` `fr` |
| Server | `api` `db` |
| Delivery | `ci` `deploy` `infra` `docker` `deps` `config` `security` |
| Project | `docs` `release` `archive` |

Examples:

```
feat(contact): store submissions before sending the notification
fix(nav): close the menu when the route changes
copy(es): tighten the about page intro
ci(deploy): pin the image only after the smoke test passes
chore(deps): bump next to 15.5.28
```

If a scope is missing, add it to this table and to the `SCOPES` list in
`commit-conventions.yml` in the same commit.

Release pull requests (`testing` or an epic into `main`) are not re-checked
commit by commit: their history was already checked on the branches that
introduced it.

## 5. No AI attribution

Commits and pull requests carry **no AI attribution and no co-author
trailers for tools**. That means none of the following, anywhere in a commit
message or a pull request description:

- a `Co-Authored-By:` trailer naming an assistant or its vendor;
- a "Generated with ..." line or badge.

`.github/workflows/attribution-guard.yml` rejects new commits that contain
them. If a tool added one, amend the commit and push again.

Also keep commits, code and copy free of references to other companies'
products, apart from the tools the project actually uses.

## 6. Pull requests

- Target the right base: work branch into its epic, epic into `testing`,
  `testing` into `main`.
- CI must be green: typecheck, lint, tests, build, dependency audit, image
  build and boot, script lint, secret scan, commit conventions, attribution
  guard.
- Keep them small enough to review. One concern per pull request.
- Never commit secrets, host addresses or anything from an env file. The
  repository is public. See `SECURITY.md`.

## 7. Releases

1. Merge the epic into `testing`; deploy staging; check it.
2. Open a pull request from `testing` into `main`.
3. Merging it deploys production. The Deploy run must finish green: its
   smoke test confirms the new commit is what the public site serves.
4. Tag the merge commit `vX.Y.Z` on `main`.
