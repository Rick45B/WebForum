'use strict';
// imports
const express = require('express');
const morgan = require('morgan');
const dao = require('./dao.js');
const path = require('path');
const passport = require('passport');
const fs = require('fs');   //used for the manipulation of folders
var JSZip = require("jszip");   //needed to zip project's source files to the user.
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const multer  = require('multer');  //middleware for managing images
const { v4: uuidv4 } = require('uuid'); //middleware creating RFC4122 UUIDs used for generating unique filenames. 
const {check, validationResult} = require('express-validator'); //validation middle-ware
const { sanitizeBody } = require('express-validator');

const MIME_TYPE_MAP = {     //used to append to uuid'd files their former extension -> (multer strips all the files of their extensions)
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/x-msvideo': 'avi',
    'video/quicktime': 'mov',
    'video/x-ms-wmv': 'wmv'
  };

//setting up multer diskstorage for IMAGES, filtering what can be uploaded
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/userFiles') //path where to store userFiles in the server
    },
    filename: function (req, file, cb) {    //function to assing names of the files uploaded by the client to the server
        const ext = MIME_TYPE_MAP[file.mimetype];   //get the extension of the file based on its nature.
        cb(null, uuidv4()+'.'+ext); //generate an unique uuidv4 filename with the correct extension.
    },
})
const upload = multer({ storage: storage }) //needed to set the storage type of multer (chose the hardDisk one)


// init
const app = express();
const port = 3000;

// set up the middleware
app.use(morgan('tiny'));

// every requests body will be considered as in JSON format
app.use(express.json());

// set up the 'public' component as a static website
app.use(express.static('public'));

app.use(session({ // set up here express-session
    secret: "JMVSO-TDBOX-HFWHG-WDJOL-GGVHY-BWEBS-LSDUF-AYBMP-AXJDJ-LKNFB-WZPVF-QVQLL",
    resave: false,
    saveUninitialized: false,
    cookie: { //secure: true
        httpOnly: true,
        //secure: true, passport BUG: https://github.com/expressjs/session/issues/909 -> cannot use in localhost
        maxAge: 14400000    //4 hours
     }
}));

//init passport and express-session
app.use(passport.initialize());
app.use(passport.session());

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy({
    usernameField: 'nickname'
    },
    function(username, password, done) {
        dao.getUserInfo(username, password).then(([user, check]) => {
            if (!user) 
            {
                return done(null, false, {'errors': [{'param': 'Server', 'msg': 'Incorrect username or password.'}],});
            }
            if (!check) 
            {
                return done(null, false, {'errors': [{'param': 'Server', 'msg': 'Incorrect username or password.'}],});
            }
            return done(null, user);
        }).catch((err)=>{
            return done(null, false, {'errors': [{'param': 'Server', 'msg': `${err}`}],});
        });
    }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
    console.log("Serializing user: "+user.Nickname);
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    console.log("deserializing user: "+user.Nickname);
    dao.getPersonalPage(user.Nickname).then(userInfo => {
        done(null, userInfo);
    });
});

//check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({'errors': [{'param': 'action', 'msg': 'user not authenticated'}]});
}

