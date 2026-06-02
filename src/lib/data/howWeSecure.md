## **How We Protect Your Habitica Data**

When you connect your Habitica account, we store your User ID and API key so HabiTools can sync your data and run automations.
Because an API key works like a password, we store it with just as much care.

Your Habitica API key is treated as sensitive at every step with modern encryption, security best-practices, and strict access-control.

Here is how we protect this vital data:

---
## *Modern Encryption*

- **AES-256-GCM encryption**: Your API key is encrypted immediately upon submission. Stored values are unreadable; your real key is never stored directly.
- **Master secret stored separately**: A separate master secret in a server-side secrets manager (not the database) is required for decryption. Access to the database is not enough to decrypt your key.
- **TLS for transit**: All connections (client to API, API to database, API to Habitica) enforce TLS encryption to protect your key in transit.
- **Unique encryption per key**: A random 32-byte salt is added for each encryption, so it's not possible to derive keys by comparing patterns.
- **Automatic tampering detection**: AES-GCM's authentication tag is verified before decryption. Any changes to stored data are rejected.

---
## *Accountability*

- **Open-source validation**: The codebases for HabiTools are open-source and can be publicly validated and tested by anyone.
    - [Frontend codebase](https://github.com/JDudzik/HabiTools-frontend).
    - [Backend codebase](https://github.com/JDudzik/HabiTools-backend).
- **User control**: A user can remove their Habitica credentials anytime and we immediately wipe the data from our servers and database.

---
## *Application-Level Safeguards*

- **Isolated credential storage**: Encrypted API keys are stored in a separate credentials table, not with general user profile data. This creates a clear access boundary and keeps keys out of routine user-data queries.
- **No client exposure**: After API keys are encrypted on the server, they're never sent back to frontend state, browser storage, or client-visible payloads.
- **Ephemeral Secret Handling**: Decrypted keys or secrets are only held in local memory scope for the brief operation that needs them, then discarded.
- **No logging secrets**: API keys are never written to application logs, error traces, analytics events, or monitoring payloads.