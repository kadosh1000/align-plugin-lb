const dbHelper = require("./db");
const waiterHelper = require("./waiter.helper");

async function loadBalance(action, settings) {
  dbHelper.set(settings);

  return await waiterHelper.waitForFreeAgents(
    action.params.environment,
    action.params.projectId,
    {
        // default value should be 30000 (30 seconds)
        checkInterval: settings.checkInterval ? parseInt(settings.checkInterval) : 30000,
        // default value should be up to 100
        maxRetries: settings.maxRetries ? parseInt(settings.maxRetries) : 100
    }
  );
}

module.exports = {
  loadBalance,
};

/**
 * This is for local testing only, please remove before zipping
 */
/*settings = {
  dbUri: "mongodb://qasus1kaholosrv2.aligntech.com:27017/kaholo_2-0-0",
  dbName: "kaholo_2-0-0",
  checkInterval: 5000
};

action = {
  params: {
    environment: ['scanner','ppr'],
    projectId: "5f9acf334a6bad0011fddc94"
  },
};s

loadBalance(action,settings).then(console.log).catch(console.error);*/