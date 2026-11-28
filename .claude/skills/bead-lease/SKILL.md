---
name: bead-lease
description: >
  How to HOLD a ticket you have claimed: the lease. A claimed ticket is yours for five minutes at a
  time, and nothing in this system reaps a lapsed one — it simply stops being yours, announced by
  nothing at all. One command renews it: `bd heartbeat <ticket>`, run between every long step, never
  letting five minutes pass in silence. `bd reclaim <ticket>` is one command away for a person and it
  hands your ticket to another worker mid-work, which is why a lapsed lease is a lost ticket and not a
  harmless one. Use it whenever you are working a ticket you claimed, whenever a build, a test suite,
  or a long stretch of reading is about to eat your five minutes, and whenever you find a ticket
  claimed by nobody. This skill only holds the lease: it never claims, never closes, never edits a
  field.
  Trigger: "keep the lease", "heartbeat", "bd heartbeat", "hold the ticket", "my lease lapsed",
  "someone else has my ticket", "bd reclaim".
---

# Holding a lease

You claimed the ticket. The claim lasts five minutes and renews only when you say so.

```bash
bd heartbeat <ticket>
```

Run it between every long step — before a build, after a suite, whenever five minutes could pass
without you touching the database. Silence is not a lapse you will be told about: nothing in this
system reaps a lapsed lease, no warning prints, and the ticket simply becomes claimable by anyone. A
person can take it with `bd reclaim <ticket>`, and another worker can then be working your branch
while you still are.

Renewing is the only action here. Never claim, never close, never edit a field.
