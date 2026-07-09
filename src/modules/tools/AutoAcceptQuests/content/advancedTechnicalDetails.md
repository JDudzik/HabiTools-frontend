**A Significant Benefit**: Having your whole party set to auto-accept quests (or at least most of them) provides a significant advantage.
Habitica only tallies your _quest progress_ on your very first login of each day, so if no quest is active at that moment, any tasks you completed the previous day are wasted, but when everyone has auto-accept enabled, quests will start automatically before anyone has to open Habitica, so no one's progress gets lost!

---

**How this tool works under the hood**: This tool creates a webhook on your Habitica account. That webhook tells Habitica to send HabiTools a message whenever your party opens a quest.
When that event is received, HabiTools immediately requests the quest information from the Habitica API and accepts the quest invitation on your behalf.
As a fallback, HabiTools also sets up an interval routine (through a cron job) every 3 hours. This backup check looks for an active party quest and accepts it if webhook delivery was delayed or missed by the Habitica API.