//function needed to check periodically if projects are still 'recently added'
function checkRecent(){
    //get all the 'recently added projects'
    console.log("checking for old projects..");
    dao.getRecent().then((recentProjects)=>{
        for (let project of recentProjects) //checking if some projects are not recent anymore.
        {
            //converting toLocale string in ISO.
            project.Date = project.Date.replace(/\s/g, '');
            project.Date = project.Date.replace(',', '/');
            let date = project.Date.split('/');

            project.Date = date[2]+'-'+date[1]+'-'+date[0]+'T'+date[3];
            let timestampDB = Date.parse(project.Date); //timestamp of the project
            let timestampNow = Date.parse(new Date());  //actual Date Timestamp
            let timestampWeek = 604800000; //timestamp of a week

            //console.log(project.ID+"timestamp: "+timestampDB);

            if (timestampNow-timestampDB > timestampWeek)   //if the project is too old (at least a week old)
            {
                console.log("project moved out from 'Recently Added Projects': "+project.ID);
                dao.toggleRecent(project.ID);
            }
        }
    })
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


// === REST API === //

//get /api/home
//get all the projects needed to load the home page
// Request body: empty
// Response body: array of an array of objects representing all the projects
app.get('/api/home',(req, res)=>{
    dao.getEveryCategory();
})

//get /api/recent
//get all the projects needed to load the 'Recently Added Projects' page
// Request body: empty
// Response body: array of objects representing all the new projects, or 500 if an internal error has occurred.
app.get('/api/recent', (req, res)=>{
    dao.getRecent().then((recent)=>{res.json(recent);}).catch((err)=>res.status(500).json(err));
});

//get /api/trending
//get all the projects needed to load the 'Top trending' page
// Request body: empty
// Response body: array of objects representing all the trending projects, or 500 if an internal error has occurred.
app.get('/api/trending', (req, res)=>{
    dao.getTrending().then((trending)=>res.json(trending)).catch((err)=>res.status(500).json(err));
});

//get /api/digital
//get all the projects needed to load the 'Digital Electronics' page
// Request body: empty
// Response body: array of objects representing all the Digital Electronics projects, or 500 if an internal error has occurred.
app.get('/api/digital', (req, res)=>{
    dao.getDigital().then((Digital)=>res.json(Digital)).catch((err)=>res.status(500).json(err));
});

//get /api/analog
//get all the projects needed to load the 'Analog Electronics' page
// Request body: empty
// Response body: array of objects representing all the Analog Electronics projects, or 500 if an internal error has occurred.
app.get('/api/analog', (req, res)=>{
    dao.getAnalog().then((Analog)=>res.json(Analog)).catch((err)=>res.status(500).json(err));
});

//get /api/coding
//get all the projects needed to load the 'Coding Projects' page
// Request body: empty
// Response body: array of objects representing all the coding projects, or 500 if an internal error has occurred.
app.get('/api/coding', (req, res)=>{
    dao.getCoding().then((Coding)=>res.json(Coding)).catch((err)=>res.status(500).json(err));
});

//get /api/projectComments/:id
//get the number of comments of the specified project.
// Request body: empty
// Response body: number of comments the project has.
app.get('/api/projectComments/:id', [
    check('id', 'Invalid arguments!').exists().isNumeric().escape(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getCommentsNum(req.params.id).then((count)=>res.json(count)).catch((err)=>res.status(500).json(err));
});

//get /api/latestComment/:Id
//get the latest comment of the project id
//request body: empty
//response body: latest project's comment text
app.get('/api/latestComment/:Id', [
    check('Id', 'Invalid Argument!').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getLatestComment(req.params.Id).then((Txt)=>res.json(Txt)).catch((err)=>res.status(500).json(err));
});

//get /api/project/:Id
//get all the info of the project Id
//request body: empty
//response body: object with all the informations of the project
app.get('/api/project/:Id', [isLoggedIn,
    check('Id', "Invalid project's Id!").exists().isNumeric()
], (req, res) =>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
    {
        dao.getProject(req.params.Id).then((Project)=>{res.json(Project)}).catch((err)=>err===undefined?res.status(404).json(err):res.status(500).json(err));
    }
});

//get /api/project/:id/comments
//get all the comments of the project Id, with a range from min (not included) to max (included)
//request body: empty
//response body: array of objects with all the comments of the project
app.get('/api/project/:Id/comments', [isLoggedIn,
    check(['Id', 'min', 'num'], 'Invalid Arguments!').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getComments(req.params.Id, req.query.min, req.query.num).then((Comments)=>res.json(Comments)).catch((err)=>err===undefined?res.status(404).json(err):res.status(500).json(err));
});

//get /api/getNick
//get the nick of the user with such id (to be specified in the query).
//request body: empty
//response body: the nick of the user with such id
app.get('/api/getNick', [
    check('id', 'Invalid query!').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getNick(req.query.id).then((Nickname)=>res.json(Nickname)).catch((err)=>err===undefined?res.status(404).json(err):res.status(500).json(err));
});

//get /api/:nick/personalPage
//get all the info of the nick's personal page
//request body: empty
//response body: object with all the informations regarding nick's personal page
app.get('/api/:Nick/userInfo', [isLoggedIn,
    check('Nick', 'Invalid Arguments!').exists().escape().isAlphanumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getPersonalPage(req.params.Nick).then((Page)=>res.json(Page)).catch((err)=>res.status(500).json(err));
});

//get /api/favourites
//get all the Id's of the favourite projects of the user nick
//request body: empty
//response body: array of objects with all the informations regarding user's favourite projects
app.get('/api/favourites', [isLoggedIn], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(401).json(errValidator.errors);
    }
    else
        dao.getFavourites(req.user.Id).then((Favourites)=>res.json(Favourites)).catch((err)=>res.status(500).json(err));
});

