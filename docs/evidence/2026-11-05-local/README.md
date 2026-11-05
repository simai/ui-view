# Local host: live examples on https://ui-view.test

Symptom: on the local host (ServBay, https://ui-view.test, and the review
server on 127.0.0.1:8790) the live examples showed only their static markup
in the Claude desktop browser pane (Chromium 152). No sf-view element was
defined.

Cause: Chromium's Local Network Access. The examples run in Docara's sandboxed
srcdoc frames (`sandbox="allow-scripts"`), whose origin is opaque. In that
browser every request from such a frame to a loopback address fails: script,
stylesheet, CORS fetch and no-cors fetch. It fails even when the server sends
`Access-Control-Allow-Origin: *`, as 127.0.0.1:8790 does. From the same kind of
frame a public host loads, and a frame with `allow-same-origin` loads from the
local host. Playwright's Chromium 1.61 does not enforce this, so the earlier
evidence was green.

Fix (local copies only): `site/scripts/publish-local.sh` and
`site/scripts/serve.mjs` serve the example frames with
`allow-scripts allow-same-origin`. The build on disk keeps Docara's sandbox.

Checked in the pane after `publish-local.sh`, with every frame started: all
seven examples on the three component pages and the two demos have their sf-*
elements defined. The orders table draws 25 rows and the card shows the order.
All eight pages answer 200.

The screenshots are the orders demo at 1440 px, light and dark, taken by
`site/scripts/evidence.mjs` from https://ui-view.test.
