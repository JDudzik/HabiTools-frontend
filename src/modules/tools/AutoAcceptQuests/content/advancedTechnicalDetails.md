This tool creates a webhook on your Habitica account. That webhook tells Habitica to send HabiTools a message whenever your party opens a quest.

When that event is received, HabiTools immediately requests the quest information from the Habitica API and accepts the quest invitation on your behalf.

As a fallback, HabiTools also sets up an interval routine (through a cron job) every 3 hours. This backup check looks for an active party quest and accepts it if webhook delivery was delayed or missed by the Habitica API.