//get /api/:nick/profilePic
//get the profile picture of user Nick
//request body: empty
//response body: image object of the profile picture of user Nick.
app.get('/api/:Nick/profilePic', [
    check('Nick', 'Invalid Arguments!').exists().isAlphanumeric().escape(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getUserImage(req.params.Nick).then((Image)=>res.json(Image)).catch((err)=>res.status(500).json(err))
});

//get /api/:nick/hasInteracted
//check if the user has interacted to a certain element of the page. Parameters contains both the Nick and the elementID
//request body: {}
//response body: the type of interaction the user has done. returns -1 if the user hasn't interacted yet 
app.get('/api/hasInteracted', [isLoggedIn,
    check(['Id', 'type', 'id'], 'Invalid Arguments!').escape().exists(),
    check(['id'], 'non-numerical Arguments').isNumeric(),
    check('type', 'Not a valid type!').isString(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.hasInteracted(req.user.Id, req.query.type, req.query.id).then((interaction)=>res.json(interaction)).catch((err)=>res.status(500).json(err));
});

//get /api/downloadProjectFiles/:projectID
//gets the projectID's source files, and sends them to the client
//request body: empty
//response body: zip file containing all source files.
app.get('/api/downloadProjectFiles/:projectID', [isLoggedIn,
    check('projectID', 'projectID should exist and be a number!').exists().isNumeric()
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
    {
        try
        {
            let zip = new JSZip();
            fs.unlink('./temp.zip', ()=>{   //delte old temp file
                dao.getProject(req.params.projectID).then((out)=>{
                    if (out.Files.length==0 || out.Files[0]=="" || out.Files[0]==undefined)  res.status(204).json("Project has no source files!");   //if project doesn't have source files, don't even try
                    else
                    {
                        let i = 0;
                        for (let filePath of out.Files)
                        {
                            if (filePath!="")   //checking if i got a valid path
                            {
                                filePath = filePath.toString().replaceAll('&#x2F;', '/');
                                filePath = filePath.toString().replaceAll('&#x5C;', '/');  //for some reasons, multer changes the '/' and the '\' into those two codes, so they must be translated back.
                                let file = fs.readFileSync('./public/userFiles'+filePath, {encoding: 'base64'});
                                zip.file(out.FilesNames[i].replaceAll('/',','), file, {base64: true});
                            }
                            i+=1;
                        }
                        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                        .pipe(fs.createWriteStream('temp.zip'))
                        .on('finish', function () {
                            res.download("./temp.zip", 'ProjectSourceFiles.zip');     //uploading the zip file to client
                        });
                    }
                })
            })
        }
        catch (err){console.log(err);}
    }
})

//get /api/search
//returns the projectID's or the profileInfo's
//request body: {searchTxt}
//response body: an array of projectID's or profileInfo's
app.get('/api/search', [
    check(['searchType', 'searchTime', 'searchCategory', 'searchTxt'], 'Invalid request!').exists().escape()
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
    {
        let dateString = undefined;
        if (req.query.searchTime != 'allDates')   //depending on the date selected, the server shoudl create an en-GB date string, so that the DAO can select which projects are recent 'enough'
        {
            if (req.query.searchTime=='lastYear')
                dateString = new Date(Date.now()-31540000000).getTime();   //the dates are shown in milliseconds!
            else if (req.query.searchTime=='lastMonth')
                dateString = new Date(Date.now()-2628000000).getTime();
            else if (req.query.searchTime=='lastWeek')
                dateString = new Date(Date.now()-604800000).getTime();
            else if (req.query.searchTime=='lastDay')
                dateString = new Date(Date.now()-86400000).getTime();
            else
            {
                res.status(400).json("Invalid date!")
                return;
            }
        }
        dao.searchDB(req.query.searchType, req.query.searchCategory, req.query.searchTxt, dateString).then((info)=>res.json(info)).catch((err)=>res.status(500).json(err));
    }
});

//get /api/isLogged
//checks if the client sending the request is logged or not
//request body: empty
//response body: true if the client is logged, false otherwise. If true, returns the info about the user as well.
app.get('/api/isLogged', (req, res)=>{
    res.json({isAuth:req.isAuthenticated(), userInfo:req.user});
})

//get /api/getUserProjects/:userID
//returns all the projects of the user identified by userID
//request body: empty
//response body: an array of objects containing all the info about the projects
app.get(`/api/getUserProjects/:userID`, [isLoggedIn,
    check('userID', 'Invalid userID!').exists().escape().isNumeric()
] ,(req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.getUserProjects(req.params.userID).then((info)=>res.json(info)).catch((err)=>res.status(500).json(err));
})

//post /api/register
//add an user to the database.
//request body: nickname, email, password
//response body: empty
app.post('/api/register', [ //checking if the inpust are correct
    check(['Nick', 'Passwd', 'Mail', 'RepeatMail'], 'Request body must have: Nick, Passwd, Mail, RepeatMail!').exists(),
    check('Nick', "Username size cannot be zero, and cannot exceed 36 characters!").notEmpty().isLength({max:36}), //checking that registration info is not empty
    check('Passwd', "Password must be at least 8 characters long!").notEmpty().isLength({min:8, max:128}),
    check('Mail', "Email cannot be empty!").notEmpty(),
    check('Mail', "Invalid Email format!").isLength({max:130}).isEmail(),
    check('RepeatMail', "Email confirmation cannot be empty!").notEmpty(),
    check('RepeatMail', "Email confirmation doesn't match email!").custom((value,{req, loc, path}) => value==req.body.Mail),  //checking if both mail and repeatMail are matching
    check(['Nick', 'Passwd', 'Mail', 'RepeatMail']).escape(),    //to avoid XSS attacks
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors[0].msg);
    }
    else
    {
        dao.register(req.body.Nick, req.body.Passwd, req.body.Mail).then((out)=>{
            dao.addSysUser(out.Nickname, out.Mail).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
    }
});

//post /api/login
//attempt of an user to log-in.
//request body: nickname, password
//response body: return the user, or an error if something went wrong.
app.post('/api/login', [
    check('nickname', 'Invalid argument!').isLength({max:36}).exists().notEmpty(),
    check('password', 'Invalid argument!').isLength({max:128}).exists().notEmpty(),
], function(req, res, next) {
    const notAuth = validationResult(req);
    if (!notAuth.isEmpty())
    {
        res.status(400).json(notAuth.errors);  //an error has occurred (generic client error)
    }
    else
    {
        passport.authenticate('local', function(err, user, info) {
            if (err) {return next(err) }
            if (!user) {
              return res.status(401).json({'errors': [{'param': 'Server', 'msg': `${info.errors===undefined?info.message:info.errors[0].msg}`}],});
            }
            req.logIn(user, (err)=>{
              if (err) return next(err);
              return res.json(user);    //authentication succesfull.
            });
          })(req, res, next);
    }
});

//post /api/updateProfile
//update user's profile Info.
//request body: Name, Surname, Age, Bday, Bio, Image, NumComments, Likes, Rating, Role
//response body: empty
app.post('/api/updateProfile', [isLoggedIn, 
    check(['Name', 'Surname', 'Bio', 'frontBio', 'Status', 'State', 'Country']).exists().escape(),   //checking for XSS scripting attempts
    check(['Name', 'Surname', 'Bday', 'State', 'Country', 'frontBio'], 'Exceeded max field lenght').isLength({max:130}),
    check('Bio', 'Exceeded max field lenght').isLength({max:300}),
    check('Status', 'Exceeded max field lenght').isLength({max:50})
],(req, res)=>{
    const notAuth = validationResult(req);
    if (!notAuth.isEmpty())
    {
        res.status(400).json(notAuth.errors);  //an error has occurred (generic client error)
    }
    else    //we can proceed by updating the profile, everything went according to plans
    {
        dao.updateProfile({Nick:req.user.Nick, Name:req.body.Name, Surname:req.body.Surname, Bday:req.body.Bday, Bio:req.body.Bio, frontBio:req.body.frontBio, Image:req.body.Image,
            Country:req.body.Country, State:req.body.State, Status:req.body.Status, Role:undefined}).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
    }
});

//post /api/:projectID/upvoteProject
//upvote project with projectID
//request body: empty
//response body: empty
app.post('/api/:projectID/upvoteProject', [isLoggedIn,
    check('projectID', 'Invalid Argument!').escape().isNumeric().exists(),
],(req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.upvoteProject(req.params.projectID).then(()=>{
            dao.updateInteraction(1, "project", req.params.projectID, req.user.Id, false).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:projectID/toggleUpvoteProject
//toggle upvote project with projectID
//request body: empty
//response body: empty
app.post('/api/:projectID/toggleUpvoteProject', [isLoggedIn,
    check('projectID', 'Invalid Argument!').escape().isNumeric().exists(),
],(req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.toggleUpvoteProject(req.params.projectID).then(()=>{
            dao.updateInteraction(1, "project", req.params.projectID, req.user.Id, true).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:projectID/downvoteProject
//downvote project with projectID
//request body: empty
//response body: empty
app.post('/api/:projectID/downvoteProject', [isLoggedIn,
    check('projectID').exists().escape().isNumeric(),
],(req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.downvoteProject(req.params.projectID).then(()=>{
            dao.updateInteraction(0, "project", req.params.projectID, req.user.Id, false).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:projectID/toggleDownvoteProject
//toggle downvote project with projectID
//request body: empty
//response body: empty
app.post('/api/:projectID/toggleDownvoteProject', [isLoggedIn,
    check('projectID', 'Invalid Arguments').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.toggleDownvoteProject(req.params.projectID).then(()=>{
            dao.updateInteraction(0, "project", req.params.projectID, req.user.Id, true).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:commentID/upvoteComment
//upvote comment with commentID
//request body: empty
//response body: empty
app.post('/api/:commentID/upvoteComment', [isLoggedIn,
    check('commentID').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.upvoteComment(req.params.commentID).then(()=>{
            dao.updateInteraction(1, "comment", req.params.commentID, req.user.Id, false).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:commentID/toggleUpvoteComment
//toggle upvote comment with commentID
//request body: empty
//response body: empty
app.post('/api/:commentID/toggleUpvoteComment', [isLoggedIn,
    check('commentID').exists().escape().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.toggleUpvoteComment(req.params.commentID).then(()=>{
            dao.updateInteraction(1, "comment", req.params.commentID, req.user.Id, true).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:commentID/downvoteComment
//downvote comment with commentID
//request body: empty
//response body: empty
app.post('/api/:commentID/downvoteComment', [isLoggedIn,
    check('commentID').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.downvoteComment(req.params.commentID).then(()=>{
            dao.updateInteraction(0, "comment", req.params.commentID, req.user.Id, false).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:commentID/toggleDownvoteComment
//toggle downvote comment with commentID
//request body: empty
//response body: empty
app.post('/api/:commentID/toggleDownvoteComment', [isLoggedIn,
    check('commentID').escape().equals().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.toggleDownvoteComment(req.params.commentID).then(()=>{
            dao.updateInteraction(0, "comment", req.params.commentID, req.user.Id, true).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:commentID/usefulComment
//tag a comment with commentID useful
//request body: empty
//response body: empty
app.post('/api/:commentID/usefulComment', [isLoggedIn,
    check('commentID').exists().escape().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.usefulComment(req.params.commentID).then(()=>{
            dao.updateInteraction(1, "useful", req.params.commentID, req.user.Id, false).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

//post /api/:commentID/toggleUsefulComment
//toggle the tag of 'useful' of a comment with identified by 'commentID'
//request body: empty
//response body: empty
app.post('/api/:commentID/toggleUsefulComment', [isLoggedIn,
    check('commentID').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.toggleUsefulComment(req.params.commentID).then(()=>{
            dao.updateInteraction(1, "useful", req.params.commentID, req.user.Id, true).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
        }).catch((err)=>res.status(500).json(err));
});

/*
//post /api/:projectID/setRecent
//set the project identified by 'projectID' to recent
//request body: empty
//response body: empty
app.post('/api/:projectID/setRecent', isLoggedIn, (req, res)=>{
    dao.setRecent(req.params.projectID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
});

//post /api/:projectID/toggleRecent
//toggle the project identified by 'projectID' to notRecent
//request body: empty
//response body: empty
app.post('/api/:projectID/toggleRecent', isLoggedIn, (req, res)=>{
    dao.toggleRecent(req.params.projectID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
});
*/

//post /api/addProject
//add a project to the database.
//request body: Name, Data, Owner, Img, Files, Description, Type.
app.post('/api/addProject', [isLoggedIn,
    check(['Name', 'Description', 'type'], 'Name, Descritpion and Type cannot be empty!').notEmpty(),
    check(['Name', 'Description', 'imageDescription', 'Img', 'Files', 'type'], 'Missing arguments!').exists().escape(),   //sanitize the inputs
    check(['Name'], 'Exceeded maximum length').isLength({max:150}),
    check(['imageDescription'], 'Exceeded maximum length').isLength({max:250}),
    check(['Description'], 'Exceeded maximum length').isLength({max:1200})
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else    //checks were succesfull
    {
        dao.addProject(req.body.Name, req.user.Id, req.body.Img, req.body.Files, req.body.FilesNames, req.body.Description, req.body.type, req.body.imageDescription).then((out)=>res.json(out)).catch((err)=>res.status(500).json(err));
    }
});

//post /api/:projectID/addComment
//create a new comment in a project's page
//request body: projectID, Text.
//response body: empty.
app.post('/api/:projectID/addComment', [isLoggedIn,
    check('Text', 'Invalid comment Text!').escape().isLength({min:1, max:1000}).exists().notEmpty(),    //checking server-side if the comment text is valid
    check('projectID', 'Invalid projectID!').escape().isNumeric().exists()
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator);
    else
        dao.addComment(req.params.projectID, req.user.Id, req.body.Text).then((out)=>res.json(out)).catch((err)=>res.status(500).json(err));
});

//post /api/:projectID/addToFavourite
//add a new project in the favourite projects page
//request body: userID.
//response body: empty.
app.post('/api/:projectID/addToFavourite', [isLoggedIn,
    check('projectID', 'Invalid Argument').exists().isNumeric().escape(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else
        dao.addToFavourite(req.user.Id, req.params.projectID).then((out)=>res.json(out)).catch((err)=>res.status(500).json(err));
});

//post /api/uploadFiles
//add the files uploaded by the client in the userFiles folder.
//request body: an array of formData files, together with the original names of the files uplaoded.
//response body: empty.
app.post('/api/uploadFiles', [isLoggedIn], upload.array('files'), (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator);
    else
    {
        let inputFilesNames = [];   //array containing the originalname of all the files, to be shown to the client.
        let imagesPaths = [];    //create an array of path to images
        let sourceFilesPaths = [];   //create an array of path to source files
        for (let file of req.files) //gain all the paths of the various files depending on their nature -> this also ensures that the user won't be able to upload not-image files to the imageRow
        {
            if (Object.keys(MIME_TYPE_MAP).includes(file.mimetype)) imagesPaths.push(file.path);    //get the path of image files.
            else    {   //file is not an image!
                sourceFilesPaths.push(file.path);   //get the paths of all non-image files.
                inputFilesNames.push(file.originalname.replaceAll(',', '/'));    //get the original name of the file.
            }
        }
        res.json({imagesPaths, sourceFilesPaths, inputFilesNames});
    }
})

/*
//put /api/:projectID/changeProjectType
//change the project type identified by 'projectID'
//request body: new type
//response body: empty
app.put('/api/:projectID/changeProjectType', (req, res)=>{
    dao.changeType(req.body.type, req.params.projectID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
});
*/

//put /api/:projectID/updateProject
//update the project info identified by 'projectID'
//request body: new info of the project
//response body: empty
app.put('/api/:projectID/updateProject', [isLoggedIn,
    check(['Name', 'Description', 'type'], 'Name, Descritpion and Type cannot be empty!').notEmpty(),
    check(['Name', 'Description', 'imageDescription', 'Img', 'Files', 'type'], 'Missing arguments!').exists().escape(),   //sanitize the inputs
    check(['Name'], 'Exceeded maximum length').isLength({max:150}),
    check(['imageDescription'], 'Exceeded maximum length').isLength({max:250}),
    check(['Description'], 'Exceeded maximum length').isLength({max:1200})
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else
    {
        dao.updateProject({Name:req.body.Name, Img:req.body.Img, Files:req.body.Files, FilesNames:req.body.FilesNames, Description:req.body.Description, imageDescription:req.body.imageDescription, type:req.body.type}, req.params.projectID, req.user).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
    }
});

//put /api/:commentID/updateComment
//update the comment info identified by 'commentID'
//request body: new info of the comment
//response body: empty
app.put('/api/:commentID/updateComment', [isLoggedIn,
    check('commentID', "Faulty or not existing commentID!").exists().escape(),
    check('Text', "Text must be specified!").exists().escape(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else
    {
        dao.getCommentInfo(req.params.commentID).then((info)=>{ //checking if user has permissions to update Comment
            if (info.Owner == req.user.Id)
                dao.updateComment(req.body.Text, req.params.commentID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
            else if (req.user.Role!='user')
                dao.updateComment(req.body.Text, req.params.commentID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
            else
                res.status(403).json("You don't have the permissions to update such comment!");
        })
    }
});

//delete /api/:projectID/toggleFromFavourite
//add a new project in the favourite projects page
//request body: Nick.
//response body: empty.
app.delete('/api/:projectID/toggleFromFavourite', [isLoggedIn,
    check('projectID', 'Invalid Arguments').escape().exists().isNumeric(),
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else
        dao.toggleFromFavourite(req.params.projectID).then((out)=>res.json(out)).catch((err)=>res.status(500).json(err));
});

//delete /api/:projectID/deleteProject
//remove project identified by 'projectID'
//request body: empty
//response body: empty
app.delete('/api/:projectID/deleteProject', [isLoggedIn, 
    check('projectID', "Faulty or not existing projectID!").exists().escape()
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else
    {
        dao.getProject(req.params.projectID).then((info)=>{
            if (info.Owner == req.user.Id)
            {
                dao.deleteProject(req.params.projectID).then(()=>{  //user is the owner of the project: he has permission to delete the project
                    dao.removeFromFileSystem(info.Img.concat(info.Files)).then((out)=>res.json(out)).catch((err)=>res.status(500).json(err));
                }).catch((err)=>res.status(500).json(err));
            }
            else if (req.user.Role!='user') //user is a moderator or an admin, he has permissions to delete the project
            {
                dao.deleteProject(req.params.projectID).then(()=>{
                    dao.removeFromFileSystem(info.Img.concat(info.Files)).then((out)=>res.json(out)).catch((err)=>res.status(500).json(err));
                }).catch((err)=>res.status(500).json(err));
            }
            else    //user doesn't have permission to delete this project.
                res.status(403).json("You don't have the permissions to delete such project!");
        }).catch((err)=>res.status(500).json(err));
    }
});

//delete /api/:commentID/deleteComment
//remove comment identified by 'commentID'
//request body: empty
//response body: empty
app.delete('/api/:commentID/deleteComment', [isLoggedIn,
    check('commentID', "Faulty or not existing commentID!").exists().escape()], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else
    {
        dao.getCommentInfo(req.params.commentID).then((info)=>{ //checking if user has permissions to delete Comment
            if (info.Owner == req.user.Id)
                dao.deleteComment(req.params.commentID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
            else if (req.user.Role!='user')
                dao.deleteComment(req.params.commentID).then(()=>res.json({})).catch((err)=>res.status(500).json(err));
            else
                res.status(403).json("You don't have the permissions to delete such comment!");
        })
    }
});

//delete /api/deleteUserImage/:Nick
//remove imageFile of user identified by 'Nick'
//request body: empty
//response body: empty
app.delete('/api/deleteUserImage/:Nick', [isLoggedIn, 
    check('Nick', "Faulty or not existing projectID!").exists().escape()
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
        res.status(400).json(errValidator.errors);
    else
    {
        if (req.user.Role != 'user')
        {
            dao.getPersonalPage(req.params.Nick).then((info)=>{
                if (info.Image!="../../assets/icon-user.png")   dao.removeFromFileSystem([info.Image]).then((msg)=>res.json(msg)).catch((err)=>res.status(500).json(err));
                else    res.json("User image succesfully deleted!");
            }).catch((err)=>res.status(500).json(err));
        }
        else
        {
            if (req.user.Nick == req.params.Nick)
            {
                dao.getPersonalPage(req.params.Nick).then((info)=>{
                    if (info.Image!="../../assets/icon-user.png")   dao.removeFromFileSystem([info.Image]).then((msg)=>res.json(msg)).catch((err)=>res.status(500).json(err));
                    else    res.json("User image succesfully deleted!");
                }).catch((err)=>res.status(500).json(err));
            }
            else
            {
                res.status(403).json("User has not the permissions necessary to delete such image!");
            }
        }
    }
});

//delete /api/deleteUserFiles
//delete user files from the server's file system
//request body: {filename}
//response body: a msg signaling the completition of the operation
app.delete('/api/deleteUserFiles', [isLoggedIn,
    check(['content', 'fileName'], 'Body must have a fileName, content and fileIndexes fields!').exists().escape().notEmpty(),
    check('fileType', 'Invalid fileType parameter!').exists().isString().notEmpty().escape(),
    check('fileName', 'Invalid fileName!').isString(),
    check('fileIndexes', 'Invalid array of file indexes').isNumeric()
], (req, res)=>{
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else if(req.body.fileIndexes.length!=0)
    {
        if (req.query.fileType == "projectImage")   //user wants to delete an userImage
        {
            dao.getProject(req.body.content).then((out)=>{
                //out has all the info about the project

                let imagesRemoved = [];
                let ImgDescriptionsRemoved = [];
                
                for (let index of req.body.fileIndexes)     //gather all the images and ImgDescriptions to be removed
                {
                    imagesRemoved.push(out.Img[index]);
                    ImgDescriptionsRemoved.push(out.ImgDescription[index]);
                }

                var survivingImages = out.Img.filter(function(image){   //filter the elements that must not be deleted
                    return imagesRemoved.indexOf(image) === -1;
                });

                var survivingImagesDescriptions = out.ImgDescription.filter(function(description){  //filter the elements that must not be deleted
                    return ImgDescriptionsRemoved.indexOf(description) === -1;
                });

                dao.updateProject({Img:survivingImages.toString(), imageDescription:survivingImagesDescriptions.toString()}, req.body.content, req.user, '', false).then(()=>{
                    //removing data from filesystem as well!
                    dao.removeFromFileSystem(imagesRemoved).then(()=>res.json({msg:'User File deleted correctly from the database!'})).catch((err)=>res.status(500).json(err));
                }).catch((err)=>{    //error handling
                    if (err == "You don't have the permissions to modify such project!")    res.status(403).json(err);
                    else    res.status(500).json(err);
                });
            }).catch((err)=>res.status(500).json(err));
        }
        else if (req.query.fileType == "projectFile")   //user wants to delete a file
        {
            dao.getProject(req.body.content).then((out)=>{
                //out has all the info about the project

                //remove a file from the array
                let filesRemoved = [];
                let FilesNamesRemoved = [];
                for (let index of req.body.fileIndexes)     //gather all the images and ImgDescriptions to be removed
                {
                    filesRemoved.push(out.Files[index]);
                    FilesNamesRemoved.push(out.FilesNames[index]);
                }

                var survivingFiles = out.Files.filter(function(file){   //filter the elements that must not be deleted
                    return filesRemoved.indexOf(file) === -1;
                });

                var survivingFilesNames = out.FilesNames.filter(function(FileName){     //filter the elements that must not be deleted
                    return FilesNamesRemoved.indexOf(FileName) === -1;
                });

                dao.updateProject({Files:survivingFiles.toString(), FilesNames:survivingFilesNames.toString()}, req.body.content, req.user, '', false).then(()=>{
                    //removing data from filesystem as well!
                    dao.removeFromFileSystem(filesRemoved).then(()=>res.json({msg:'User File deleted correctly from the database!'})).catch((err)=>res.status(500).json(err));
                }).catch((err)=>{    //error handling
                    if (err == "You don't have the permissions to modify such project!")    res.status(403).json(err);
                    else    res.status(500).json(err);
                });
            }).catch((err)=>res.status(500).json(err));
        }
    }
})

//delete /api/logout
//destroy the session of the user (log out)
//request body: empty
//response body: a msg signaling the completition of the operation
app.delete('/api/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) res.status(500).json(err);
      else res.json("User logged out succesfully!");
    });
});

//delete /api/deleteUser/:Nick
//deletes an user, identified by the Nick
//request body: empty
//response body: a msg signaling the completition of the operation
app.delete('/api/deleteUser/:Id', [isLoggedIn,
    check('Id', "Invalid user's Id!").exists().escape().isNumeric(),
    check('Id', "Not enough permissions to execute such command!").custom((value,{req, loc, path}) => (value==req.user.Id || req.user.Role=='admin'))
], function(req, res, next){
    const errValidator = validationResult(req);
    if (!errValidator.isEmpty())
    {
        res.status(400).json(errValidator.errors);
    }
    else    //no errors detected. Deleting user...
    {
        //destroying user's interactions
        dao.removeAllInteractions(req.params.Id).then(()=>{

            //destroy all user's projects
            dao.getUserProjects(req.params.Id).then((projects)=>{   //fetch the projects
                let deleteFiles = [];
                for (let project of projects){  //one by one, removes them an all their files.

                    //get all the images and files of a project
                    for (let imageFile of project.Img)
                    {
                        deleteFiles.push(imageFile);
                    }
                    for (let projectFile of project.Files)
                    {
                        deleteFiles.push(projectFile);
                    }
                    dao.deleteProject(project.ID);
                }
                dao.removeFromFileSystem(deleteFiles).then(()=>{

                    dao.getNick(req.params.Id).then((info)=>{
                        //removes user from profiles, and deletes his profile-picture (if he has any)
                        if (info.Image!="../../assets/icon-user.png")    //delete the user's image only if it's not the default one
                        {
                            dao.removeFromFileSystem([info.Image]).then(()=>{
                                //removes the user from the profiles table
                                dao.removeUserFromProfilesTable(req.params.Id).catch((err)=>res.status(500).json(err))
                            }).catch((err)=>res.status(500).json(err));
                        }
    
                        //removes the user from the profiles table
                        dao.removeUserFromProfilesTable(req.params.Id).catch((err)=>res.status(500).json(err));
                        dao.removeFromFileSystem(info.Nick, 2);  //destroy's the user's folder.
                        res.json({msg:'User succesfully deleted from the database!'});
    
                    }).catch((err)=>res.status(500).json(err))
                }).catch((err)=>res.status(500).json(err));
            }).catch((err)=>res.status(500).json(err))
        }).catch((err)=>res.status(500).json(err))
    }
});

// All the other requests will be served by our client-side app 
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public/index.html'));
  });
  

// activate the server
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
setInterval(checkRecent, 86400000);     //once a day, pool all the 'recently added projects' and remove all the projects older than 1 week from the category