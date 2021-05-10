/**
 * This file is responsible for the main business logic of the balancer
 * It retrives the agents and the executions, checkes which agents are free and return the first free one.
 */

const dbHelper = require("./db");

class WaiterHelper {
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 
   * @param {string} environment - The addition enviorment to match the agents to (beside for "scanner")
   * @param {string} projectId - Id of the project that contains the load balanced maps
   * @param {*} options.checkInterval - The interval in ms to wait between each check.
   * @param {*} options.maxRetries - The maximum amount of retries to do befoe failing the action
   * @param {*} options.currentRetry - The current retry number. This is a recursive function so it increase itself.
   */
  async waitForFreeAgents(
    agentTags,
    projectId,
    { checkInterval, maxRetries, currentRetry }
  ) {
    const agents = await dbHelper.getLivingAgents(agentTags);

    const mapsToCheck = await dbHelper.getMapsIdsByProject(projectId);

    const runningExecutions = await dbHelper.getRunningExecutions(mapsToCheck);

    const freeAgents = agents.filter((agent) => {
      // Check if any of the executions is using the agent
      return !(runningExecutions.some((execution) => {
        // check if the agent is used by any of the agent results
        // return the oposite because we want to get only non used agents
        return execution.agentsResults.some((agentResult) => {
          return agentResult.agent.toString() === agent._id.toString();
        });
      }));
    });

    // If found free agents return the first one
    if (freeAgents.length) {
      return freeAgents[0];
    }
    // If specified max amount of retries, and reached amount, stop and throw error
    else if (maxRetries && currentRetry == maxRetries) {
      throw "Reached maximum amount of retries";
    }
    // Continue for the next retry
    else {
      await this.sleep(checkInterval);
      const nextRetry = currentRetry ? currentRetry + 1 : 2;
      // console.log(`Failed to find, continue to try ${nextRetry}`);
      return this.waitForFreeAgents(agentTags, projectId, {
        checkInterval,
        maxRetries,
        currentRetry: nextRetry,
      });
    }
  }
}

module.exports = new WaiterHelper();
