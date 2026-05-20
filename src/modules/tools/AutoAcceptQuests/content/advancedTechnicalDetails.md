## Advanced Technical Details

### How it works

This tool uses a two-layer approach to maximize reliability:

**1. Webhook (Instant)**
When your party sends a quest invitation, HabiTools receives an instant notification from Habitica and accepts the quest immediately. This provides near-real-time acceptance.

**2. Backup Cron (Hourly Redundancy)**
Every 3 hours, a background job runs to check for any pending quest invitations and accepts them. This acts as a safety net in case the webhook delivery fails or is delayed.

### Data and security

- Your Habitica API key is encrypted and stored securely
- Only quest invitation data is processed; no other account data is touched
- The tool respects Habitica's rate limits and API best practices
- Event history is kept for troubleshooting and transparency

### Expiration and renewal

Each tool instance has a 30-day lease. Before expiration, you can refresh the tool to extend it another 30 days. If it expires without renewal, you'll need to reactivate it. This design ensures stale credentials are periodically validated and the system stays secure.
