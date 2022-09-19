"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

$body.on("click", ".star", async function(evt){
  console.log(evt.target.checked)
  console.log(evt.target.parentElement.id)
  if(evt.target.checked){
    localStorage.setItem(`${evt.target.parentElement.id}`,'true')
    await currentUser.removeFave(`${evt.target.parentElement.id}`)
  }
  else{localStorage.setItem(`${evt.target.parentElement.id}`,'false')
  await currentUser.addFave(`${evt.target.parentElement.id}`)
}
});


function updateStars2(){
  for(let stories of $('ol').children()){
    if(localStorage.getItem(`${stories.id}`) != null){
    $(`#${stories.id}`).children()[0].checked = (localStorage.getItem(stories.id) == 'true')
  }
  }
}

$body.on("click", ".deleteBtn", async function(evt){
  const storyToDelete = evt.target.parentElement.id
  for(let i = 0; i < storyList.stories.length; i++){
    if(storyList.stories[i].storyId == storyToDelete){
      storyList.stories.splice(i,1)
    }
  }
  await deleteStory(`${storyToDelete}`)
  $(`#${storyToDelete}`).remove()

});

async function deleteStory(id){
  const token = currentUser.loginToken
  await axios({
    url: `https://hack-or-snooze-v3.herokuapp.com/stories/${id}`,
    method: "DELETE",
    data: { token },
  });
  await checkForRememberedUser();

}