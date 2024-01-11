import page from '//unpkg.com/page/page.mjs';
import Api from './api.js';
import createProjectHeader from './templates/header-template.js';
import {createBulk, insertProject, createProjectPage, insertComment, createCarouselButton, carouselAddImage, createCommentPromptHTML, addProjectHTML, imagePreviewCardHTML, filePreviewCardHTML, insertPaddingComment} from './templates/projects-template.js';
import createSideBar from './templates/nav-template.js';
import {loginBackbone, signupBackbone, forumBackbone, bottomNaviCreate, addPageItemMod, loggedPage, generatePersonalPageHTML, generateInputHTML, showSearchedProfilesBackBone, insertSearchedUserProfile, breadcrumbItem, insertFooterHTML} from './templates/globals-template.js';
import { isBlank, restoreComment} from './miscellaneous.js';

//global variables
let assets;     //will point to the array of assets gotten from the database.
let imageNum = 1; //variable used by the 'add a project' pages functions
let fileNum = 1; //variable used by the 'add a project' pages functions
let bufferFile = [] //array usato da uploadNewProject e da updatePreview

class App {  //all'interno del costruttore vado a definire le mie routes.

    constructor(body, footer) {
        //constructor
        this.body = body;   //frequently used HTML
        this.footer = footer;   //frequently used HTML
        this.mainMenuHTML = null;   //frequently used HTML
        this.endNavHTML = null; //frequently used HTML
        this.sidebarHTML = null;    //frequently used HTML
        this.bufferedProjects = {projects:null, type:null};  //needed when using the bottom navigator.
        this.logged = false;  //used to chek if the client is logged or not.

        // routing
        page('/', () => {  //home page
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Home', '/'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Home"));
                this.showHome();
                document.title = "Forum - HomePage";    //change the document title according to where i am in the site
            });
        });
        page('/recent', () => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Recently Added Projects', '/recent'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Recent"));
                this.showProjects("Recently added projects");
                document.title = "Forum - Recently Added Projects";
            });
        });
        page('/recent/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Recent"));
                this.showProjectsPage(req);
                document.title = "Forum - Recently Added Projects";
            });
        });
        page('/analog', () => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Analog Projects', '/analog'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Analog"));
                this.showProjects("Analog Electronics");
                document.title = "Forum - Analog Electronics Projects";
            });
        });
        page('/analog/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Analog"));
                this.showProjectsPage(req);
                document.title = "Forum - Analog Electronics Projects";
            });
        });
        page('/digital', () => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Digital Projects', '/digital'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Digital"));
                this.showProjects("Digital Electronics");
                document.title = "Forum - Digital Electronics Projects";
            });
        });
        page('/digital/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Digital"));
                this.showProjectsPage(req);
                document.title = "Forum - Digital Electronics Projects";
            });
        });
        page('/coding', () => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Coding Projects', '/coding'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Coding"));
                this.showProjects("Coding");
                document.title = "Forum - Coding Projects";
            });
        });
        page('/coding/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Coding"));
                this.showProjectsPage(req);
                document.title = "Forum - Coding Projects";
            });
        });
        page('/trending', () => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Trending Projects', '/trending'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Trending"));
                this.showProjects("Top trending");
                document.title = "Forum - Trending Projects";
            });
        });
        page('/trending/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Trending"));
                this.showProjectsPage(req);
                document.title = "Forum - Trending Projects";
            });
        });
        page('/favourites', () => {
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Favourite Projects', '/favourites'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Favourites"));
                this.showProjects("Favourites");
                document.title = "Forum - Favourite Projects";
            });
        })
        page('/favourites/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Favourites"));
                this.showProjectsPage(req);
                document.title = "Forum - Favourite Projects";
            });
        });
        page('/register', ()=>{
            this.initLoginSignup(1);
            document.title = "Forum - SignUp";
        });
        page('/register/submit', ()=>{
            document.getElementById('Sign-up').disabled = true;
            this.registerUser();
            document.title = "Forum - SignUp";
        });
        page('/login', ()=>{
            this.initLoginSignup(0);
            document.title = "Forum - Login";
        });
        page('/login/submit', ()=>{
            this.loginUser();
            document.title = "Forum - Login";
        });
        page('/projects/:id', (req)=>{

            this.initForumHTML().then(()=>{ //base HTML must be generated
                Api.isLogged().then((info)=>{   //checking if the user is logged or not
                    if (!info.isAuth)   page.redirect('/login');
                    else
                    {
                        this.mainMenuHTML.innerHTML = '';
                        this.sidebarHTML.innerHTML = '';
                        document.getElementById("css").setAttribute("href", "/stylesheets/ProjectEsameStyle.css");
                        this.openProject(req);  //openProject will also handle the breadcrumb
                        this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Home"));
                    }
                }).catch((err)=>console.log(err));
            });
        });
        page('/projects/:id/:page', (req)=>{    //:id is the project's id!
            Api.isLogged().then((info)=>{   //checking if the user is logged or not
                if (!info.isAuth)   page.redirect('/login');
                else
                {
                    this.showComments(req);
                }
            }).catch((err)=>console.log(err));
        });
        page('/addProject',()=>{
            //checking if sidebarHTML isn't null (this means the user might have reloaded the page, or some sort of unkown bug has occurred)
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('Add a Project', '/addProject'));
                this.sidebarHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Home")); //activate the home button when prompting to create a new project
                Api.isLogged().then((info)=>{
                    if (!info.isAuth)   page.redirect('/login');
                    else
                    {
                        document.getElementById("css").setAttribute("href", "/stylesheets/ProjectEsameStyle.css");
                        this.addProjectPage();
                        document.title = "Forum - Add a new Project";
                    }
                }).catch((err)=>console.log(err));
            });
        });
        page('/modifyProject/:id', (req)=>{
            Api.isLogged().then((info)=>{
                if (!info.isAuth)   page.redirect('/login');
                else
                {
                    Api.getProjectInfo(req.params.id).then((info)=>{
                        //get info of first level breadcrumb before clearing it
                        const firstLevel = document.getElementById('breadcrumbItems').firstChild.firstChild.innerText;
                        const firstLevelHref = document.getElementById('breadcrumbItems').firstChild.firstChild.href;
                        $('#breadcrumbItems').empty();  //clear the breadcrumb
                        document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(firstLevel, firstLevelHref));
                        document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`${info.Name}`, `/projects/${info.Id}`));
                        document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`Modify Project`, `${window.location.href}`));
                        document.title = "Forum - Personal Page";
                        document.getElementById("css").setAttribute("href", "/stylesheets/ProjectEsameStyle.css");
                        document.title = "Forum - Modify Project";
                        this.addProjectPage(info, req.params.id);
                    }).catch((err)=>console.log(err));
                }
            }).catch((err)=>console.log(err));
        })
        page('/personalPage', ()=>{

            this.initForumHTML().then(()=>{

                document.getElementById("css").setAttribute("href", "/stylesheets/PersonalPage.css");   //updating the css used
                //update the sidebar selection.
                this.sidebarHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Personal"));

                //creating the HTML page with all logged user informations.
                Api.isLogged().then((info)=>{
                    if (!info.isAuth)   page.redirect('/login');
                    else
                    {
                        $('#breadcrumbItems').empty();  //clear the breadcrumb
                        document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`${info.userInfo.Nick}'s Personal Page`, '/personalPage'));
                        document.title = "Forum - Personal Page";
                        this.showPersonalPage();
                    }
                }).catch((err)=>console.log(err));
            });
        })
        page('/personalPage/:userNick', (req)=>{

            this.initForumHTML().then(()=>{
                document.getElementById("css").setAttribute("href", "/stylesheets/PersonalPage.css");
                //update the sidebar selection.
                this.sidebarHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Personal"));
                if (req.params.userNick===undefined || req.params.userNick == null){
                    console.log("Error: couldn't find specified Nick!");
                    page.redirect('/');
                }
                else
                {
                    Api.isLogged().then((info)=>{
                        //creating the HTML page with all userNick informations.
                        if (!info.isAuth)   page.redirect('/login');
                        else
                        {
                            $('#breadcrumbItems').empty();  //clear the breadcrumb
                            document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`Home`, '/'));
                            document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`${info.userInfo.Nick}'s Personal Page`, `${window.location.href}`));
                            document.title = `Forum - ${req.params.userNick}'s Personal Page`;
                            this.showPersonalPage(req.params.userNick);
                        }
                    })
                }
            });
        })
        page('/personalProjects', ()=>{
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{

                $('#breadcrumbItems').empty();  //clear the breadcrumb
                document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem('My projects', '/personalProjects'));
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("personalProject"));
                this.showProjects("My projects");
                document.title = "Forum - My projects";
            });
        })
        page('/personalProjects/:page', (req) => {  
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML().then(()=>{
                this.mainMenuHTML.innerHTML = '';
                this.sidebarHTML.innerHTML = '';
                //this.projectsHTML.innerHTML = '';
                this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("personalProject"));
                this.showProjectsPage(req);
                document.title = "Forum - My projects";
            });
        });
        page();
    }

    /**
     * Generates the HTML needed for the forum main page (after clearing the previous one), and initializes all needed variables.
     * Does something only if this.endNavHTML, this.sidebarHTML and this.mainMenuHTML are set to NULL
     */
    initForumHTML = async()=>{
        var logged = false;
        
        const info = await Api.isLogged();
        logged = info.isAuth;
        if ((logged!=this.logged) || (this.endNavHTML == null && this.sidebarHTML == null && this.mainMenuHTML == null))    //when isLogged status changes, or the header ahs not been generated yet, refresh the header of the site 
        {
            $('#body').empty();     //clear the html page with the previously generated HTML.
            this.body.insertAdjacentHTML('beforeend', forumBackbone());     //generate the forum main page

            //add the onscroll function to body, so that the navbar follows the user when scrolling
            //this.body.onscroll = scrollSidebar;

            $('#log').empty();
            if (logged==true)
                document.getElementById("log").insertAdjacentHTML('beforeend', loggedPage(info.userInfo, 1));
            else
                document.getElementById("log").insertAdjacentHTML('beforeend', loggedPage(null, 0));
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.endNavHTML = document.querySelector('#endpageNavigator');
            this.sidebarHTML = document.querySelector('#sidebar');
            this.mainMenuHTML = document.querySelector('#main-menu');

            //add the footer
            this.body.insertAdjacentHTML('beforeend', insertFooterHTML());
        }
        this.logged = info.isAuth;  //update the this.isLogged variable

        if (window.matchMedia("(max-device-width: 500px)").matches) {
            // modify dom
            document.getElementById('mainContent').classList.add('container-fluid');    //on mobile devices, this should be done, to ensure the correct padding of site's elements
        }   
    }

    /**
     * Generates the HTML needed for the login/sign up page. Sets the variables of this.endNavHTML, this.sidebarHTML and this.mainMenuHTML to NULL.
     * @param {*} Type 0 to generate the login page, 1 to generate the signup page.
     */
    initLoginSignup = async(Type)=>{
        if (Type==0)
        {
            $('#body').empty();     //clear the html page with the previously generated HTML.
            this.endNavHTML = null;
            this.sidebarHTML = null;
            this.mainMenuHTML = null;
            this.body.insertAdjacentHTML('beforeend', loginBackbone());
            document.getElementById("css").setAttribute("href", "/stylesheets/loginSignupStyle.css");
        }
        else if(Type==1)
        {
            $('#body').empty();     //clear the html page with the previously generated HTML.
            this.endNavHTML = null;
            this.sidebarHTML = null;
            this.mainMenuHTML = null;
            this.body.insertAdjacentHTML('beforeend', signupBackbone());
            document.getElementById("css").setAttribute("href", "/stylesheets/loginSignupStyle.css");
        }
    }

    /**
     * Create the HTML needed to show the projects in the home page.
    */
   showHome = async ()=>{
    this.showProjects("Top trending",3,1);
    this.showProjects("Recently added projects",3,2);
    this.showProjects("Digital Electronics",3,3);
    this.showProjects("Analog Electronics",3,4);
    this.showProjects("Coding",3,5);
   }

    /**
     * Create the HTML needed for showing all the projects of the category.
     * @param {*} Type -> name of the set of projects
     * @param {*} Num -> number of projects for page. Defaults to 7.
     * @param {*} index -> number of card bulks you want to create. Default is 1.
    */
   showProjects = async (Type, Num=7, index=1)=>{
        //retrieving projects info from the Api module
        let projects, projectsHeaderHTML, projectsHTML;
        let iteration=0;    //used to keep track of the number of projects for every bulk
        if (Type==="Recently added projects")
        {
            projects = await Api.getRecentProjects();
            this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
            this.bufferedProjects.type = Type;
        }
        if (Type==="Top trending")
        {
            projects = await Api.getTrendingProjects();
            this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
            this.bufferedProjects.type = Type;
        }
        if (Type==="Digital Electronics")
        {
            projects = await Api.getDigitalProjects();
            this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
            this.bufferedProjects.type = Type;
        }
        if (Type==="Analog Electronics")
        {
            projects = await Api.getAnalogProjects();
            this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
            this.bufferedProjects.type = Type;
        }
        if (Type==="Coding")
        {
            projects = await Api.getCodingProjects();
            this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
            this.bufferedProjects.type = Type;
        }
        if (Type==="My projects")
        {
            let info = await Api.isLogged();    //checking if the user has logged in
            if(!info.isAuth)  page.redirect('/login');    //checking if the user has logged in!
            else    //retrieving favourite projects ID and their info.
            {
                projects = await Api.userProjects(info.userInfo.Id);
                this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
                this.bufferedProjects.type = Type;
            }
        }
        if (Type==="Favourites")
        {
            let info = await Api.isLogged();    //checking if the user has logged in
            if(!info.isAuth)  page.redirect('/login');    //checking if the user has logged in!
            else    //retrieving favourite projects ID and their info.
            {
                const IDs = await Api.getFavouriteProjectsID();
                projects = await Api.getFavouriteProjects(IDs);
                this.bufferedProjects.projects = projects    //buffer those projects, so to minimize the request to the server.
                this.bufferedProjects.type = Type;
            }
        }
        //sets the <h4> header of the type of project to be shown
        this.mainMenuHTML.insertAdjacentHTML('beforeend',createBulk(index));
        projectsHeaderHTML = document.querySelector(`#other${index}>#ProjectsHeader`);
        projectsHTML = document.querySelector(`#other${index}>#Projects`);
        projectsHeaderHTML.insertAdjacentHTML('beforeend',createProjectHeader(Type));  //setta header

        //inserting projects
        if (Type==="Favourites" || Type==="My projects")    //checking if i can proceed to work on showing up projects
        {
            let info = await Api.isLogged();    //checking if the user has logged in
            if (info.isAuth)   //if user has authenticated (otherwise bugs may manifest)
            {
                for (let project of projects)
                {
                    if (iteration!=undefined && iteration>=Num) break;  //quit iterating if max number of projects to be shown is hit.
                    let comment = await Api.getLatestComment(project.ID===undefined?project.Id:project.ID);   //latest comment
                    let commentsNum = await Api.getCommentsNum(project.ID===undefined?project.Id:project.ID); //number of comments
                    let ownerInfo = await Api.getNick(project.Owner);    //get the Nick and the Image of the owner of the project
                    const progettoHTML = insertProject(project, comment, commentsNum, ownerInfo);   //create the card, showing the project in the page.
                    projectsHTML.insertAdjacentHTML('beforeend', progettoHTML);
                    iteration+=1;   //increment the counter
                }
            }
        }
        else    //project types is not favourites. They can be shown even without authentication
        {
            for (let project of projects)
            {
                if (iteration!=undefined && iteration>=Num) break;  //quit iterating if max number of projects to be shown is hit.
                let comment = await Api.getLatestComment(project.ID===undefined?project.Id:project.ID);   //latest comment
                let commentsNum = await Api.getCommentsNum(project.ID===undefined?project.Id:project.ID); //number of comments
                let ownerInfo = await Api.getNick(project.Owner);    //get the Nick and the Image of the owner of the project
                const progettoHTML = insertProject(project, comment, commentsNum, ownerInfo);   //create the card, showing the project in the page.
                projectsHTML.insertAdjacentHTML('beforeend', progettoHTML);
                iteration+=1;   //increment the counter
            }
        }

        if (Num==7)  //if Num!=7, the bottomPaginator should not be generated, as it is intended to create a page every 7 elements.
        {
            if (projects!=undefined)    bottomNaviGenerator(projects.length, document.getElementById('endpageNavigator'), window.location.href); //generate bottom paginator, if needed
        }
   }

   /**
    * function used to register a user to the database.
    * @returns 0 if an error has occurred, 1 otherwise.
    */
   registerUser = async()=>{
    const Nick = document.getElementById('inputNickname').value;
    const Mail = document.getElementById('inputEmail').value;
    const RepeatMail = document.getElementById('inputRepeatEmail').value;
    const Password = document.getElementById('inputPassword').value;

    const emailHelpBlock = document.getElementById('emailHelpBlock');
    const repeatEmailHelpBlock = document.getElementById('repeatEmailHelpBlock');
    const passwordHelpBlock = document.getElementById('passwordHelpBlock');
    const nicknameHelpBlock = document.getElementById('nicknameHelpBlock');

    const nickInput = document.getElementById('inputNickname');
    const mailInput = document.getElementById('inputEmail');
    const repeatMailInput = document.getElementById('inputRepeatEmail');
    const passwordInput = document.getElementById('inputPassword');

    $('#nicknameHelpBlock').empty();
    $('#emailHelpBlock').empty();
    $('#repeatEmailHelpBlock').empty();
    $('#passwordHelpBlock').empty();

    //removing the red coloured border from the input elements.
    nickInput.style.borderColor = "";
    mailInput.style.borderColor = "";
    repeatMailInput.style.borderColor = "";
    passwordInput.style.borderColor = "";

    if (Mail==RepeatMail && Password.length>=8 && Mail.includes("@", -2) && Nick.length>0)   
    {
        //every input is ok. We can proceed to call the Api function to register the new user.
        await Api.registerNewUser(Nick, Password, Mail, RepeatMail).then(()=>{

            //after registering the new user, it must be already logged as well.
            Api.loginUser(Nick, Password).then((out)=>{
                this.initForumHTML(true);   //show the page in 'logged in mode'
                page.redirect('/');
            }).catch((err)=>{
                console.log(JSON.stringify(err));
            });

            page.redirect('/')
        }).catch((err)=>{   //error from the server: Nickname already in use!
            console.log(err);
            if (err=="Invalid Email format!"){
                emailHelpBlock.appendChild(document.createTextNode(err));
                mailInput.style.borderColor = "red";    //color the mail's form red, to better notify the user.
                repeatEmailHelpBlock.appendChild(document.createTextNode(err));
                repeatMailInput.style.borderColor = "red";    //color the repeatMail's form red, to better notify the user.
            }
            else
            {
                nicknameHelpBlock.appendChild(document.createTextNode(err));
                nickInput.style.borderColor = "red";    //color the nickname's form red, to better notify the user.
            }
        }); 
    }
    else if (Password.length<8 && Mail!=RepeatMail && !Mail.includes("@", -2) && Nick.length==0)
    {
        //adding the red coloured border to the input elements.
        nickInput.style.borderColor = "red";
        mailInput.style.borderColor = "red";
        repeatMailInput.style.borderColor = "red";
        passwordInput.style.borderColor = "red";

        emailHelpBlock.appendChild(document.createTextNode("Email confirmation doesn't match email!"));
        repeatEmailHelpBlock.appendChild(document.createTextNode("Email confirmation doesn't match email!"));
        passwordHelpBlock.appendChild(document.createTextNode("Password must be at least 8 characters long!"));
        nicknameHelpBlock.appendChild(document.createTextNode("Please insert a valid username!"));
    }
    else 
    {
        if (Mail!=RepeatMail){   //mail NON coincidono
            mailInput.style.borderColor = "red";
            repeatMailInput.style.borderColor = "red";
            emailHelpBlock.appendChild(document.createTextNode("Email confirmation doesn't match email!"));
            repeatEmailHelpBlock.appendChild(document.createTextNode("Email confirmation doesn't match email!"));
        }
        if (Password.length<8)   //password troppo piccola
        {
            passwordInput.style.borderColor = "red";
            passwordHelpBlock.appendChild(document.createTextNode("Password must be at least 8 characters long!"));
        }
        if (!Mail.includes("@", -2))    //make a first attempt to validate the mail (server will validate it better)
        {
            mailInput.style.borderColor = "red";
            repeatMailInput.style.borderColor = "red";

            emailHelpBlock.appendChild(document.createTextNode("Please insert a valid email address!"));
            repeatEmailHelpBlock.appendChild(document.createTextNode("Please insert a valid email address!"));
        }
        if (Nick.length==0)
        {
            nickInput.style.borderColor = "red";
            nicknameHelpBlock.appendChild(document.createTextNode("Please insert a valid username!"));
        }
    }
    document.getElementById('Sign-up').disabled = false;    //user failed to register. Re-abilitate the register button
   }

   /**
    * function that, using the API functions, checks if a user has logged in succesfully.
    * If that's the case, it will redirect him to the home page, otherwise it will show an error in the login page, 
    * while asking the user to insert the credentials again.
    */
   loginUser = async()=>{
    const Nick = document.getElementById('inputNickname').value;
    const Password = document.getElementById('inputPassword').value;
    const msg = document.getElementById('msg');

    const NickInput = document.getElementById('inputNickname');
    const PasswordInput = document.getElementById('inputPassword');

    $('#msg').empty();   //remove the help block 

    //color with red all the borders of the input forms which are invalid
    if (Nick==""|| Password=="")
    {
        if (Nick=="")   NickInput.style.borderColor="red";
        else    NickInput.style.borderColor="";

        if (Password=="")   PasswordInput.style.borderColor="red";
        else    PasswordInput.style.borderColor="";
    }
    else
    {
        NickInput.style.borderColor="";
        PasswordInput.style.borderColor="";
    }

    Api.loginUser(Nick, Password).then((out)=>{
        this.logged = true;
        page.redirect('/');
    }).catch((err)=>{
        console.log(JSON.stringify(err));
        msg.appendChild(document.createTextNode(err.errors[0].msg));
    })
   }

   /**
    * function needed to create all the HTML needed and prepare the client's browser tho show a project's page
    * @param {*} req req.params containing the id of the project to show
    */
   openProject = async(req)=>{
        $('#main-menu').empty(); //clear the main-menu contents.
        $('commenti').empty();  //clear all the comments of the project
        const mainMenu = document.getElementById('main-menu');
        const out = await Api.getProjectInfo(req.params.id).catch((err)=>console.log(err));
        document.title = `Forum - ${decodeHtml(out.Name)}`; //update the name of the page
        if (out.Img[0]=="")   out.Img = "";   //if i don't have any image, flag it in this way
        const outCommenti = await Api.getProjectComments(req.params.id, 0, 7);
        assets = outCommenti;
        const owner = await Api.getNick(out.Owner);
        mainMenu.insertAdjacentHTML('beforeend', createProjectPage(out, owner.Nick));   //create project page

        //get first level breadcrumbs informations
        let prevTxt = document.getElementById('breadcrumbItems').firstChild.firstChild.innerText;
        let prevHref = document.getElementById('breadcrumbItems').firstChild.firstChild.href;
        $('#breadcrumbItems').empty();  //clear the breadcrumb
        document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`${prevTxt}`, `${prevHref}`)); //update the breadcrumb with the project Name
        document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`${out.Name}`, `${window.location.href}`)); //update the breadcrumb with the project Name

        //insert all the project's image in the carousel
        let arrayImg = out.Img; //variable used to store array of images
        if (arrayImg[0]!=="")    //crerate the carousel only if there are actual images to show!!
        {
            const projectHTML = document.getElementById('project'); //get the element where to append the carousel to.
            
            for(let i=0; i<arrayImg.length; i++)    //won't use for...of because of the lack of a counter.
            {
                //counter i is needed by the function createCarouselButton!
                if (arrayImg[i]!="")    //for safety reasons
                {
                    if (i==0)   //create and sets the first image and button to active inside the carousel
                    {
                        document.getElementById('carousel-indicators').insertAdjacentHTML('beforeend', createCarouselButton(true, i));
                        document.getElementById('carousel-inner').insertAdjacentHTML('beforeend', carouselAddImage(true, arrayImg[i], i, out.ImgDescription, arrayImg[i].includes('.mp4')||arrayImg[i].includes('.mov')||arrayImg[i].includes('.avi')||arrayImg[i].includes('wmv')?'video':'image'));
                    }
                    else    //create all the other images and buttons to be put in the carousel.
                    {
                        document.getElementById('carousel-indicators').insertAdjacentHTML('beforeend', createCarouselButton(false, i));
                        document.getElementById('carousel-inner').insertAdjacentHTML('beforeend', carouselAddImage(false, arrayImg[i], i, out.ImgDescription, arrayImg[i].includes('.mp4')||arrayImg[i].includes('.mov')||arrayImg[i].includes('.avi')||arrayImg[i].includes('wmv')?'video':'image'));
                    }
                }
            }
            
        }

        this.hasInteractedWrapper(out.Id, 'project');   //check if the user has already interacted with the current project and if so, highlite the downvote/upvote Thumb appropriately
        this.hasInteractedWrapper(out.Id, 'favourite');   //check if the user has already set the project to favoruite in the databse. If so, paint the star orange.
        const bottNavi = document.getElementById('BottNavi');
        let commentsNum = await Api.getCommentsNum(req.params.id);

        bottomNaviGenerator(commentsNum, bottNavi, `/projects/${req.params.id}`);    //generate the bottom Navigator
        const commenti = document.getElementById('commenti');
        let info = await Api.isLogged();    //retrieve logged user info.
        for (let commento of outCommenti)   //generate the first seven project's comments
        {
            let commentOwner = await Api.getNick(commento.Owner);
            commenti.insertAdjacentHTML('beforeend', insertComment(commento, commentOwner, info.userInfo));
            this.hasInteractedWrapper(commento.Id, 'comment');  //checking if a comment has been already liked/disliked by the user
            this.hasInteractedWrapper(commento.Id, 'useful');   //checking if a comment has been already marked as 'useful' by the user
        }

        //if you are the owner of the project, show the modify and delete buttons for it
        if (owner.Nick==info.userInfo.Nick)
        {
            document.getElementById('modify').className="";
            document.getElementById('delete').className="";
        }
   }

   /**
    * function needed to show all the project's comments, 7 at a time.
    * @param {*} req the page of the comments to be shown.
    */
   showComments = async(req)=>{
        $('#commenti').empty(); //clear previously generated comments
        let min = parseInt(req.params.page);
        const outCommenti = await Api.getProjectComments(req.params.id, (min-1)*7, 7);  //get 7 comments, starting from min up to min*7
        const commenti = document.getElementById('commenti');
        commenti.insertAdjacentHTML('afterbegin', createCommentPromptHTML(req.params.id));
        let info = await Api.isLogged(); //retrieve the logged in user info.
        for (let commento of outCommenti)   //generate the first seven project's comments
        {
            let commentOwner = await Api.getNick(commento.Owner);
            commenti.insertAdjacentHTML('beforeend', insertComment(commento, commentOwner, info.userInfo));
            this.hasInteractedWrapper(commento.Id, 'comment');  //checking if a comment has been already liked/disliked by the user
            this.hasInteractedWrapper(commento.Id, 'useful');   //checking if a comment has been already marked as 'useful' by the user
        }
        //insert the padding comment
        commenti.insertAdjacentHTML('beforeend', insertPaddingComment());
        let elementsNum = await Api.getCommentsNum(req.params.id);    //get the number of comments of the project.

        //update the bottom navigator according to the page i currently am
        updateBottomNavi(req.params.page, elementsNum%7!==0?Math.floor(elementsNum/7)+1:Math.floor(elementsNum/7), `/projects/${req.params.id}`);   
    }

    /**
    * function needed to show all the project's comments, 7 at a time.
    * @param {*} req the object containing the page of the comments to be shown.
    */
    showProjectsPage = async(req)=>{
        $('#Projects').empty(); //clear previously generated projects
        let path;
        if (this.bufferedProjects.type==="Recently added projects") path = "recent";
        else if (this.bufferedProjects.type==="Top trending") path = "trending";
        else if (this.bufferedProjects.type==="Digital Electronics")  path = "digital";
        else if (this.bufferedProjects.type==="Analog Electronics") path = "analog";
        else if (this.bufferedProjects.type==="Coding") path = "coding";
        else if (this.bufferedProjects.type==="Favourites") path = "favourites";
        else if (this.bufferedProjects.type==="My projects") path = "personalProjects";

        //sets the <h4> header of the type of project to be shown
        this.mainMenuHTML.insertAdjacentHTML('beforeend',createBulk(1));
        let projectsHeaderHTML = document.querySelector(`#other${1}>#ProjectsHeader`);
        projectsHeaderHTML.insertAdjacentHTML('beforeend',createProjectHeader(this.bufferedProjects.type));  //setta header
        bottomNaviGenerator(this.bufferedProjects.projects.length, document.getElementById('endpageNavigator'), `/${path}`); //generate bottom paginator, if needed

        let iteration=1;
        let min = parseInt(req.params.page);
        let outProgetti = this.bufferedProjects.projects.slice((min-1)*7, (min+6)*7);    //every time slice the buffer to obtain a shallow copy with 7 elements.
        const progetti = document.getElementById('Projects');
        for (let project of outProgetti)   //generate the first seven projects
        {
            if (iteration==7) break;  //quit iterating if max number of projects to be shown is hit.
            let comment = await Api.getLatestComment(project.ID===undefined?project.Id:project.ID);   //latest comment
            let commentsNum = await Api.getCommentsNum(project.ID===undefined?project.Id:project.ID); //number of comments
            let ownerInfo = await Api.getNick(project.Owner);    //get the Nick and the Image of the owner of the project
            const progettoHTML = insertProject(project, comment, commentsNum, ownerInfo);   //create the card, showing the project in the page.
            progetti.insertAdjacentHTML('beforeend', progettoHTML);
            iteration+=1;   //increment the counter
        }
        let elementsNum = this.bufferedProjects.projects.length; //get the number of projects total.

        //update the bottom navigator according to the page i currently am
        updateBottomNavi(req.params.page, elementsNum%7!==0?Math.floor(elementsNum/7)+1:Math.floor(elementsNum/7), `/${path}`);   
    }

    /**
     * wrapper function. checks in the database if an user has already interacted with the element or no.
     * @param {*} elementID 
     * @param {*} elementType 
     */
    hasInteractedWrapper = async(elementID, elementType)=>{
        Api.hasInteracted(elementID, elementType).then((out)=>{
            let HTML1, HTML2;
            if (elementType=="comment")
            {
                HTML1 = document.getElementById(`upvoteComment${elementID}`); //get the element containing the upvote hand
                HTML2 = document.getElementById(`downvoteComment${elementID}`);   //get the node containing the downvote hand
                 //if Api.hasIteracted returns 1, the element was upvoted (so its color will be set to green), if it returns 0 the element was downvoted (and its color will be set to red), otherwise, no interaction occurred, and currentcolor will be set
                out.Interaction===1?HTML1.firstChild.style.fill="green":out.Interaction===0?HTML2.firstChild.style.fill="red":HTML1.firstChild.style.fill="currentcolor";
            }
            else if(elementType=="favourite")
            {
                HTML1 = document.getElementById(`favouriteProject${elementID}`); //get the element containing the upvote hand
                out.Interaction>=0?HTML1.lastChild.style.fill="orange":HTML1.lastChild.style.fill="currentcolor";
            }
            else if(elementType=="useful")  //check if the user has already set the current comment to useful.
            {
                HTML1 = document.getElementById(`usefulComment${elementID}`);
                if (out.Interaction>=0)
                {
                    HTML1.lastChild.style.fill="black";

                    //the following block of code, is needed to generate the text inside the commentUseful container, so that from the HTML page, the user can be able to understand
                    //if he already marked the comment as useful or not.
                    if (HTML1.firstChild.innerText.includes("1 people found"))   //if this is true, then no-one already marked the comment as useful.
                    {
                        HTML1.firstChild.innerText = "You found this comment useful";
                    }
                    else    //someone else already found the comment useful.
                    {
                        HTML1.firstChild.innerText = "you and "+HTML1.innerText;  //show to the user in the html that it has already marked this comment useful.
                    }
                }
                else HTML1.lastChild.style.fill="currentcolor";
            }
            else //elem is upvote/downvote project
            {
                HTML1 = document.getElementById(`upvoteProject${elementID}`);
                HTML2 = document.getElementById(`downvoteProject${elementID}`);
                //if Api.hasIteracted returns 1, the element was upvoted (so its color will be set to green), if it returns 0 the element was downvoted (and its color will be set to red), otherwise, no interaction occurred, and currentcolor will be set
                out.Interaction===1?HTML1.firstChild.style.fill="green":out.Interaction===0?HTML2.firstChild.style.fill="red":HTML1.firstChild.style.fill="currentcolor";
            }

        }).catch((err)=>console.log("err: "+err));
    }

    /**
     * function taking care of the 'add a project' feature of the site.
     * @param placeholders used if you want to show the page with already set placeholders. Deafaults to undefined
     * @param projectID used to specify which project must be updated. To be used together with 'placeholders' set.
     */
    addProjectPage = async(placeholders = undefined, projectID = undefined)=>{
        bufferFile = [];    //clearing the array every time i re-open the addProject page.
        $('#main-menu').empty(); //clear the main-menu contents.
        document.getElementById('main-menu').insertAdjacentHTML('afterbegin', addProjectHTML(placeholders, projectID));

        if (placeholders!==undefined){
            document.getElementById('project-name').placeholder = placeholders.Name;     //sets name's placeholder
            document.getElementById('project-name').value = placeholders.Name;     //sets name's value
            document.getElementById(`${placeholders.Type}`).selected=true;  //sets the category selected
            document.getElementById('projectDescription').placeholder = placeholders.Description;   //sets the description's placeholder
            document.getElementById('projectDescription').value = placeholders.Description;   //sets the description's value
        }
        //insert images
        let i = 1; //counter for images
        if (placeholders!=undefined)    //checking if the object placeholders is not undefined
        {
            if (placeholders.Img != undefined)
            {
                for (let img of placeholders.Img)
                {
                    if (img!="")    //otherwise, this will lead to a bug (when database Img cell is empty, it would generate one white card)
                    {
                        document.getElementById("cardsImagePreviewContainer").insertAdjacentHTML('beforeend', imagePreviewCardHTML(i, img.includes('.mp4')||img.includes('.mov')||img.includes('.avi')||img.includes('wmv')?'video':'image')); //create the preview container, and insert it in the 'cardsImagePreviewContainer' div
                        let target;
                        img.includes('.mp4')||img.includes('.mov')||img.includes('.avi')||img.includes('wmv')?target=`videoPreview${i}`:target=`imagePreview${i}`;  //calculate target of the 'updatePreview' function

                        //attach the img to the card
                        img = img.toString().replaceAll('&#x2F;', '\\');
                        img = img.toString().replaceAll('&#x5C;', '/');  //for some reasons, multer changes the '/' and the '\' into those two codes, so they must be translated back.
                        document.getElementById(target).src = img;
                        document.getElementById(`imageDescription${i}`).placeholder = placeholders.ImgDescription[i-1];   //add the corresponding image description
                        document.getElementById(`imageDescription${i}`).value = placeholders.ImgDescription[i-1];   //add the corresponding image description as a written text
                        i+=1;   //increment counter
                    }
                }
                imageNum = i;
            }

            //insert files
            i = 1; //counter for files
            for (let file of placeholders.FilesNames)
            {
                if (file!="")
                {
                    document.getElementById("cardsFilePreviewContainer").insertAdjacentHTML('beforeend', filePreviewCardHTML(i, file)); //create the preview container, and insert it in the 'cardsImagePreviewContainer' div
                    let target = `filePreview${i}`;  //calculate target of the 'updatePreview' function
                    //attach the img of the file type to the card for the file preview
                    file = file.toString().replaceAll('&#x2F;', '\\');
                    file = file.toString().replaceAll('&#x5C;', '/');  //for some reasons, multer changes the '/' and the '\' into those two codes, so they must be translated back.
                    document.getElementById(target).src = file;
                    i+=1;   //increment counter
                }
            }
        }
    
    }

    /**
     * function used to generate the HTML needed for the ProjectPage
     * @param {*} userNick defaults to undefined. Specifies which user's personal page to show. If left undefined, the logged user's personal page will be shown instead.
     */
    showPersonalPage = async(userNick=undefined)=>{
        $('#main-menu').empty(); //clear the main-menu contents.
        let info = await Api.isLogged();   //retrieve the current info's of the logged user.
        Api.getUserInfo(userNick==undefined?info.userInfo.Nick:userNick).then((user)=>{    //get all the latest info about the user before showing the personal page
            document.getElementById('main-menu').insertAdjacentHTML('afterbegin', generatePersonalPageHTML(user, info.userInfo.Nick));    //inserting the HTML needed to show the PersonalPage in the mainMenu
            if (info.userInfo.Role=="admin")
            {
                document.getElementById('button').style.visibility = "visible";
                document.getElementById('sumbitChanges').style.display = "none";
                document.getElementById('deleteUserBtn').style.marginTop = "-1.5rem";
            }
        }).catch((err)=>{
            console.log(JSON.stringify(err));   //an error has occurred: printing the error.
        });
        
    }

    /**
     * function needed by the client to perform the actual search.
     * When the search button is pressed, this client will initialize all the info about what the user wanted to search, and forwards them to the Api's function module.
     */
    searchButtonPressed = async()=>{
        let searchType; //the type of the search to be performed
        let searchTime = 'allDates'; //user wants to get a project from a certain time onwards. Deafults to allDates
        let searchCategory = 'all'; //search category for the projects. Deafaults to all.
        let searchTxt;  //the search text
        document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css"); //client MUST be sure to use the appropriate CSS!
        document.title = "Forum - HomePage";

        //get the date (if selected)
        if (document.getElementById('allDates').checked == true) searchTime = 'allDates'
        else if (document.getElementById('lastYear').checked == true) searchTime = 'lastYear';
        else if (document.getElementById('lastMonth').checked == true) searchTime = 'lastMonth';
        else if (document.getElementById('lastWeek').checked == true) searchTime = 'lastWeek';
        else if (document.getElementById('lastDay').checked == true) searchTime = 'lastDay';

        if (document.getElementById('profileSearch').checked == true){
            searchType = 'profiles';
            searchTxt = document.getElementById('searchBarText').value; //get the text of the searchBar
            
            let searchedProfilesBackbone;
            let index,projectsHeaderHTML;   //needed to create HTML
            index = 1;
            this.initForumHTML();
            this.mainMenuHTML.innerHTML = '';   //clear all previous sidebars and HTML
            this.sidebarHTML.innerHTML = '';
            this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Home")); //create a new sideBar with home activated

            //sets the <h4> header of the type of project to be shown (the users, in this case)
            this.mainMenuHTML.insertAdjacentHTML('beforeend',createBulk(index));    //creates a div before the div for cards. This makes so that the header won't interfere with showing cards 
            projectsHeaderHTML = document.querySelector(`#other${index}>#ProjectsHeader`);
            this.mainMenuHTML.insertAdjacentHTML('beforeend',showSearchedProfilesBackBone());
            searchedProfilesBackbone = document.getElementById(`searchedProfilesBackbone`);
            projectsHeaderHTML.insertAdjacentHTML('afterbegin',createProjectHeader("Search results:"));  //setta header
            document.getElementById('endpageNavigator').style.display="none";   //hides the endpageNavigator
            let profiles = await Api.searchSiteContents(searchType, searchTime, searchCategory, searchTxt); //get all the profiles matching that Nick
            for( let profile of profiles)
            {
                searchedProfilesBackbone.insertAdjacentHTML('beforeend', insertSearchedUserProfile(profile));
            }
        }
        else    //user want to search for a project
        {
            searchType = 'projects'
            if (document.getElementById('categorySearch').checked == true)  searchCategory = document.getElementById('categorySelected').value;
            searchTxt = document.getElementById('searchBarText').value; //get the text of the searchBar
    
            //generate HTML for projects
            let projectsHeaderHTML, projectsHTML;
            let index = 1;
            let projects = await Api.searchSiteContents(searchType, searchTime, searchCategory, searchTxt);  //do the actual search
            document.getElementById("css").setAttribute("href", "/stylesheets/HomeEsameStyle.css");
            this.initForumHTML();
            this.mainMenuHTML.innerHTML = '';   //clear all previous sidebars and HTML
            this.sidebarHTML.innerHTML = '';
            this.sidebarHTML.insertAdjacentHTML('beforeend',createSideBar("Home")); //create a new sideBar with home activated

            //sets the <h4> header of the type of project to be shown
            this.mainMenuHTML.insertAdjacentHTML('beforeend',createBulk(index));
            projectsHeaderHTML = document.querySelector(`#other${index}>#ProjectsHeader`);
            projectsHTML = document.querySelector(`#other${index}>#Projects`);
            projectsHeaderHTML.insertAdjacentHTML('beforeend',createProjectHeader("Search results:"));  //setta header

            for (let project of projects)
            {
                let comment = await Api.getLatestComment(project.ID===undefined?project.Id:project.ID);   //latest comment
                let commentsNum = await Api.getCommentsNum(project.ID===undefined?project.Id:project.ID); //number of comments
                let ownerInfo = await Api.getNick(project.Owner);    //get the Nick and the Image of the owner of the project
                const progettoHTML = insertProject(project, comment, commentsNum, ownerInfo);   //create the card, showing the project in the page.
                projectsHTML.insertAdjacentHTML('beforeend', progettoHTML);
            }
        }
    }
}

