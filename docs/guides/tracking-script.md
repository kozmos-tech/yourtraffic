
# Tracking Script

The tracking script is the only thing you add to your site. It is a few hundred bytes, sets no cookies, reads no storage and needs no configuration.

## Install

Add one line to the `<head>` of every page you want to track.

```html
<script defer src="https://yourtraffic.dev/script.js"></script>
```

On a self-hosted instance, use your own origin in place of `yourtraffic.dev`. The script posts events to `/api/event` on the same origin it was loaded from, so the self-hosted build works with no changes.

Add the website in the dashboard first, then drop the snippet in. Stats appear within seconds of the first real visit.

## What it sends

The script sends one small beacon per pageview. From that beacon YourTraffic derives:

- The page path.
- The referrer host, if any.
- Country, browser, operating system and device, from the request and user agent.
- A rotating, salted visitor hash that cannot be traced back to a person.

No cookies are set and no personal data is stored.

## Single-page apps

The script follows client-side navigation on its own. On a single-page app it detects route changes and records a pageview for each one, so you do not need to call anything manually.

## Time on page

When a visitor leaves a page, the script sends a short leave beacon with how long they stayed. This powers the time-on-page reading in the dashboard.

## Custom events

Track a specific action, such as a signup or a button click, by calling `window.yt` with an event name from your own click or submit handler.

```js
window.yt('Signup')
```

Pass an optional object of properties as a second argument to attach custom data to the event. Values may be strings, numbers or booleans.

```js
window.yt('Signup', { plan: 'pro' })
```

Events are counted by name, with no cookies. Read them back with the `by=event` breakdown on the [stats endpoint](../integrations/rest-api.md). Break a single property down by value with `by=prop:KEY`, for example `by=prop:plan`.

## Local development is ignored

Events from `localhost`, `127.0.0.1` and `file://` pages are ignored, so testing locally does not pollute your stats.
