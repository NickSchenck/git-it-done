var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");
var getRepoName = function(){
    //grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    console.log(repoName);//this console acts as a good checkpoint example of how to get info)
    if(repoName){
        //display repo name on page
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
    } else{
        //if no repo given, redirect to homepage
        document.location.replace("./index.html");
    }
};
var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    //make a get request to url
    fetch(apiUrl).then(function (response) {
        //if request was successful...
        if (response.ok) {
            response.json().then(function (data) {
                //passes response data to DOM function
                displayIssues(data);
                //check if api has paginated issues, checks for Link header
                if(response.headers.get("Link")){
                    displayWarning(repo);
                }
            });
        } else {
            //if not successful redirect to homepage
            document.location.replace("./index.html");
        }
    });
};
var displayIssues = function (issues) {
    if (issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues";
        return;
    }
    for(var i = 0; i < issues.length; i++){
        //create a link element to take users to the issue on GitHub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");//_blank just opens the link in a new tab
        //creates span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        //append to container
        issueEl.appendChild(titleEl);
        //create a type element
        var typeEl = document.createElement("span");
        //check if issue is an actual issue or pull request
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull Request)";
        } else{
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};
var displayWarning = function(repo){
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    // create link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    //append to warning container
    limitWarningEl.appendChild(linkEl);
    
};
getRepoName();