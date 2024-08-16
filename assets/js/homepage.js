/*We have several variables here. userFormEl, nameInputEl,repoContainerEl, repoSearchTerm, and languageButtonsEl all select varrying
parts of the application through ID's.*/
let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");

/*getUserRepos is a function with one parameter, which makes API calls to get our data. We first start by defining apiUrl as a string
which evaluates to a URL, with a template literal used to inject the searched-user into the URL path. Using the apiUrl as an argument,
we then make a fetch call and append a .then method to enter into an anonymous function with response as a parameter. Within the
anonymous function we enter an if statement, checking if the response object was successfully returned, and if so we parse the response
object by appending .json, and submit it to another anonymous function within a .then method. The second anonymous function has a
parameter of data, and calls the displayRepos function with the arguments data and user. Continued...*/
let getUserRepos = function (user) {
  let apiUrl = `https://api.github.com/users/${user}/repos`;

  fetch(apiUrl).then(function (response) {

    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data, user);
      });
/*...Here, we enter into the else portion of our if statement, which will trigger if the response object was not successfully returned,
and will open an alert window containing the message; "Error: GitHub User not found". Finally, a .catch method is appended for error
handling, and calls an anonymous function with a parameter of error, which will also open an alert window for the user, containing the
message; "Unable to connect to GitHub". */
    } else {
      alert("Error: GitHub User not found");
    }
  })
  .catch(function(error){
    alert("Unable to connect to GitHub");
  });
};

/*displayRepos is a function with two parameters, and displays or appends our fetched data to the page. We start with an if statement,
checking if the length property of the repos parameter is zero, and if so setting the textContent property of repoContainerEl to; 
"No repositories found", and returning out of the if statement. We then set the textContent property of repoContainerEl to an empty
string and repoSearchTerm to the parameter searchTerm(a GitHub username), which will clear old content. Continued...*/
let displayRepos = function (repos, searchTerm) {

  if(repos.length === 0){
    repoContainerEl.textContent = "No repositories found";
    return;
  }
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;
/*...Here, we enter into a for loop, initializing i as 0, checking if i is LESS THAN the length property of repos, and iterating i if
it is. We then define repoName as the name property of repos at an index of i, concat with a / character and the login property of the
owner property of repos at an index of i. We also define repoEl as creating a "a" element(anchor) within the document. Then, repoEl has
4 bootstrap classes added to it with the .classList method and the href attribute added with a value of a partial URL string, containing
a template literal. The variable titleEl is defined as creating a "span" element in the document, and its textContent property is set to
the repoName variable. repoEl then uses the .appendChild method to append titleEl to it. Continued...*/
  for (let i = 0; i < repos.length; i++) {
    let repoName = repos[i].owner.login + "/" + repos[i].name;
    let repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", `./single-repo.html?repo=${repoName}`);
    let titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    //append to the container
    repoEl.appendChild(titleEl);
    //creates a repo status element
    let statusEl = document.createElement("span");
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


let formSubmitHandler = function (event) {
  event.preventDefault();
  //get value from input element
  let username = nameInputEl.value.trim();
  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a Github username");
  }
  console.log(event);
};
let getFeaturedRepos = function(language){
  let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  fetch(apiUrl).then(function(response){
    if(response.ok){
      response.json().then(function(data){
        displayRepos(data.items, language);
      });
    } else{
      alert("Error: GitHub User not found");
    }
  });
};
let buttonClickHandler = function(event){
  let language = event.target.getAttribute("data-language")
  console.log(language)
  if(language){
    getFeaturedRepos(language);
    repoContainerEl.textContent = "";
  }
};
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);