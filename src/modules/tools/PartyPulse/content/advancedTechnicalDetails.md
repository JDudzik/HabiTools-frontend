Party Pulse stores a score record for each party member and updates it on each pulse, which triggers every 24 hours.

Each pulse checks the `lastLoggedIn` value from Habitica's party member data. If a member was active in the last 24 hours, their score increases by 1. If not, their score decreases by 1.

Scores are clamped between -14 and 14. A tier is derived from the current score and used to color each member row.