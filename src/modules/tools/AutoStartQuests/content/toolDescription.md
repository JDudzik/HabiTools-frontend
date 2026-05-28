The **Auto Start Quests** tool will automatically start quests for you after a certain amount of time. When a quest has been opened for the party, it will wait for the allotted amount of time and then automatically start the quest.

**Why are the only options 24 or 3 hours?**
These options cover the most number of use-cases while also ensuring some specific edge-cases are handled.

**24 Hours**: Select this option if most of your party is not using scripts to automatically accept quest invitations. This makes it so everyone across any timezones has a fair chance to join the quest before it starts.
**3 Hours**:  Select this option if your party requires or mostly uses the [Auto-accept quests tool](/tools/auto-accept-quests/) (or alternatives). When everyone accepts it, then the quest starts automatically anyways, but this option covers a very specific problem on the Habitica API where it sometimes doesn't report that a quest has started to a user who would otherwise automatically join.
