const dbHelper = require("./db");
const waiterHelper = require("./waiter.helper");

async function loadBalance(action, settings) {
  dbHelper.set(settings);

  return await waiterHelper.waitForFreeAgents(
    action.params.environment,
    action.params.mapsToCheck,
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
  dbUri: "mongodb://127.0.0.1:27017/kh-local-1",
  dbName: "kh-local-1",
  checkInterval: 5000
};

action = {
  params: {
    environment: "",
    mapsToCheck: [
      "5ee5eaf5f9ef6000110b19df",
      "5f97f12cdd8391c36068cdad",
      "5ece6856ea838c001115d619",
      "5ecbc359ea838c0011941087",
      "5eb84905abf3120018bb8048",
      "5eaf203bc381ce00118099e8",
      "5ea2e4f7c476460011f13380",
      "5ea2e4c1c476460011f130c7",
      "5ea2e460c476460011f12b50",
    ],
  },
};

loadBalance(action,settings).then(console.log).catch(console.error);*/