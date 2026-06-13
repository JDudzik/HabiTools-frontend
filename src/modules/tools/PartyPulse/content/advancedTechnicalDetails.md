There are a total of 7 tiers (not including calibration). From highest to lowest the tiers are:
'*Paragon*', '*Active*', '*Passive*', '*Coasting*', '*Slowing*', '*Disengaged*', '*Dormant*',

When the pulse occurs, it decides if a member's score goes up or down based on if that player has logged-in within the last 24 hours.

Each pulse checks the `lastLoggedIn` value from Habitica's party member data. If a member was active in the last 24 hours, their score increases by 1. If not, their score decreases by 1. (During calibration, the score is altered by 2, to get them a more accurate tier faster).

Scores are clamped between -14 and 14. A tier is derived from the current score and used to color each member row.

