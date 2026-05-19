## How We Protect Your Habitica Credentials

When you connect your Habitica account, we store your User ID and API key so HabiTools can sync your data and run automations.
Because an API key works like a password, we do not store it as plain text.

Your Habitica API key is treated as sensitive at every step with modern encryption, security best-practices, and strict access-control.

Here is how we protect it:
<br />

---

### Encrypted before reaching our database

As soon as you provide your Habitica API key, it is encrypted with **AES-256-GCM**. The value saved in our database is unreadable, and your real key is never stored directly.
<br />

---

### The Master secret is stored separately

A separate master secret is required to decrypt data. We keep it in a **server-side secrets manager**, not in the database. So just a copy of the database is not enough to decrypt your key.
<br />

---

### Every key is uniquely encrypted

Even if two users had the same API key, their stored values would look different. We add a **random 32-byte salt** for each encryption so records cannot be compared in any useful way.
<br />

---

### Tampering is detected automatically

AES-GCM includes an **authentication tag**. Before decrypting, we verify that tag. If stored data was changed, decryption is rejected.

<br />

---

### Additional Measures

- We enforce **TLS connections**, including client to API, API to database, and API to Habitica servers. This protects your key and related data while it is in transit.
- We avoid keeping plaintext secrets in memory longer than necessary and clear in-memory variables after use where the runtime allows it. This reduces exposure if a process is inspected or unexpectedly retained in memory.
- A user can remove their Habitica connection anytime and we immediately wipe the data from our servers and database.
- The codebases are open-source and can be publicly validated and tested. 
    - [Frontend codebase](https://github.com/JDudzik/HabiTools-frontend).
    - [Backend codebase](https://github.com/JDudzik/HabiTools-backend).