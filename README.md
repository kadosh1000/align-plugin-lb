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

* Agents Tags - The tags to look for inside the agents. Tags passed will require all of them (AND operator).
* Maps (Array) - Array of maps IDs to include for checking executions in. **Notice:** This is a code only parameter. 

**Return Value:**

The methods returns the first available agent it finds. The object contains the following:

	{
        name: "AGENT_NAME",
        _id: AGENT_ID (ObjectID)
    }