The **Auto Start Quests** tool will automatically start quests for you. After a quest has been opened for the party to join, it waits the allotted amount of time before starting the quest.

**Why are the only options 24 or 3 hours?**
These options cover the most number of use-cases while also ensuring some specific edge-cases are handled.
- **24 Hours**: Select this option if most of your party is not using scripts to automatically join. This means everyone across all timezones have a fair chance to join the quest before it starts.
- **3 Hours**:  Select this option if your party requires or mostly uses the [Auto-accept quests tool](/tools/auto-accept-quests/) (or alternatives). When everyone accepts it, then the quest starts automatically anyways, but this timeframe covers a very specific problem on the Habitica API where it sometimes doesn't report that a quest has started to a user who would otherwise automatically join.
