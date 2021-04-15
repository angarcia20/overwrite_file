const core = require('@actions/core');
const github = require('@actions/github');
const { Base64 } = require("js-base64");
const fs = require("fs");
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

function arrayResult(fileAdded){
  var files='';
  files=fileAdded;
  files= files.replace(/["']/g, "");
  files=files.replace('[','');
  files=files.replace(']','');

  if(fileAdded.length <= 2 ){
    //core.error('Files added is null , try to add a new files...!')
    return -1;
  }else{
    var array=files.split(',');
    return array;
  }

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

    const FilesAdded = core.getInput('files-added');
    console.log('result',  FilesAdded);
    console.log('length from file',  FilesAdded.length);

    var array= await arrayResult(FilesAdded);
      if(array === -1){
        core.setFailed('Files added is null , try to add a new files...!')
      }
      else{
        console.log('result from function', array);
        console.log('length from array', array.length);
      }



    //-----------------------------------------------------------------------//


  // const {payload: {pull_request:pullRequest ,repository} } = github.context

  // const repoFullName = repository.full_name;
  // console.log("REPOSITORY", repoFullName)

  // if(!repoFullName){
  //   core.error('this action do not work')
  //   // core.setOutput('comment-created','false')
  // }else{
  //   const [owner,repo] = repoFullName.split("/")

  //   const octokit = github.getOctokit(repoToken)
  //   const username = await octokit.request('GET /user')
  //   const email = username.data.login + "@poligran.edu.co";
  //   const sha = await getSHA(owner,repo,'master.xml');
  //   const contentFile = Base64.encode('F from here');

  //   await octokit.repos.createOrUpdateFileContents({
  //     owner,
  //     repo,
  //     path: 'master.xml',
  //     message: 'update master.xml',
  //     content: contentFile,
  //     sha,
  //     committer: {
  //       name: username.data.login,
  //       email: email
  //     },
  //     author: {
  //       name: username.data.login,
  //       email:email
  //     }
  //   })
  // }
} catch (error) {
  core.setFailed(error.message);
}
}
Run();

