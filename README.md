# align-plugin-lb
Align load balancer plugin

## Settings

* DB URI - The connection string to the MongoDB
* DB Name - The name of the DB. (Default: "kaholo" - as used in Align)
* Retries interval (ms) - The amount of milliseconds to wait between each retry (Default:30000 - 30 seconds)
* Max Retries - The maximum amount of retries to do before marking the action as failed (Defualt: 100)

## Method: Wait for free agent

**Description:**

Waits until there is a free agent. If tehre isn't a free agent, the method will do a retry based on the `Max Retries` setting.

**Parameters:**

* Environment - The Align environment to look for agents in (i.e. E6)
* Maps (Array) - Array of maps IDs to include for checking executions in. **Notice:** This is a code only parameter. 