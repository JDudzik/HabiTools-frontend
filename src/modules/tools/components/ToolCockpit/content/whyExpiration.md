## Why Do Tools Expire?

HabiTools tools use a **30-day lease** system to keep your account secure and data fresh.

### The reasoning

**Security & validation**: Requiring periodic renewal ensures your Habitica credentials are still valid and your account hasn't been compromised. If your account is hacked, a lost tool will stop working within 30 days instead of continuing indefinitely.

**Data freshness**: Reconnecting periodically helps us validate that your linked account is still active and your preferences haven't changed on the Habitica side.

**Service reliability**: Leases help us manage active tool instances efficiently and provide better support for monitoring tool health.

### What happens at expiration

When a tool expires:
- Automation stops immediately (webhooks and crons are disabled)
- Your event history is preserved for reference
- You can reactivate with one click—all your settings remain the same
- No data is deleted; everything stays on file

### Refreshing before expiration

You can refresh a tool anytime while it's active to extend its lease another 30 days. Refresh as often as you want—there's no penalty for early renewal.
