const core = require('@actions/core');
const github = require('@actions/github');

function getInput(): {repoToken: string} {
    const repoToken: string = core.getInput('repo-token');

    return {repoToken}
}
async function run(): Promise<void>{
  try {
    core.debug('Initializing the github action')
    const { repoToken } = getInput()
  } catch (error) {
    core.setFailed(error.message);
  }
}