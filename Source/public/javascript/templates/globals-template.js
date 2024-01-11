'use strict';

/**
 * function needed to generate the HTML needed for the backbone of the website.
 * @returns HTML
 */
function forumBackbone(){
    return `<header>
    <nav class="navbar navbar-expand-md bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img src="/assets/icon.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
                Forum
            </a>

            <span class="navbar-text" id="navbar-text">
                The right place for your projects
            </span>
            
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <form onsubmit="return false;" class="d-flex ms-auto flex-shrink-1 flex-grow-1" role="submit" id="search-bar">
                    <input onsubmit="App.searchButtonPressed()" onkeypress="App.searchButtonPressed()" id="searchBarText" class="form-control me-2" type="text" placeholder="Search" aria-label="Search">
                    <div class="btn-group">
                      <button type="button" onclick="App.searchButtonPressed()" style="background-color: #F9D949;" class="btn">Search</button>
                      <button type="button" style="background-color: #F9D949;" onclick="showDropdownButton()" class="btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" id=dropdownButtonSearch>
                                <span class="visually-hidden">Toggle Dropdown</span>
                      </button>
                      <ul class="dropdown-menu" id="search-barDropdown">
                        <li><div class="form-check">
                          <input class="form-check-input" onclick="checkRadio('profiles')" type="radio" name="flexRadioDefault" id="profileSearch">
                          <label class="form-check-label" for="flexRadioDefault1">
                            Search profiles
                          </label>
                        </div>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="allDates">
                          <label class="form-check-label" for="flexRadioDefault1">
                            All dates
                          </label>
                        </div>
                          <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="lastYear">
                          <label class="form-check-label" for="flexRadioDefault1">
                            Last year
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="lastMonth">
                          <label class="form-check-label" for="flexRadioDefault1">
                            Last Month
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="lastWeek">
                          <label class="form-check-label" for="flexRadioDefault1">
                            Last Week
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="lastDay">
                          <label class="form-check-label" for="flexRadioDefault1">
                            Last Day
                          </label>
                        </div>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><div class="form-check">
                          <input class="form-check-input" type="radio" onclick="checkRadio('category')" name="flexRadioDefault2" id="categorySearch">
                          <label class="form-check-label" for="flexRadioDefault1">
                            Search by category
                          </label>
                        </div>
                        <div>
                            <label for="category">Category:</label>
                            <select id="categorySelected" name="category">
                              <option selected value="recent">Recently added projects</option>
                              <option value="trending">Top trending</option>
                              <option value="digital">Digital electronics</option>
                              <option value="analog">Analog electronics</option>
                              <option value="coding">Coding</option>
                            </select>
                        </div>
                        </li>
                      </ul>
                    </div>
                    <!--Fine dropdown-->                            
                </form>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0" id="log">
                    
                </ul> 
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
          
        </div>
        
    </nav>
    
    <div class="d-flex container-fluid" id="breadcrumb">
        <ol class="breadcrumb" id="breadcrumbItems">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
        </ol>
        <span class="ms-auto">
          <a href="/addProject">
            Add a project
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
            </svg>
          </a>
        </span>
    </div>
    

</header>

<span id="spanMainContent" class="container-fluid">
  <nav class="sidebar" id="sidebar">
  </nav>

  <main class="flex-grow-1 flex-shrink-1" id="mainContent">
      <div class="container-fluid" id="main-menu"></div>
          
  </main>
</span>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>`;
}

/**
 * creates the backbone to show searched user profiles.
 * @returns the HTML needed to create the backbone for searched used profile.
 */
function showSearchedProfilesBackBone(){
  return `<div class="float-left row row-cols-1 row-cols-md-5 g-4" id="searchedProfilesBackbone"> <!--float left serve qui, perchè bootstrap disturba i float del css-->
          
          </div>`;
}

/**
 * generates the HTML needed to insert an personal profile card inside the previosuly created div
 * @param {*} profileInfo the profileInfo of the user to show.
 * @returns the HTML needed to generate a personal profile card.
 */
