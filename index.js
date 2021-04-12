const core = require('@actions/core');
const github = require('@actions/github');

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
  console.log("OCTOKIT PRINT", octokit.request('GET /users/{username}', {
    username: 'username'
  }))












  // const {payload: {pull_request:pullRequest ,repository} } = github.context

  // const repoFullName = repository?.full_name;

  // if(!repoFullName || !pullRequest){
  //   core.error('this action do not work')
  //   // core.setOutput('comment-created','false')
  // }else{
  //   const {number: issueNumber} = pullRequest
  //   const [owner,repo] = repoFullName.split("/")

  //   const octokit = github.getOctokit(repoToken)
  //   const contentFile = core.getInput('content');

  //   await octokit.repos.createOrUpdateFileContents({
  //     owner,
  //     repo,
  //     path: './master.xml',
  //     message: 'update master.xml',
  //     content: contentFile,
  //     committer?: {
  //       name: await octokit.request('GET /users/{username}', {
  //         username: 'username'
  //       })
  //     }

  //   })
    



  // }


} catch (error) {
  core.setFailed(error.message);
}