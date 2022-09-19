"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $('#submitForm').addClass('hidden')
  $('#storiesArea').show()
  getAndShowStoriesOnStart()
}

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */
$body.on("click", "#nav-all", navAllStories);

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function clickSubmitLink(){
  $('#submitForm').removeClass('hidden')
}
$('#submitLink').on("click",clickSubmitLink)




function putOwnStoryOnPage() {
  console.debug("putOwnStoryOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateOwnStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  updateStars2()
}

async function myStories(){
  currentUser = await User.loginViaStoredCredentials(currentUser.loginToken, currentUser.username);
  console.log('My stories')
  $('#submitForm').addClass('hidden')
  putOwnStoryOnPage()
}

$('#mystories').on("click",myStories)


function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  updateStars2()
}

function clickFavoriteLink(){
  console.log('heyyy')
  $('#submitForm').addClass('hidden')
  putFavoritesOnPage()

}

$('#fav').on("click",clickFavoriteLink)