function insertSearchedUserProfile(profileInfo){
  return `<a href="/personalPage/${profileInfo.Nick}"><div class="col">
  <div class="card h-100"> <!-- h-100 -> specifichi altezza della card. Ponendole tutte a 100, le uniformo in altezza-->
    <img src="${profileInfo.Image}" class="card-img-top searchedUserImages" alt="userImage">
    <div class="container card-body searchedProfile">
      <h5 class="card-title">
        <span> 
          <div class="cardName profiles">${profileInfo.Nick}</div>
          <div class="badge rounded-pill ${profileInfo.Role=="user"?"text-bg-success":`${profileInfo.Role=="moderator"?"text-bg-warning":"text-bg-danger"}`}">${profileInfo.Role}</div>
        </span> <!---->
      </h5>
      <p class="card-text">${profileInfo.frontBio!=null?profileInfo.frontBio:"I'm a user enjoying the site!"}</p>
    </div>
  </div>
</div></a>`;
}

/**
 * Function creating all the HTML needed to insert the site's footer.
 * @returns the HTML of the footer.
 */
function insertFooterHTML(){
  return `<footer id="footer" class="footer-dark">
    <div class="container">
        <p class="copyright">Author: Riccardo Giovanni Gualiumi</p>
    </div>
  </footer>`;
}

/**
 * function generating all the HTML necessary for the backbone of the login page
 * @returns HTML
 */
function loginBackbone(){
    return `<main class="row no-gutter">
    <!-- The image half -->
    <div class="col-md-6 d-none d-md-flex bg-image"></div>


    <!-- The content half -->
    <div class="col-md-6 bg-light">
        <div class="login d-flex align-items-center py-5">

            <!-- Demo content-->
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 col-xl-7 mx-auto">
                        <h3 class="display-4">Log in</h3>
                        <p class="text-muted mb-4">Log in to have access to all the website's contents</p>
                        <form>
                            <div class="form-group mb-3">
                                <input maxlength="36" id="inputNickname" type="text" placeholder="Username" required="" autofocus="" class="form-control rounded-pill border-2 shadow-sm px-4">
                            </div>
                            <div class="form-group mb-3">
                                <input maxlength="128" id="inputPassword" type="password" placeholder="Password" required="" class="form-control rounded-pill border-2 shadow-sm px-4 text-primary">
                            </div>
                            <div id="msg"></div>
                            <!--
                            <div class="custom-control custom-checkbox mb-3" id="checkbox">
                                <input id="customCheck1" type="checkbox" checked class="custom-control-input">
                                <label for="customCheck1" class="custom-control-label">Remember password</label>
                            </div>
                            -->
                            <a href="/login/submit"><button type="submit" class="btn btn-block text-uppercase mb-2 rounded-pill shadow-sm" id="LogIn">Log in</button></a>
                            <div class="text-center d-flex justify-content-between mt-4"><p>Don't have an account yet? <a href="/register" class="font-italic text-muted">Sign-up</a></p></div>
                            <small id="loginHelpBlock" class="form-text text-muted"></small>
                        </form>
                    </div>
                </div>
            </div><!-- End -->

        </div>
    </div><!-- End -->

</main>`;
}

/**
 * function generating all the HTML necessary for the backbone of the signup page
 * @returns HTML
 */
