const { ObjectID, MongoClient } = require("mongodb");

class MongoHelper {
    constructor() {
        this.dbUri = "";
        this.dbName = "";
    }

    set(settings) {
        this.dbUri = settings.dbUri;
        this.dbName = settings.dbName;
    }

    async getMapsIdsByProject(projectID) {
        const collection = "maps";
        const query = {
            project: ObjectID(projectID),
        };

        const queryOptions = {
            fields: {
                _id: 1,
            },
        };

        const db = await this.getDbClient();
        const results = await db.collection(collection).find(query, queryOptions).toArray();
        return results.map((res) => res._id.toString());
    }

    async getLivingAgents(agentTags) {
        const collection = "agents";
        const query = {
            "status.state": "online",
        };

        const queryOptions = {
            fields: {
                name: 1,
                status: 1,
            },
        };

        // If specific agentTags specified add to query
        if (agentTags) {
            if (!Array.isArray(agentTags)) {
                throw "Tags must be an array";
            }
            query.attributes = {
                $all: agentTags,
            };
        }

        const db = await this.getDbClient();
        const results = await db.collection(collection).find(query, queryOptions).toArray();
        return results;
    }

    async getRunningExecutions(mapsToCheck) {
        const collection = "mapResults";
        const query = {
            status: "running",
            map: {
                $in: mapsToCheck.map((id) => new ObjectID(id)),
            },
        };
        const queryOptions = {
            fields: {
                "agentsResults.agent": 1,
                map: 1,
                status: 1,
            },
        };

        const db = await this.getDbClient();
        const results = await db.collection(collection).find(query, queryOptions).toArray();
        return results;
    }

    async getDbClient() {
        const db = await MongoClient.connect(this.dbUri);

        return db.db(this.dbName);
    }
}

module.exports = new MongoHelper();
