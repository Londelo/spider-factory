---
name: bead-lease
description: >
  Run `bd heartbeat <ticket>` every few minutes while you work, or your claim lapses and someone else
  takes the ticket.
  Trigger: "heartbeat", "bd heartbeat", "hold the ticket", "keep the lease".
---

# Hold your ticket

Your claim expires while you work. Run this every few minutes:

```bash
bd heartbeat <ticket>
```

If you go quiet it lapses with no warning, and someone else can take your ticket.