function signupBackbone(){
    return `<main class="row no-gutter">
    <!-- The image half -->
    <div class="col-md-6 d-none d-md-flex bg-image"></div>


    <!-- The content half -->
    <div class="col-md-6 bg-light">
        <div class="login d-flex align-items-center py-5">

            <!-- Demo content-->
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 col-xl-7 mx-auto">
                    <h3 class="display-4">Sign-up</h3>
                    <p class="text-muted mb-4">Sign-up to join the community and have access to all site's exclusive contents!</p>
                    <form>
                        <div class="form-group mb-3">
                            <input maxlength="36" id="inputNickname" type="email" placeholder="Username" required="" class="form-control rounded-pill border-2 shadow-sm px-4">
                            <small id="nicknameHelpBlock" class="form-text text-muted"></small>
                        </div>
                        <div class="form-group mb-3">
                            <input maxlength="130" id="inputEmail" type="email" placeholder="Email" required="" autofocus="" class="form-control rounded-pill border-2 shadow-sm px-4">
                            <small id="emailHelpBlock" class="form-text text-muted"></small>
                        </div>
                        <div class="form-group mb-3">
                            <input maxlength="130" id="inputRepeatEmail" type="email" placeholder="Repeat Email" required="" class="form-control rounded-pill border-2 shadow-sm px-4">
                            <small id="repeatEmailHelpBlock" class="form-text text-muted"></small>
                        </div>
                        <div class="form-group mb-3">
                            <input maxlength="128" id="inputPassword" type="password" placeholder="Password" required="" class="form-control rounded-pill border-2 shadow-sm px-4 text-primary">
                            <small id="passwordHelpBlock" class="form-text text-muted"></small>
                        </div>
                        <!--
                        <div class="custom-control custom-checkbox mb-3" id="checkbox">
                            <input id="customCheck1" type="checkbox" checked class="custom-control-input">
                            <label for="customCheck1" class="custom-control-label">Remember password</label>
                        </div>-->
                        <a href="/register/submit"><button type="submit" class="btn btn-block text-uppercase mb-2 rounded-pill shadow-sm" id="Sign-up">Sign up</button></a>
                        <div class="text-center d-flex justify-content-between mt-4"><p>Have an account already? <a href="/login" class="font-italic text-muted">Log in</a></p></div>
                    </form>
                    </div>
                </div>
            </div><!-- End -->

        </div>
    </div><!-- End -->

</main>`;
}

/**
 * function needed to generate all the HTML needed for the bottom navigator (website pages).
 * @param {*} projectID the ID of the project whose page the client is navigating.
 * @param {*} num the number of page relative to the first.
 * @returns HTML
 */
function bottomNaviCreate(projectID, num){
  return `<nav>
  <ul class="pagination" id="BottPagi">
    <li class="page-item"><a class="page-link" href="/projects/${projectID}/${num}" style="pointer-events: none" onclick="this.blur();" id="backPagi">Previous</a></li>
  </ul>
</nav>`;
}

/**
 * if type===0, creates a normal page-item, otherise it will create the 'next button'.
 * @param {*} num the number of the page
 * @param {*} type specify if you want to generate a normal page item, or a 'next button'
 * @returns an HTML containing the above.
 */
function addPageItem(num, projectID, type){

  if (type===0)
    return `<li class="page-item" id="pageButton${num}"><a class="page-link" href="/projects/${projectID}/${num}" onclick="this.blur();">${num}</a></li>`
  else if (type===1)
    return `<li class="page-item"><a class="page-link" href="/projects/${projectID}/${num}" onclick="this.blur();" id="nextPagi">Next</a></li>`;
  else if (type===undefined)
  return `<li class="page-item">Next</li>`;
}

/**
 * if type===0, creates a normal page-item, otherise it will create the 'next button'.
 * @param {*} num the number of the page
 * @param {*} path the path of the href
 * @param {*} type specify if you want to generate a normal page item, or a 'next button'
 * @returns an HTML containing the above.
 */
function addPageItemMod(num, path, type)
{
  if (type===0)
    return `<li class="page-item" id="pageButton${num}"><a class="page-link" href="${path}" onclick="this.blur();">${num}</a></li>`
  else if (type===1)
    return `<li class="page-item"><a class="page-link" href="${path}" onclick="this.blur();" id="nextPagi">Next</a></li>`;
  else if (type===undefined)
  return `<li class="page-item">Next</li>`;
}

/**
 * Function that creates the html needed in the header.
 * @param {*} user the user that has logged in.
 * @param {*} type if 0, shows logIn/signUp buttons, otherwise shows the profile picture and the logOut button
 * @returns 
 */
function loggedPage(user, type){
  return type===0?`<li class="nav-link">
  <a href="/register"><button class="btn" style="background-color: #3C486B; color: white;" type="button" data-bs-toggle="offcanvas" aria-controls="offcanvasWithBothOptions" href="/register">Sign Up</button></a>
  </li>
  <li class="nav-link">
      <a href="/login"><button class="btn" style="background-color: #F9D949" type="button" data-bs-toggle="offcanvas" aria-controls="offcanvasWithBothOptions">Log In</button></a>
  </li>`:`<li class="nav-item" id="user">
  <a href="/personalPage/${user.Nick}"><div class="user" style="background-image:url('${'/'+user.Image.replace(/\\/g, "/")}')"></div></a>
  </li>
  <li class="nav-link">
  <button onclick="logoutButton()" class="btn" style="background-color: #F9D949" type="button" aria-controls="offcanvasWithBothOptions">Log Out</button>
  </li>`;
}

