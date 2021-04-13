const core = require('@actions/core');
const github = require('@actions/github');
const { Base64 } = require("js-base64");
const fs = require("fs");
Run();


async function getSHA(owner,repo,path) {
  const repoToken = core.getInput('repo-token');
  const octokit = github.getOctokit(repoToken)
  const result = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });
  const sha = result.data.sha;
  return sha;
}


async function Run(){
try {
  // `who-to-greet` input defined in action metadata file
  const repoToken = core.getInput('repo-token');
  console.log(`repository ${repoToken}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  const content = core.getInput('content');
  console.log('Content', content);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);

    // const octokit = github.getOctokit(repoToken);
    // const result = await octokit.request('GET /user')
    // console.log("RESULT", result.data.login);


  const {payload: {pull_request:pullRequest ,repository} } = github.context

  const repoFullName = repository.full_name;
  console.log("REPOSITORY", repoFullName)

  if(!repoFullName){
    core.error('this action do not work')
    // core.setOutput('comment-created','false')
  }else{
    const [owner,repo] = repoFullName.split("/")

    const octokit = github.getOctokit(repoToken)
    const username = await octokit.request('GET /user')
    const email = username.data.login + "@poligran.edu.co";
    const sha = await getSHA(owner,repo,'master.xml');
    const contentFile = Base64.encode(core.getInput('./master.xml'))

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: './master.xml',
      message: 'update master.xml',
      content: contentFile,
      sha,
      committer: {
        name: username.data.login,
        email: email
      },
      author: {
        name: username.data.login,
        email:email
      }
    })
  }
} catch (error) {
  core.setFailed(error.message);
}
}