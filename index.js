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
  //files= files.replace(/["']/g, "");
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

function includeFiles(array) {
  var result='';
  for (let index = 0; index < array.length; index++) {
    result += '<include file='+array[index]+'\n'+
              'relativeToChangelogFile="true" />'+
              '\n';

  }
  return result;
}

async function overwriteFile(master,repoToken){

   const {payload: {pull_request:pullRequest ,repository} } = github.context
    
    const repoFullName = repository.full_name;
    console.log("REPOSITORY", repoFullName);
    console.log('Pull Request', pullRequest);

    if(!repoFullName){
     // core.setFailed('this action do not work')
      return -1;
    }else{
      const [owner,repo] = repoFullName.split("/")

      const octokit = github.getOctokit(repoToken)
      const sha = await getSHA(owner,repo,'master.xml');
      const contentFile = Base64.encode('aa');

      const httpResult= await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: 'master.xml',
        message: 'update master.xml',
        content: contentFile,
        branch: 'main',
        sha
        }
      );
      console.log(httpResult);
      return httpResult.status.toString();
    }

}


async function Run(){
try {
  const repoToken = core.getInput('repo-token');
  console.log(`repository ${repoToken}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);


    const FilesAdded = core.getInput('files-added');

    var array= await arrayResult(FilesAdded);
      if(array === -1){
        core.setFailed('Files added is null , try to add a new files...!')
      }
      else{
        console.log('the following files have been added: ', array);
        var forFilesAdded= await includeFiles(array);
        var master='<?xml version="1.0" encoding="UTF-8"?>\n'+
                   '<databaseChangeLog\n'+
                   'xmlns="http://www.liquibase.org/xml/ns/dbchangelog"\n'+
                   'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
                   'xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog\n'+
                   '              http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">\n'+
                   '\n'+
                   forFilesAdded+
                   '\n'+
                   '</databaseChangeLog>';
        
       const changefile= await overwriteFile(master,repoToken);
       console.log('NOW')
       console.log(changefile);

       if(changefile === -1 ){
        core.setFailed('unexpected error');
        core.setOutput('status-code-action ','Verify files added')
        core.setOutput('new-file','the file has not been changed');
        return ; 
       }else{
       if(changefile === 200 || changefile === 201){
         core.setOutput('status-code-action ','Status: 200 OK\nThe master.xml has been change successfully');
         core.setOutput('new-file','the file master.xml has been changed:\n '+ master);
         console.log('true');
         return ;
       }else{
         if(changefile === 404){
           core.setFailed('Status: 404 NOT FOUND \n Resource not found ');
           core.setOutput('new-file','the file has not been changed');
           core.setOutput('status-code-action ','Status: 404 NOT FOUND \n Resource not found ');
           return ;
         }else{
           core.setFailed('Status: 422 VALIDATION FAILED\nthere was a conflict, try again or later');
           core.setOutput('new-file','the file has not been changed');
           return ;
         }
       }
    }
  }
} catch (error) {
  core.setFailed(error.message);
}
}
Run();

