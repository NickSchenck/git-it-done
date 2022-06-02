var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a get request to url
  fetch(apiUrl).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data, user);
      });
    } else {
      alert("Error: GitHub User not found");
    }
  })
  .catch(function(error){
    //.catch is being chained onto the end of .then, therefore you don't want a ; on the above closing brackets
    alert("Unable to connect to GitHub");
  });
};
var displayRepos = function (repos, searchTerm) {
  if(repos.length === 0){
    repoContainerEl.textContent = "No repositories found";
    return;
  }
  //clears old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;
  //loops over repos
  for (var i = 0; i < repos.length; i++) {
    //formats repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
    //creates container/link for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    //gives the 'a' element a dynamically created link
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    //creates a span to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    //append to the container
    repoEl.appendChild(titleEl);
    //creates a repo status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";
    //check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    //appends if loop results to container
    repoEl.appendChild(statusEl);
    //append container to the DOM
    repoContainerEl.appendChild(repoEl);
  }
};
var formSubmitHandler = function (event) {
  event.preventDefault();
  //get value from input element
  var username = nameInputEl.value.trim();
  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a Github username");
  }
  console.log(event);
};
userFormEl.addEventListener("submit", formSubmitHandler);