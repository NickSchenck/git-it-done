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
owner property of repos at an index of i. We also define repoEl as creating an "a" element(anchor) within the document. Then, repoEl has
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
    repoEl.appendChild(titleEl);
/*...Here, we define statusEl as creating a "span" element within the document, then use the classList method to add 2 bootstrap classes
to statusEl. We then enter into a if statement, nested in our for loop. Our if statement checks if the open_issues_count property of
repos at an index is GREATER THAN 0, and if so we set the innerHTML value of statusEl to a string containing a template literal, which
evaluates to an "i" element. Otherwise we set the innerHTML value of statusEl to a string which evaluates to an "i" element, and doesn't
contain a template literal. After exiting the if statement, we use the .appendChild method to append statusEl to repoEl, and to append
repoEl to repoContainerEl.*/
    let statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = `<i class='fas fa-times status-icon icon-danger'></i>${repos[i].open_issues_count} issue(s)`;
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    };
    repoEl.appendChild(statusEl);
    repoContainerEl.appendChild(repoEl);
  };
};

/*formSubmitHandler is a function with one parameter which handles form submission. We first use the .preventDefault method on our event
object, preventing the page from being reloaded automatically upon the user submitting the form, then define username as the value
property of nameInputEl with the .trim method, which prevents any starting or ending whitespace from being submitted. We then enter into
an if statement which checks if username is truthy(if it exists), and if so we call the getUserRepos function with the argument username,
and set the value property of nameInputEl to an empty string(resetting the submission-box for a GitHub user to search for). Otherwise, we
call an alert notification with the text "Please enter a Github username".*/
let formSubmitHandler = function (event) {
  event.preventDefault();
  let username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a Github username");
  };
};

/*getFeaturedRepos is a function with one parameter which makes an API call to fetch our data, then a function call to display it. We
start by defining apiUrl as a string containing a template literal which evaluates to a URL call. Then, we pass apiUrl to the fetch
method and append a .then method containing an anonymous function with one parameter. Within the anonymous function, we enter an if
statement which checks if the response object was returned correctly, and if so we use the .json method on response to parse it as an
object. We then append .then method with an anonymous function with one parameter. Inside the anonymous function, we call the
displayRepos function with 2 arguments. Otherwise- if the response is NOT returned as expected- we call an alert notification with the
text "Error: GitHub User not found".*/
let getFeaturedRepos = function(language){
  let apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;
  fetch(apiUrl).then(function(response){

    if(response.ok){
      response.json().then(function(data){
        displayRepos(data.items, language);
      });
    } else{
      alert("Error: GitHub User not found");
    };
  });
};

/*buttonClickHandler is a function with one parameter which determines what happens after a certain element is clicked. We start by
defining language as the attribute "data-language" on the target of our event. We then enter an if statement which checks if language is
truthy(if it exists), and if so we call the getFeaturedRepos function with the argument of language, and set the textContent value of
repoContainerEl to an empty string.*/
let buttonClickHandler = function(event){
  let language = event.target.getAttribute("data-language")

  if(language){
    getFeaturedRepos(language);
    repoContainerEl.textContent = "";
  };
};

/*Below are 2 event listeners which essentially drive our app.*/
/*Here we have an event listener on userFormEl, listening for a "submit" event, and calling the formSubmitHandler function on
activation.*/
userFormEl.addEventListener("submit", formSubmitHandler);
/*Here we have an event listener on languageButtonsEl, listening for a "click" event, and calling the buttonClickHandler function on
activation.*/
languageButtonsEl.addEventListener("click", buttonClickHandler);