/**
 * little private function, used to replace all occurrencies of a substring inside a string.
 * @param {*} search the substring to replace
 * @param {*} replacement replacement for the substring to replace
 * @returns 
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * client function, needed to select (or toggle the selection) of a generic element on the site
 * @param {*} elementID 
 * @param {*} boolean setting it to true will toggle the upvote, otherwise the comment will be upvoted
 * @param {*} type sets the type of interaction with the element (1 for upvote, 0 for downvote)
 * @param {*} nature sets the nature of the element "comment" for comments, "project" for projects and so on
 */
function elementInteraction(elementID, boolean, type, nature){
    if (nature==="comment") //if the element is a comment
    {
        const upvoteHTML = document.getElementById(`upvoteComment${elementID}`);    //get the element containing the upvote hand
        const downvoteHTML = document.getElementById(`downvoteComment${elementID}`);    //get the node containing the downvote hand
        if (type===1)   //the element must be upvoted
        {
            if(downvoteHTML.firstChild.style.fill=="red")   //check if a downvote was already selected
            {
                Api.toggleDownvoteComment(elementID).then((out)=>{  //toggle the downvote (in the DB as well), and clears all the modification made to the 'downvoteThumb'.
                    const downvoteHand = document.getElementById(`downvoteComment${elementID}`);
                    downvoteHand.firstChild.style.fill = "currentcolor";    //set the color to default
                    let dislikes = parseInt(downvoteHand.lastChild.innerHTML);  //get the dislikes of the comment from the HTML
                    downvoteHand.lastChild.innerHTML = `${dislikes-1}`;  //update the dislikes on the HTML

                    if (boolean)    //upvote already set
                    {
                        Api.toggleUpvoteComment(elementID).then((out)=>{    //toggle the upvote (in the DB as well), and clears all the modification made to the upvoteThumb.
                            const upvoteHand = document.getElementById(`upvoteComment${elementID}`);
                            upvoteHand.firstChild.style.fill = "currentColor";  //set the color to default
                            let likes = parseInt(upvoteHand.lastChild.innerHTML);   //get the likes of the comment from the HTML
                            upvoteHand.lastChild.innerHTML = `${likes-1}`;  //update the likes on the HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                    else
                    {
                        Api.upvoteComment(elementID).then((out)=>{  //upvote the comment, and set the 'upvoteThumb' color to green.
                            const upvoteHand = document.getElementById(`upvoteComment${elementID}`);
                            upvoteHand.firstChild.style.fill = "green"; //set the color to green
                            let likes = parseInt(upvoteHand.lastChild.innerHTML);   //get the likes of the comment from the HTML
                            upvoteHand.lastChild.innerHTML = `${likes+1}`;  //update the likes on the HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
            }
            else
            {
                if (boolean)    //upvote already set
                {
                    Api.toggleUpvoteComment(elementID).then((out)=>{    //toggle the upvote (in the DB as well), and clears all the modification made to the upvoteThumb.
                        const upvoteHand = document.getElementById(`upvoteComment${elementID}`);
                        upvoteHand.firstChild.style.fill = "currentColor";  //set the color to default
                        let likes = parseInt(upvoteHand.lastChild.innerHTML);   //get the likes of the comment from the HTML
                        upvoteHand.lastChild.innerHTML = `${likes-1}`;  //update the likes on the HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
                else
                {
                    Api.upvoteComment(elementID).then((out)=>{  //upvote the comment, and set the 'upvoteThumb' color to green.
                        const upvoteHand = document.getElementById(`upvoteComment${elementID}`);
                        upvoteHand.firstChild.style.fill = "green"; //set the color to green
                        let likes = parseInt(upvoteHand.lastChild.innerHTML);   //get the likes of the comment from the HTML
                        upvoteHand.lastChild.innerHTML = `${likes+1}`;  //update the likes on the HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
            }
        }
        else    //the element must be downvoted
        {
            if (upvoteHTML.firstChild.style.fill=="green")  //check if an upvote was already selected
            {
                Api.toggleUpvoteComment(elementID).then((out)=>{    //toggle the upvote (in the DB as well), and clears all the modification made to the upvoteElement.
                    const upvoteHand = document.getElementById(`upvoteComment${elementID}`);
                    upvoteHand.firstChild.style.fill = "currentColor";  //sets the color to default
                    let likes = parseInt(upvoteHand.lastChild.innerHTML);   //get the likes of the comment from the HTML
                    upvoteHand.lastChild.innerHTML = `${likes-1}`;  //update the likes on the HTML

                    if (boolean)    //downvote already set
                    {
                        Api.toggleDownvoteComment(elementID).then((out)=>{  //toggle the downvote (in the DB as well), and clears all the modification made to the 'downvoteThumb'.
                            const downvoteHand = document.getElementById(`downvoteComment${elementID}`);
                            downvoteHand.firstChild.style.fill = "currentcolor";    //set the color to default
                            let dislikes = parseInt(downvoteHand.lastChild.innerHTML);  //get the dislikes of the comment from the HTML
                            downvoteHand.lastChild.innerHTML = `${dislikes-1}`;  //update the dislikes on the HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                    else
                    {
                        Api.downvoteComment(elementID).then((out)=>{
                            const downvoteHand = document.getElementById(`downvoteComment${elementID}`);
                            downvoteHand.firstChild.style.fill = "red"; //sets the color to red
                            let dislikes = parseInt(downvoteHand.lastChild.innerHTML);  //get the dislikes of the comment from the HTML
                            downvoteHand.lastChild.innerHTML = `${dislikes+1}`; //update the dislikes on HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
            }
            else
            {
                if (boolean)    //downvote already set
                {
                    Api.toggleDownvoteComment(elementID).then((out)=>{  //toggle the downvote (in the DB as well), and clears all the modification made to the 'downvoteThumb'.
                        const downvoteHand = document.getElementById(`downvoteComment${elementID}`);
                        downvoteHand.firstChild.style.fill = "currentcolor";    //set the color to default
                        let dislikes = parseInt(downvoteHand.lastChild.innerHTML);  //get the dislikes of the comment from the HTML
                        downvoteHand.lastChild.innerHTML = `${dislikes-1}`;  //update the dislikes on the HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
                else
                {
                    Api.downvoteComment(elementID).then((out)=>{
                        const downvoteHand = document.getElementById(`downvoteComment${elementID}`);
                        downvoteHand.firstChild.style.fill = "red"; //sets the color to red
                        let dislikes = parseInt(downvoteHand.lastChild.innerHTML);  //get the dislikes of the comment from the HTML
                        downvoteHand.lastChild.innerHTML = `${dislikes+1}`; //update the dislikes on HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
            }
        }
    }
    else if(nature==="project") //if the element is a project
    {
        const upvoteHTML = document.getElementById(`upvoteProject${elementID}`);    //get the element containing the upvote hand
        const downvoteHTML = document.getElementById(`downvoteProject${elementID}`);    //get the node containing the downvote hand
        if (type===1)   //the element must be upvoted
        {
            if(downvoteHTML.firstChild.style.fill=="red")   //check if a downvote was already selected
            {
                Api.toggleDownvoteProject(elementID).then((out)=>{  //toggle the downvote (in the DB as well), and clears all the modification made to the 'downvoteThumb'.
                    downvoteHTML.firstChild.style.fill = "currentcolor";    //set the color to default
                    let dislikes = parseInt(downvoteHTML.lastChild.innerHTML);  //get the dislikes of the project from the HTML
                    downvoteHTML.lastChild.innerHTML = `${dislikes-1}`;  //update the dislikes on the HTML

                    if (boolean)    //upvote already set
                    {
                        Api.toggleUpvoteProject(elementID).then((out)=>{    //toggle the upvote (in the DB as well), and clears all the modification made to the upvoteThumb.
                            upvoteHTML.firstChild.style.fill = "currentColor";  //set the color to default
                            let likes = parseInt(upvoteHTML.lastChild.innerHTML);   //get the likes of the project from the HTML
                            upvoteHTML.lastChild.innerHTML = `${likes-1}`;  //update the likes on the HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                    else
                    {
                        Api.upvoteProject(elementID).then((out)=>{  //upvote the project, and set the 'upvoteThumb' color to green.
                            upvoteHTML.firstChild.style.fill = "green"; //set the color to green
                            let likes = parseInt(upvoteHTML.lastChild.innerHTML);   //get the likes of the project from the HTML
                            upvoteHTML.lastChild.innerHTML = `${likes+1}`;  //update the likes on the HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
            }
            else
            {
                if (boolean)    //upvote already set
                {
                    Api.toggleUpvoteProject(elementID).then((out)=>{    //toggle the upvote (in the DB as well), and clears all the modification made to the upvoteThumb.
                        upvoteHTML.firstChild.style.fill = "currentColor";  //set the color to default
                        let likes = parseInt(upvoteHTML.lastChild.innerHTML);   //get the likes of the project from the HTML
                        upvoteHTML.lastChild.innerHTML = `${likes-1}`;  //update the likes on the HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
                else
                {
                    Api.upvoteProject(elementID).then((out)=>{  //upvote the project, and set the 'upvoteThumb' color to green.
                        upvoteHTML.firstChild.style.fill = "green"; //set the color to green
                        let likes = parseInt(upvoteHTML.lastChild.innerHTML);   //get the likes of the project from the HTML
                        upvoteHTML.lastChild.innerHTML = `${likes+1}`;  //update the likes on the HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
            }
        }
        else    //the element must be downvoted
        {
            if (upvoteHTML.firstChild.style.fill=="green")  //check if an upvote was already selected
            {
                Api.toggleUpvoteProject(elementID).then((out)=>{    //toggle the upvote (in the DB as well), and clears all the modification made to the upvoteElement.
                    upvoteHTML.firstChild.style.fill = "currentColor";  //sets the color to default
                    let likes = parseInt(upvoteHTML.lastChild.innerHTML);   //get the likes of the project from the HTML
                    upvoteHTML.lastChild.innerHTML = `${likes-1}`;  //update the likes on the HTML

                    if (boolean)    //downvote already set
                    {
                        Api.toggleDownvoteProject(elementID).then((out)=>{  //toggle the downvote (in the DB as well), and clears all the modification made to the 'downvoteThumb'.
                            downvoteHTML.firstChild.style.fill = "currentcolor";    //set the color to default
                            let dislikes = parseInt(downvoteHTML.lastChild.innerHTML);  //get the dislikes of the project from the HTML
                            downvoteHTML.lastChild.innerHTML = `${dislikes-1}`;  //update the dislikes on the HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                    else
                    {
                        Api.downvoteProject(elementID).then((out)=>{
                            downvoteHTML.firstChild.style.fill = "red"; //sets the color to red
                            let dislikes = parseInt(downvoteHTML.lastChild.innerHTML);  //get the dislikes of the project from the HTML
                            downvoteHTML.lastChild.innerHTML = `${dislikes+1}`; //update the dislikes on HTML
                        }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                    }
                }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
            }
            else
            {
                if (boolean)    //downvote already set
                {
                    Api.toggleDownvoteProject(elementID).then((out)=>{  //toggle the downvote (in the DB as well), and clears all the modification made to the 'downvoteThumb'.
                        downvoteHTML.firstChild.style.fill = "currentcolor";    //set the color to default
                        let dislikes = parseInt(downvoteHTML.lastChild.innerHTML);  //get the dislikes of the project from the HTML
                        downvoteHTML.lastChild.innerHTML = `${dislikes-1}`;  //update the dislikes on the HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
                else
                {
                    Api.downvoteProject(elementID).then((out)=>{
                        downvoteHTML.firstChild.style.fill = "red"; //sets the color to red
                        let dislikes = parseInt(downvoteHTML.lastChild.innerHTML);  //get the dislikes of the project from the HTML
                        downvoteHTML.lastChild.innerHTML = `${dislikes+1}`; //update the dislikes on HTML
                    }).catch((err)=>console.log(err));  //if an error has occurred, print an error message
                }
            }
        }
    }
    else if(nature==="favourite"){  //if the element is a bootrsap's 'bi bi-star' (favourites button)
        const favouriteHTML = document.getElementById(`favouriteProject${elementID}`);
        if (boolean)
        {
            Api.toggleFavouriteProject(elementID).then(()=>{
                favouriteHTML.lastChild.style.fill = "currentcolor";
            })
        }
        else
        {
            Api.favouriteProject(elementID).then(()=>{
                favouriteHTML.lastChild.style.fill = "orange"; //sets the color of the star to orange
            });
        }
    }
    else if(nature==="useful"){ //if the selected element is 'this comment was useful' then do the following
        const usefulHTML = document.getElementById(`usefulComment${elementID}`);
        if (boolean)    //User finds the comment no more useful. 
        {
            Api.toggleCommentUseful(elementID).then(()=>{
                usefulHTML.lastChild.style.fill = "currentcolor";    //reset the fill's color to the default one
            })
            if (usefulHTML.firstChild.innerText=="You found this comment useful")   //if true, you were the only one finding the user was the only one finding the comment useful.
            {
                usefulHTML.firstChild.innerText = "Mark this comment as useful"; //since no-one else marked it as useful, the standard text will be generated back.
            }
            else    usefulHTML.firstChild.innerText = usefulHTML.firstChild.innerText.slice(7); //someone else marked the comment as useful. Cannot regenerate the default text
        }
        else
        {
            Api.setCommentUseful(elementID).then(()=>{
                usefulHTML.lastChild.style.fill = "black"; //sets the color of the svg back to black
                if (usefulHTML.firstChild.innerText.includes("Mark"))   //if this is true, then no-one already marked the comment as useful.
                {
                    usefulHTML.firstChild.innerText = "You found this comment useful";
                }
                else    //someone else already found the comment useful.
                {
                    usefulHTML.firstChild.innerText = "you and "+usefulHTML.innerText;  //show to the user in the html that it has already marked this comment useful.
                }
            });
        }
    }

    
}

/**
 * function needed to upload a new comment to the server
 * @param {*} projectID the ID of the project the client is commenting under.
 */
function commentInsert(projectID){

    const text = document.getElementById("exampleFormControlTextarea1").value   //get the text inputted by the user in the form
    if (isBlank(text))    //checking if the user has inputted an invalid string or not.
    {   //invalid string
        //document.getElementById("errorCommentLabel").text = "Please insert a valid comment! (not empty, and not containing whitespaces only)";  //printing error 
        document.getElementById("errorCommentLabel").appendChild(document.createTextNode("Please insert a valid comment! (not empty, and not containing whitespaces only)"));    //printing error 
    }
    else    //valid string
    {
        if (text.length>=10000) //comment exceeds maximum length
        {
            $('#errorCommentLabel').empty();     //clear the errorCommentLabel from the previously generated HTML.
            document.getElementById("errorCommentLabel").appendChild(document.createTextNode("Exceeded maximum length!"));    //printing error
        }
        else    //proceed by sending the comment to the server
        {
            //console.log(userGlobal);
            Api.insertComment(projectID, text).then(()=>{   //insert the comment inputted
                document.getElementById("errorCommentLabel").text="";   //clearing errors
                document.getElementById("commentPrompt").style.display="none";  //hide the prompt
                page.redirect(`/projects/${projectID}`); //refresh the page
            }).catch((err)=>console.log(err));  //print the error
        }
    }
}

/**
 * function needed to preview the image submitted by the user
 * @param {*} input the input form where you want to get the images from.
 * @param {*} target the target where to show the preview.
 */
function updatePreview(input, target) {
    let file = input.files[0];
    bufferFile.push(file);
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {
        let img = document.getElementById(target);
        // can also use "this.result"
        img.src = reader.result;
    }
}

/**
 * function used when submitting an image, for creating and managing the image cards previews.
 * @param {*} input the form containing the image file.
 * @param {boolean} [card=true] true if you want to show up a preview of the submitted image with a card, false otherwise.
 * @param {boolean} [profilePicture=false] if it's a profile picture, this optional argument MUST be set to true to ensure the elimination of the old picture!!
 */
function submitImage(input, card=true, profilePicture=false){
    if (input !== null && input !== undefined && (input.files[0].name.includes('.png') || input.files[0].name.includes('.jpeg') || input.files[0].name.includes('.jpg') || input.files[0].name.includes('.svg') || input.files[0].name.includes('.webp') || input.files[0].name.includes('.gif') || input.files[0].name.includes('.mp4') || input.files[0].name.includes('.avi') || input.files[0].name.includes('.mov') || input.files[0].name.includes('.wmv')))  //checking if the inputted image is somewhat valid
    {
        if (profilePicture)
        {
            if (input.files[0] !== null && input.files[0] !== undefined)    //checking if the inputted image is somewhat valid
            {
                if (card)
                {
                    //creates the card for the preview
                    document.getElementById("cardsImagePreviewContainer").insertAdjacentHTML('beforeend', imagePreviewCardHTML(imageNum, input.files[0].type));
                    let target;
                    input.files[0].type.includes('video')?target=`videoPreview${imageNum}`:target=`imagePreview${imageNum}`;  //calculate target of the 'updatePreview' function
                    imageNum+=1;

                    //generate the preview, and attach it to the card
                    updatePreview(input, target);
                    
                }
                else    //preview image in an already existing <img> HTML element
                {
                    updatePreview(input, 'AvatarIMG');
                }
            }
        }
        else
        {
            if (input.files[0] !== null && input.files[0] !== undefined)    //checking if the inputted image is somewhat valid
            {
                if (card)
                {
                    //creates the card for the preview
                    document.getElementById("cardsImagePreviewContainer").insertAdjacentHTML('beforeend', imagePreviewCardHTML(imageNum, input.files[0].type));
                    let target;
                    input.files[0].type.includes('video')?target=`videoPreview${imageNum}`:target=`imagePreview${imageNum}`;  //calculate target of the 'updatePreview' function
                    imageNum+=1;

                    //generate the preview, and attach it to the card
                    updatePreview(input, target);
                }
                else    //preview image in an already existing <img> HTML element
                {
                    updatePreview(input, 'AvatarIMG');
                }
            }
        }
    }
    else   document.getElementById('supportedFiles').style.color="red";
}

/**
 * function used when submitting a File, for creating and managing the file cards previews.
 * @param {*} input the form containing the image file.
 * @param {boolean} [card=true] true if you want to show up a preview of the submitted image with a card, false otherwise.
 */
function submitFile(input, card=true){
    if (input !== null && input !== undefined)  //checking if the inputted image is somewhat valid
    {
        if (input.files[0] !== null && input.files[0] !== undefined)    //checking if the inputted image is somewhat valid
        {
            if (card)
            {
                //creates the card for the preview
                document.getElementById("cardsFilePreviewContainer").insertAdjacentHTML('beforeend', filePreviewCardHTML(fileNum, input.files[0].name));
                let target = `filePreview${fileNum}`;  //calculate target of the 'updatePreview' function
                fileNum+=1;

                //generate the preview, and attach it to the card
                updatePreview(input, target);
            }
        }
    }
}

/**
 * function needed to create all the HTML needed and to prepare the client's browser to show the 'add a project' page.
 */
function uploadNewProject(){
    document.getElementById('submitButton').disabled = true;    //disable the submit button -> so i'm sure the user won't press two, times thus creating two identical projects
    imageNum = 1;
    const title = document.getElementById('project-name').value;    //project's title
    const description = document.getElementById('projectDescription').value;    //project's description
    const categorySelected = document.getElementById('categorySelect').value; //project's category

    //reset the old border's modifications
    document.getElementById('project-name').style.border = "";
    document.getElementById('projectDescription').style.border = "";

    if (title == "" || description == "")   //the two required fields are empty
    {
        if (title=="")  document.getElementById('project-name').style.border = "5px solid red";
        if(description=="") document.getElementById('projectDescription').style.border = "5px solid red";
        document.getElementById('submitButton').disabled = false;    //abilitate the submit button back -> user failed creating a new project
    }
    else    //the two required fields are not empty
    {
        let imageDescription = [];

        //getting images description
        for (let i=1; document.getElementById(`imageDescription${i}`)!==null; i++)
            imageDescription.push(document.getElementById(`imageDescription${i}`).value);

        const formData = new FormData();
        formData.append("name", title);
        for(let files of bufferFile) {  //group all files inside a single formData variable to POST inside the Api
                formData.append("files", files);
        }
        Api.fileUpload(formData, 'project').then((out)=>{   //out is an object containing three arrays: imagePaths, sourceFilePaths and inputFilesNames.
            //upload all the files to the server, and update the databases.
            //upload the project to the database. If everything went according to plans, redirect to the main page.

            let filePaths=[];
            for(let filePath of out.sourceFilesPaths)   //create a string for the filepaths
            {
                filePaths.push('/'+filePath.toString().split("\\")[filePath.toString().split("\\").length-1])
            }
            
            Api.projectAdd(title, out.imagesPaths.toString().split("public").join("../..")+',', filePaths.toString()+',', out.inputFilesNames.toString()!=""?out.inputFilesNames.toString()+',':"", description, categorySelected, imageDescription.toString()).then(()=>{page.redirect('/');}).catch(
                (err)=>console.log(err)); //print an error
        }).catch((err)=>console.log(err));    //print an error
        bufferFile = [];    //clearing the bufferFile again, just for the sake of it.
    }
}

/**
 * function needed to generate a bottom navigator.
 * @param {*} elementsNum number of elements contained in the page.
 * @param {*} bottNavi the target where to insert all the bottom paginator HTML.
 * @param {*} path the path to be put in the href tags of the buttons of the bottom paginator.
 */
function bottomNaviGenerator(elementsNum, bottNavi, path){
    if (elementsNum>7)  //bottom pagination should be created.
        {
            let i, max;
            elementsNum%7!==0?max = Math.floor(elementsNum/7)+1:max = Math.floor(elementsNum/7);
            bottNavi.insertAdjacentHTML('beforeend', bottomNaviCreate());
            const bottPagi = document.getElementById('BottPagi');
            for(i=0; i<max; i++)  //based on how many sets of 7 comments i have, i will generate the right amount of pages.
            {
                bottPagi.insertAdjacentHTML('beforeend', addPageItemMod(i+1, path+`/${i+1}`, 0));
                if (i>6 && i<max-1) document.getElementById(`pageButton${i+1}`).setAttribute('style', `display: none`);
            }
            bottPagi.insertAdjacentHTML('beforeend', addPageItemMod(2, path+`/${2}`, 1));    //'close' the pagination bar with the 'next button'
        }
}

/**
 * function needed to update the bottom paginator when a new page is visited
 * @param {*} min current number of page the user is viewing.
 * @param {*} max maximum number of pages the given element has.
 * @param {*} path path of the href to give to 'next' and 'back' pagination buttons.
 */
function updateBottomNavi(min, max, path){

    if (min==1) document.getElementById('backPagi').setAttribute('style', `pointer-events: none`);  //we are at the first page. 'Back' button shouldn't be active
    else    //activate and set paginator 'back' button.
    {
        document.getElementById('backPagi').setAttribute('style', ``);
        document.getElementById('backPagi').setAttribute('href', path+`/${min-1}`);
    }

    if (min==max)  document.getElementById('nextPagi').setAttribute('style', `pointer-events: none`);  //we reached the last page. 'next' button shoudln't be active
    else    //activate and set paginator 'next' button.
    {
        document.getElementById('nextPagi').setAttribute('style', ``);
        document.getElementById('nextPagi').setAttribute('href', path+`/${parseInt(min)+1}`);
    }

    if (min===max && min>=7*4)  //don't show every paginator button, but only display 7 at a time.
    {
        for (let i = 1; i<3; i++)
        document.getElementById(`pageButton${i}`).style.display = "none";
    }
    else if (min===1){}
    else if (document.getElementById(`pageButton${parseInt(min)+1}`) != null)  //ignore this if-statement if you're in the last page!
    {
        if (document.getElementById(`pageButton${parseInt(min)+1}`).style.display === "none")   //when progressing on the pages, the next buttons will appear
        {
            document.getElementById(`pageButton${parseInt(min)+1}`).style.display = "block";
            document.getElementById(`pageButton${min-6}`).style.display = "none";   //hide the 7th oldest button that is showing
        }
    }
    else if (document.getElementById(`pageButton${min-1}`).style.display === "none") //when regressing on the pages, the previous buttons will appear
    {
        document.getElementById(`pageButton${min-1}`).style.display = "block";
        document.getElementById(`pageButton${parseInt(min)+6}`).style.display = "none";   //hide the 7th 'newest' button that is showing
    }
}

/**
 * function needed to change the personal page in 'modify' mode.
 */
function promptModifyPersonalPage(){
    //get all the element of the page
    const Bio = document.getElementById('Bio');
    const Nick = document.querySelector('#Nickname p');
    const Name = document.querySelector('#Name p');
    const Surname = document.querySelector('#Surname p');
    const Bday = document.querySelector('#Birthday p');
    const Country = document.querySelector('#Country p');
    const State = document.querySelector('#State p');
    const Status = document.querySelector('#Status p');
    const Image = document.getElementById('Avatar');

    let text1, text2, text3, text4, text5, text6, text7, text8, text9;   //variables needed to temporarly store the contents of the HTML element -> to be used as a placeholder when using the function 'generateInputHTML()'
    //get the previosuly stored contents
    text1 = Bio.firstChild.textContent;
    text2 = Bio.lastChild.textContent;
    text3 = Nick.innerText;
    text4 = Name.innerText;
    text5 = Surname.innerText;
    text6 = Bday.innerText;
    text7 = Country.innerText;
    text8 = State.innerText;
    text9 = Status.innerText;

    document.getElementById('breadcrumbItems').insertAdjacentHTML('beforeend',breadcrumbItem(`Modify Personal Page`, `${window.location.href}`));   //update breadcrumb
    
    $('#Bio').empty();  //clear the Bio
    Bio.insertAdjacentHTML('beforeend', generateInputHTML({id:'About', label:'About Me', value:text1, onchange:'', onchageParam:'', placeholder:text1, type:'text', areaDesc:'About', status:'', max:100})); //create the input form
    Bio.insertAdjacentHTML('beforeend', generateInputHTML({id:'BioText', label:'Bio', value:text2, onchange:'', onchageParam:'', placeholder:text2, type:'text', areaDesc:'BioText', status:'', max:300})); //create the input form

    $('#Nickname').empty();  //clear the Nickname
    document.getElementById('Nickname').insertAdjacentHTML('beforeend', generateInputHTML({id:'NickInput', label:'Nickname', value:text3, onchange:'', onchageParam:'', placeholder:text3, type:'text', areaDesc:'NickInput', status:'disabled', max:36})); //create the input form

    $('#Name').empty();  //clear the Name
    document.getElementById('Name').insertAdjacentHTML('beforeend', generateInputHTML({id:'NameInput', label:'Name', value:text4, onchange:'', onchageParam:'', placeholder:text4, type:'text', areaDesc:'NameInput', status:'', max:100})); //create the input form

    $('#Surname').empty();  //clear the Surname
    document.getElementById('Surname').insertAdjacentHTML('beforeend', generateInputHTML({id:'SurnameInput', label:'Surname', value:text5, onchange:'', onchageParam:'', placeholder:text5, type:'text', areaDesc:'SurnameInput', status:'', max:100})); //create the input form

    $('#Birthday').empty();  //clear the Birthday
    document.getElementById('Birthday').insertAdjacentHTML('beforeend', generateInputHTML({id:'BdayInput', label:'Birthday', value:text6, onchange:'', onchageParam:'', placeholder:text6, type:'date', areaDesc:'BdayInput', status:'', max:100})); //create the input form

    $('#Country').empty();  //clear the Country
    document.getElementById('Country').insertAdjacentHTML('beforeend', generateInputHTML({id:'CountryInput', label:'Country', value:text7, onchange:'', onchageParam:'', placeholder:text7, type:'text', areaDesc:'CountryInput', status:'', max:100})); //create the input form

    $('#State').empty();  //clear the State
    document.getElementById('State').insertAdjacentHTML('beforeend', generateInputHTML({id:'StateInput', label:'State', value:text8, onchange:'', onchageParam:'', placeholder:text8, type:'text', areaDesc:'StateInput', status:'', max:100})); //create the input form

    $('#Status').empty();  //clear the Status
    document.getElementById('Status').insertAdjacentHTML('beforeend', generateInputHTML({id:'StatusInput', label:'Status', value:text9, onchange:'', onchageParam:'', placeholder:text9, type:'text', areaDesc:'StatusInput', status:'', max:50})); //create the input form

    //show the 'submit changes' button
    document.getElementById('button').className = "";
    document.getElementById('imageLabel').className = "";
    document.getElementById('imageSubmit').className = "";

    let profileButtons = document.getElementById('button');
    profileButtons.style.visibility = "visible";
    document.getElementById('sumbitChanges').style.display = "block";
    document.getElementById('deleteUserBtn').style.marginTop = "1.5rem";
}

/**
 * function needed to upload the new informations of the personal project page
 * @param {*} nickname nickname of the user whose personal nprofile page files shall be updated 
 */
function uploadNewUserInfo(nickname){
    //disable the 'submit changes button'
    document.getElementById('sumbitChanges').disabled = true;

    //retrieving info inserted in the input forms
    const aboutTxt = document.getElementById('About').value;
    const bioTxt = document.getElementById('BioText').value;
    const nameTxt = document.getElementById('NameInput').value;
    const surnameTxt = document.getElementById('SurnameInput').value;
    const bdayTxt = document.getElementById('BdayInput').value;
    const countryTxt = document.getElementById('CountryInput').value;
    const stateTxt = document.getElementById('StateInput').value;
    const statusTxt = document.getElementById('StatusInput').value;
    let buffer = [nameTxt, surnameTxt, bdayTxt, bioTxt, aboutTxt, "", countryTxt, stateTxt, statusTxt, ""];    //creating a buffer storing all the info
    for (let i=0; i<buffer.length; i++)
    {
        if (buffer[i]=="")  buffer[i]=undefined     //things that have not been changed should be markes as undefined, so the in the DAO i won't change them
    }

    const formData = new FormData();
    formData.append("name", `profile picture`);
    formData.append("files", bufferFile[0]) //insert the image inside the formData payload

    if (bufferFile[0]!=undefined || bufferFile.length!=0)  //user modified the personal page with a valid new profile image as well
    {
        Api.deleteUserImage(nickname).then(()=>{
            Api.fileUpload(formData, 'profile').then((out)=>{  //upload the picture to the server
                //calling the API to post the data contained in the buffer
                out.imagesPaths.length==0?buffer[5]=undefined:buffer[5]=out.imagesPaths.toString().split("public").join("../..");    //specify the profile new Image, if it was uploaded.
                Api.personalPageUpdate(buffer).then(()=>refreshHeaderHTML()).catch((err)=>console.log(err))    //refresh the header HTML (login-signup-logout);
                
                page.redirect(`/personalPage`); //redirect to the personal page, to see the changes the user has submitted
                //reabilitate the 'submit changes button'
                document.getElementById('sumbitChanges').disabled = false;
            })
            bufferFile = [];
        }).catch((err)=>console.log(err));
    }
    else    //profile image untouched or not valid at all
    {
        Api.fileUpload(formData, 'profile').then((out)=>{  //upload the picture to the server
            //calling the API to post the data contained in the buffer
            out.imagesPaths.length==0?buffer[5]=undefined:buffer[5]=out.imagesPaths.toString().split("public").join("../..");    //specify the profile new Image, if it was uploaded.
            Api.personalPageUpdate(buffer).then(()=>refreshHeaderHTML()).catch((err)=>console.log(err))    //refresh the header HTML (login-signup-logout);
            
            page.redirect(`/personalPage`); //redirect to the personal page, to see the changes the user has submitted
            //reabilitate the 'submit changes button'
            document.getElementById('sumbitChanges').disabled = false;
        }).catch((err)=>console.log(err));
        bufferFile = [];
    }
}

/**
 * function needed to refresh the HTML header.
 */
function refreshHeaderHTML(){
    $('#log').empty();
    Api.isLogged().then((info)=>{
        if (info.isAuth)
            document.getElementById("log").insertAdjacentHTML('beforeend', loggedPage(info.userInfo, 1));
        else
            document.getElementById("log").insertAdjacentHTML('beforeend', loggedPage(null, 0));
    });
}   

/**
 * function called to modify an already existing project.
 * @param {*} projectID the ID of the project to update.
 */
function modifyProject(projectID){
    imageNum = 1;
    let imageDescription = [];
    const title = document.getElementById('project-name').value;    //project's title
    const description = document.getElementById('projectDescription').value;    //project's description
    const categorySelected = document.getElementById('categorySelect').value; //project's category
    //getting images description
    for (let i=1; document.getElementById(`imageDescription${i}`)!==null; i++)
        imageDescription.push(document.getElementById(`imageDescription${i}`).value);

    const formData = new FormData();
    formData.append("name", title);
    for(let files of bufferFile) {  //group all files inside a single formData variable to POST inside the Api
            formData.append("files", files);
    }
    Api.fileUpload(formData, 'project').then((out)=>{   //out is an object containing three arrays: imagePaths, sourceFilePaths and inputFilesNames.
        //upload all the files to the server, and update the databases.
        let filePaths=[];
        for(let filePath of out.sourceFilesPaths)   //create a string for the filepaths
        {
            filePaths.push('/'+filePath.toString().split("\\")[filePath.toString().split("\\").length-1])
        }
        Api.projectUpdate([title, out.imagesPaths.toString()!==""?out.imagesPaths.toString().split("public").join("../..")+',':"", out.sourceFilesPaths.toString()!==""?filePaths.toString()+',':"", out.inputFilesNames.toString()!=""?out.inputFilesNames.toString()+',':"", description, imageDescription.toString(), categorySelected], projectID).then(()=>{
            //check if user wanted to delete some images from the project
            let arrayDestroyImg = [];   //the array of images to be destroyed
            for(let i=1; document.getElementById(`previewCard${i}`)!=null; i++)
            {
                if (document.getElementById(`previewCard${i}`).style.display == "none") //found a card the user wanted to delete
                {
                    arrayDestroyImg.push(i-1);   //gather all the indexes of the images to be destroyed
                }
            }
            if (arrayDestroyImg.length!=0)
                Api.removeUserFiles(arrayDestroyImg, 'projectImage', projectID).catch((err)=>console.log(err)); //destroy the image card
            //check if the user wanted to delete some files from the project
            let arrayDestroyFiles = [];  //the array of files to be destroyed
            for(let i=1; document.getElementById(`filePreview${i}`)!=null; i++)
            {
                if (document.getElementById(`filePreview${i}`).style.display == "none") //found a card the user wanted to delete
                {
                    arrayDestroyFiles.push(i-1);   //gather all the indexes of the files to be destroyed
                }
            }
            if(arrayDestroyFiles.length!=0)
                Api.removeUserFiles(arrayDestroyFiles, 'projectFile', projectID).catch((err)=>console.log(err)); //destroy the file card
            page.redirect(`/projects/${projectID}`)
        });
    });
}

/**
 * Using the Api class, updates the comment in the server
 * @param {*} commentID the ID of the comment to update on server-side.
 */
function updateComment(commentID){
    const modText = document.getElementById(`commentFormControlArea${commentID}`).value;    //new comment text
    Api.commentUpdate(commentID, modText).then(()=>{restoreComment(commentID)}).catch((err)=>{
        console.log(err);
        restoreComment(commentID);
    });
}

/**
 * Using the Api class, deletes the comment from the server
 * @param {*} commentID the ID of the comment to update on server-side.
 */
function deleteComment(commentID){
    document.getElementById(`cardComment${commentID}`).style.display="none";    //hide the commentCard the user wanted to delete
    Api.commentDelete(commentID).catch((err)=>console.log(err));
}

/**
 * Using the Api class, deletes the project from the server
 * @param {*} projectID the project to delete
 */
function deleteProject(projectID){
    Api.projectDelete(projectID).then(()=>page.redirect('/')).catch((err)=>{
        console.log(err);
        page.redirect('/');
    });
}

/**
 * called when pressing the 'delete profile' button.
 * Using the API, asks the server to delete a specific user from the database.
 * @param {*} userID ID of the user to be deleted. 
 * @param {boolean} [visualizingUser=false] needed to understand if who pressed the button is the owner of the profile or not.
 */
function deleteUser(userID, visualizingUser=false){
    //logout the user and redirect him to the homepage
    if (visualizingUser)    Api.logOut().catch((err)=>console.log(err));
    page.redirect('/');

    //delete the User
    Api.userDelete(userID).catch((err)=>console.log(err));
}

/**
 * function prompting a file download
 * @param {*} projectID the ID of the project the user would like to retrieve the files from.
 */
function promptFileDownload(projectID){
    Api.getDownloadFiles(projectID).then((files)=>{console.log(files)}).catch((err)=>console.log(err));
}

/**
 * function called when pressing the logout button, to log out the current logged user.
 */
function logoutButton(){
    Api.logOut().catch((err)=>console.log(err));
    page.redirect('/');
}

/**
 * small private function used to decode HTML text into a string.
 * @param {*} html the html code
 * @returns the decoded html code.
 */
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

//needed to make sure that those function can be called from the HTML.
window.commentInsert = commentInsert;
window.elementInteraction = elementInteraction;
window.submitImage = submitImage;
window.submitFile = submitFile;
window.uploadNewProject = uploadNewProject;
window.updatePreview = updatePreview;
window.promptModifyPersonalPage = promptModifyPersonalPage;
window.uploadNewUserInfo = uploadNewUserInfo;
window.modifyProject = modifyProject;
window.updateComment = updateComment;
window.deleteComment = deleteComment;
window.deleteProject = deleteProject;
window.downloadFiles = promptFileDownload;
window.logoutButton = logoutButton;
window.String.prototype.replaceAll = String.prototype.replaceAll;
window.deleteUser = deleteUser;

export {elementInteraction, updatePreview};

export default App;