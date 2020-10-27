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

  async getLivingAgents(environment) {
    const collection = "agents";
    const query = {
      "status.alive": true,
      attributes: {
        $all: ["scanner"],
      },
	};
	
	const queryOptions = {
		fields: {
			name : 1,
			status : 1
		}
	}

    // If specific environment specified add to query
    if (environment) {
      query.attributes.$all.push(environment);
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
			$in : mapsToCheck.map(id=> new ObjectID(id))
		}
	};
	const queryOptions = {
		fields: { 
			"agentsResults.agent": 1, 
			"map": 1, 
			"status": 1 
		}
	}

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
