This tool creates a webhook on your Habitica account so Habitica can notify HabiTools when party quest events happen.

When relevant events are received, HabiTools tracks the quest state and starts the quest automatically after the wait mode you selected at activation time (3 or 24 hours).

As a fallback, HabiTools also runs periodic checks through a cron routine to verify pending quest-start actions in case webhook delivery is delayed or missed by the Habitica API.