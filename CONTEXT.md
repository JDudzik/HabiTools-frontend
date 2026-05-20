# Habitools Frontend

This context defines the product language for Habitica connection and tool activation flows so UI, API integration, and copy use consistent terms.

## Language

**Habitica Link Status**:
The connection state between a Habitools User and a Habitica Account, which is either Linked or Unlinked.
_Avoid_: Connection health, sync status, tool status

**Linked**:
The Habitools User has connected a Habitica Account and can now enable Habitica Tools.
_Avoid_: Active, synced

**Unlinked**:
The Habitools User has not connected a Habitica Account and cannot enable Habitica Tools.
_Avoid_: Disabled, expired

**Habitica Tool Instance**:
A separately managed automation instance that can only exist when Habitica Link Status is Linked.
_Avoid_: Link status, account status

**Active Tool Instance**:
A Habitica Tool Instance with functioning automation currently turned on for the user.
_Avoid_: Linked account, authenticated session

**Inactive Tool Instance**:
The tool functionality is not currently turned on for the user, either because no instance exists or the instance was deactivated/expired.
_Avoid_: Unlinked account, logged out user

**Tool Resource ID**:
The identifier passed from a tool page to generic tool actions such as refresh or teardown.
_Avoid_: Link ID, account ID

## Relationships

- A **Habitools User** has one **Habitica Link Status**
- **Habitica Link Status** must be **Linked** before any **Habitica Tool Instance** can be enabled
- **Habitica Tool Instance** lifecycle does not define **Habitica Link Status**
- **Active Tool Instance** and **Inactive Tool Instance** describe tool functionality, not account-link state
- For each tool type, there is at most one **Active Tool Instance** for a user at a time
- Tool event history shown on a tool page is scoped agnostically by **Tool Resource ID**
- Generic tool actions operate on a **Tool Resource ID** provided by the relevant tool page

## Example dialogue

> **Dev:** "If a user has no active auto-accept quest tool, are they unlinked?"
> **Domain expert:** "No. Link status is separate. They can be Linked with zero active Habitica Tool Instances."

## Flagged ambiguities

- "status" can mean both account connection and tool lifecycle; resolved: use **Habitica Link Status** for connection, and **Habitica Tool Instance** for tool lifecycle.
