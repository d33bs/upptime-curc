# CU Research Computing Status

This repository uses [Upptime](https://upptime.js.org) to monitor practical CURC user access points (login, Open OnDemand, and data-transfer reachability), plus key documentation and partner endpoints.

Live status page: `https://d33bs.github.io/upptime-curc/`

## Current status

<!--start: status pages-->
<!--end: status pages-->

## Priority order for checks

1. Alpine login node SSH port (TCP reachability)
2. CURC Open OnDemand HTTPS port (TCP reachability)
3. CURC data transfer node SSH port (TCP reachability)
4. CURC Docs
5. Globus Transfer API endpoint
6. ACCESS Registry endpoint
7. Globus website
8. ACCESS website

## Monitored CURC user access points

- Alpine login node SSH port (TCP reachability)
- CURC Open OnDemand HTTPS port (TCP reachability)
- CURC data transfer node SSH port (TCP reachability)

## Monitored public webpages

- CURC Docs
- Globus website
- ACCESS website

## Monitored technical endpoints

- Globus Transfer API endpoint
- ACCESS Registry endpoint

## How it works

- Checks run on a schedule via GitHub Actions
- Downtime opens/closes incidents as GitHub issues
- Historical uptime and response-time data are committed in this repo

## GitHub setup

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for required repository settings and first-run bootstrap steps.