/**
 * function generating the necessary HTML to show the PersonalPage to the user.
 * @param {*} userInfo the object variable containing all the user's info.
 * @param {*} visualizerNick the Nick of the person that is visualizing the userInfo's personal page. Leave it undefined if you never want to see the page in 'owner' mode.
 * @returns the HTML needed to generate the page.
 */
function generatePersonalPageHTML(userInfo, visualizerNick=undefined){
  return `<section class="section about-section gray-bg" id="about">
    <div class="container">
        <div class="row align-items-center flex-row-reverse info">
            <div class="col-lg-6">
                <div class="about-text go-to">
                    <h3 class="dark-color">${userInfo.Nick}'s Personal page ${visualizerNick===undefined?'':`${visualizerNick !== userInfo.Nick?'':'<a onclick="promptModifyPersonalPage()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></a>'}`}</h3>
                    <div id="Bio"><h6 class="theme-color lead">${userInfo.frontBio!==undefined && userInfo.frontBio!==null?userInfo.frontBio:"I'm a user enjoying the site!"}</h6>
                    <p>${userInfo.Bio!==undefined&& userInfo.Bio!==null?userInfo.Bio:"The user doesn't have a Bio."}</p></div>
                    <div class="row about-list">
                        <div class="col-md-6">
                            <div class="media" id="Nickname">
                                <label>Nickname</label>
                                <p>${userInfo.Nick}</p>
                            </div>
                            <div class="media" id="Name">
                                <label>Name</label>
                                <p>${userInfo.Name!==undefined && userInfo.Name!==null?userInfo.Name:"N/A"}</p>
                            </div>
                            <div class="media" id="Surname">
                                <label>Surname</label>
                                <p>${userInfo.Surname!==undefined && userInfo.Surname!==null?userInfo.Surname:"N/A"}</p>
                            </div>
                            <div class="media" id="Birthday">
                                <label>Birthday</label>
                                <p>${userInfo.Birthday!==undefined && userInfo.Birthday!==null?userInfo.Birthday:"N/A"}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="media" id="Country">
                                <label>Country</label>
                                <p>${userInfo.Country!==undefined && userInfo.Country!==null?userInfo.Country:"N/A"}</p>
                            </div>
                            <div class="media" id="State">
                                <label>State</label>
                                <p>${userInfo.State!==undefined && userInfo.State!==null?userInfo.State:"N/A"}</p>
                            </div>
                            <div class="media" id="Status">
                                <label>Status</label>
                                <p>${userInfo.Status!==undefined && userInfo.Status!==null?userInfo.Status:"N/A"}</p>
                            </div>
                            <div class="hide" id="button">
                              <button id="sumbitChanges" onclick="uploadNewUserInfo('${userInfo.Nick}')" class="btn" style="background-color: #3C486B; color: white;" type="submit">Submit changes</button>
                              <button id="deleteUserBtn" onclick="deleteUser(${userInfo.Id}, ${visualizerNick===undefined?false:`${visualizerNick !== userInfo.Nick?false:true}`})" class="btn" style="background-color: #F45050; color:white;" type="submit">Delete profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6" id="Avatar">
                <div class="about-avatar">
                    <img src="${userInfo.Image}" title="userImage" alt="" id="AvatarIMG">
                    <div class="notDisplay" id="imageLabel"><label for="sourceFiles">Upload Profile Picture</label></div>
                    <span class="notDisplay" id="imageSubmit"><input onchange="submitImage(this, false, true)" accept=".jpg, .png, .jpeg, .gif, .svg, .webp" type="file" class="form-control" id="sourceFiles" aria-describedby="sourceFiles" aria-label="Upload"><button id="hide" class="btn" style="background-color: #F9D949;" type="button" id="inputGroupFileAddon04">Add</button>
                    <small><p>Supported files:<b id="supportedFiles"> .jpeg, .jpg, .png, .svg, .webp, .gif</b></p></small>
                    </span>
                </div>
            </div>
        </div>
        <div class="counter">
            <div class="row">
                <div class="col-6 col-lg-3">
                    <div class="count-data text-center">
                        <h6 class="count h2" data-to="${userInfo.projectsNum}" data-speed="${userInfo.projectsNum}">${userInfo.projectsNum}</h6>
                        <p class="m-0px font-w-600">Projects Uploaded</p>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="count-data text-center">
                        <h6 class="count h2" data-to="${userInfo.Likes}" data-speed="${userInfo.Likes}">${userInfo.Likes}</h6>
                        <p class="m-0px font-w-600">Likes received</p>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="count-data text-center">
                        <h6 class="count h2" data-to="" data-speed=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${userInfo.Likes>=20 && (userInfo.Likes/+userInfo.Dislikes)>=1.25?"#F45050":"currentcolor"} class="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                          </svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${userInfo.Likes>=100 && (+userInfo.Likes/+userInfo.Dislikes)>=2?"#F45050":"currentcolor"} class="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                          </svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${userInfo.Likes>=400 && (+userInfo.Likes/+userInfo.Dislikes)>=3.25?"#F45050":"currentcolor"} class="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${userInfo.Likes>=800 && (+userInfo.Likes/+userInfo.Dislikes)>=6?"#F45050":"currentcolor"} class="bi bi-star" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                              </svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${userInfo.Likes>=1800 && (+userInfo.Likes/+userInfo.Dislikes)>=8?"#F45050":"currentcolor"} class="bi bi-star" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                              </svg>
                        </h6>
                        <p class="m-0px font-w-600">User Rating</p>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="count-data text-center">
                        <h6 class="count h2" data-to="" data-speed=""><span class="badge text-bg" style="background-color: ${userInfo.Role==="user"?'#3C486B':(userInfo.Role==="moderator"?'#F45050':'#FFBB5C')}; color: white;">${userInfo.Role}</span></h6>
                        <p class="m-0px font-w-600">User role</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>
  <!--commento di padding hidden-->
        <div class="card container-fluid invisibile">
          <div class="card-body invisible">
            <h5 class="card-title invisible"><strong><a href="Personal-page.html"> </a></strong><img class="user" style="margin-bottom:12px;margin-left:5px" alt="icon-user" width="30" height="24" class="d-inline-block align-text-top ms-auto"><p><i></i></p></h5>
            <p class="card-text text-break invisibile">paddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpadding</p>
            <div>
            <a ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="fill:currentcolor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
            </svg>
            <p></p></a>
            <a ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="fill:currentcolor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
              <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
            </svg>
            <p></p></a>
            <a ><p class="useful"><i></i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="fill:currentcolor" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg></p></a>
            </div>
          </div>
        </div>
        <!--Fine commento di padding hidden-->`;
}

/**
 * Creates the html needed to insert a new item in the breadcrumb
 * @param {*} content the content of the breadcrumb
 * @param {*} href link of the breadcrumb level
 * @returns all the html needed to create a new 'level' of the breadcrumb
 */
function breadcrumbItem(content, href){
  return `<li class="breadcrumb-item"><a ${href==window.location.href?'':`href="${href}"`}>${content}</a></li>`;
}

/**
 * Creates the html needed to create a single input form
 * @param {*} option creational options for the given input.
 * @returns the HTML needed to create a single input form
 */
function generateInputHTML(option){
  return `<div><label for="${option.id}">${option.label}</label></div>
  <span><input onchange="${option.onchange+`(${option.onchangeParam})`}" maxlength="${option.max}" value="${option.value}" placeholder="${option.placeholder}" type="${option.type}" class="form-control" id="${option.id}" aria-describedby="${option.areaDesc}" ${option.status}></span>`;
}

export {forumBackbone, loginBackbone, signupBackbone, bottomNaviCreate, addPageItem, breadcrumbItem, loggedPage, generatePersonalPageHTML, generateInputHTML, showSearchedProfilesBackBone, insertSearchedUserProfile, addPageItemMod, insertFooterHTML};