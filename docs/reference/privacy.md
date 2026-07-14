# Privacy and Compliance

YourTraffic is privacy-first by design. It sets no cookies and stores no personal data, so there is no consent banner and compliance with GDPR, CCPA and PECR comes by default.

## Why most tools need a banner

Under GDPR and PECR you need consent before setting non-essential cookies or processing personal data. Google Analytics and tools like it do both, which is what triggers the banner. It is the tracking method that creates the requirement, not the law being awkward.

## How cookie-free counting works

YourTraffic counts visits without cookies and without storing personal data. Visitors are counted with a rotating, salted hash that cannot be traced back to a person. The salt is derived from your `BETTER_AUTH_SECRET`, and because it rotates, the hash is not a stable identifier for a person over time.

You still get accurate visitors, pageviews, sources and countries, just without the identifiers that need consent.

## What is collected

From each pageview beacon YourTraffic derives:

- The page path.
- The referrer host, if any.
- Country, browser, operating system and device.
- A rotating, salted visitor hash.
- Time on page, from a short leave beacon.

No cookies. No storage on the visitor's device. No personal data.

## Data ownership

When you self-host, every event lands in a Postgres database you control and never leaves your infrastructure. You pick the region, the backups and who has access, which makes data residency and retention rules straightforward to meet.

## Easy to audit

The code is open under the MIT license and, when self-hosted, the data is yours. Your security team can read exactly what is collected, confirm there are no cookies and no personal data, and confirm where it is stored.
