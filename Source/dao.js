'use strict';
const { relativeTimeRounding } = require('moment');
const fs = require('fs');   //used for the manipulation of folders
const bcrypt = require('bcrypt');  //used for password hashing
const CryptoJS = require('crypto-js');    //used for email ciphering.
const saltRounds = 10;
const basePath = './users';
const passPhrase = 'sunbeams948flurried535Dictums079Doldrum';
// DAO (Data Access Object) module for accessing course and exams

const sqlite = require('sqlite3');
//const { reject, use } = require('bcrypt/promises');
const { resolve } = require('path');
const { rejects } = require('assert');
let userDB;
const sysDB = new sqlite.Database('./sys.db', (err) => {
  if (err) throw err;
});

//private functions

/**
 * remove all the elements of obj which are undefined or empty
 * @param {*} obj the object to 'filter'
 * @returns 
 */
function nonNullValues(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => (value !== undefined && value !== "") && key!='Nick')
    )
}

/**
 * like the above one, but removes ONLY the elements of obj which are undefined.
 * @param {*} obj the object to 'filter'
 * @returns 
 */
function nonUndefinedValues(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => (value !== undefined) && key!='Nick')
    )
}

/**
 * function needed to list all directories inside a source directory.
 * @param {*} source the source directory where to look after.
 * @returns an array of directory names.
 */
const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

//public functions

/**
 * function needed to retrieve the latest comment of a project from the database.
 * @param {*} ProjectID the ID of the project whose latest comment is to be retrieved.
 * @returns returns the latest comment of the project identified by ProjectID
 */
exports.getLatestComment = function(ProjectID)
{
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT Text FROM comments WHERE ProjectID=? ORDER BY Date DESC Limit 1';
    sysDB.get(sql, ProjectID, (err, row)=>{
        if (err)
        {
            reject(err);
            return;
        }

        if (row===undefined)
        {
            resolve("No comments yet on this project!")
        }
        else
        {
            resolve(row.Text);
        }
    });
    })
}

/**
 * function needed to retrieve the number of comments a project has from the database.
 * @param {*} projectID ID of the project whose comments number is to be retrieved.
 * @returns the number of comments the project identified by ProjectID has.
 */
exports.getCommentsNum = function(projectID){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT count FROM comments_num WHERE ProjectID=?';
        sysDB.get(sql, projectID, (err, row)=>{
        if (err)
        {
            reject(err);
            return;
        }

        if (row===undefined)
        {
            resolve(0);
        }
        else
        {
            resolve(row.count);
        }
        });
    })
}

/**
 * Function needed to retieve all the recent projects from the database.
 * @returns all the recent projects of the website
 */
exports.getRecent = function(){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM recent_projects';
        sysDB.all(sql, (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }

            const out = rows.map((e)=>({
                ID: e.Id,
                Title: e.Name,
                Owner: e.Owner,
                Likes: e.Likes,
                Dislikes: e.Dislikes,
                latestComment: '',
                Date: e.Date
            }));
            resolve(out);
        })
    })
}

/**
 * Function needed to retrieve all the trending projects from the database.
 * @returns all the trending projects of the website
 */
exports.getTrending = function(){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM trending_projects';
        sysDB.all(sql, (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }

            const out = rows.map((e)=>({
                ID: e.Id,
                Title: e.Name,
                Owner: e.Owner,
                Likes: e.Likes,
                Dislikes: e.Dislikes,
                latestComment:'',
            }));
            resolve(out);
        })
    })
}

/**
 * Function needed to retieve all the digital electronics projects from the database.
 * @returns all the digital electronics projects of the website
 */
exports.getDigital = function(){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM digital_projects';
        sysDB.all(sql, (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }

            const out = rows.map((e)=>({
                ID: e.Id,
                Title: e.Name,
                Owner: e.Owner,
                Likes: e.Likes,
                Dislikes: e.Dislikes,
                latestComment: '',
            }));
            resolve(out);
        })
    })
}

/**
 * Function needed to retieve all the analog electronics projects from the database.
 * @returns all the analog electronics projects of the website
 */
exports.getAnalog = function(){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM analog_projects';
        sysDB.all(sql, (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }

            const out = rows.map((e)=>({
                ID: e.Id,
                Title: e.Name,
                Owner: e.Owner,
                Likes: e.Likes,
                Dislikes: e.Dislikes,
                latestComment: '',
            }));
            resolve(out);
        })
    })
}

/**
 * Function needed to retieve all the coding projects from the database.
 * @returns all the coding projects of the website
 */
exports.getCoding = function(){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM coding_projects';
        sysDB.all(sql, (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }

            const out = rows.map((e)=>({
                ID: e.Id,
                Title: e.Name,
                Owner: e.Owner,
                Likes: e.Likes,
                Dislikes: e.Dislikes,
                latestComment: '',
            }));
            resolve(out);
        })
    })
}

/**
 * Function needed to retieve a specific project from the database.
 * @param {*} Id the id of the project to be retrieved from the database.
 * @returns all the info about the project identified by Id.
 */
exports.getProject = function(Id){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * from projects WHERE Id=?;';
        sysDB.get(sql, Id, (err, row)=>{
            if (err)
            {
                reject(err);
                return;
            }
            if (row === undefined)
            {
                reject('Cannot find specified row in database!');
                return;
            }
            let out = {
                Id: row.Id,
                Name: row.Name,
                Date: row.Date,
                Owner: row.Owner,
                Img: row.Img.split(","),        //this is an array of string. Each string has a path to an image in the server repo.
                ImgDescription: row.ImgDescription.split(","),
                Files: row.Files.split(","),    //an array of strings with the files 
                FilesNames: row.FilesNames.split(','),
                Description: row.Description,
                Likes: row.Likes,
                Dislikes: row.Dislikes,
                Type: row.Type,
                Recent: row.Recent
            }

            resolve(out);
        })
    })
}

/**
 * retrieve the comments of a project from the database.
 * @param {*} Id the Id of the project whose comments must be retrieved.
 * @param {*} min index of the minimum comment to be retrieved.
 * @param {*} num number of comments (starting from min) to be retrieved.
 * @returns the comments between min and min+num of the project identified by Id.
 */
exports.getComments = function(Id, min, num){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * from comments WHERE ProjectID=? ORDER BY Date DESC LIMIT ?,?;';
        sysDB.all(sql, [Id, min, num], (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }
            if (rows===undefined)
            {
                reject(err);
                return;
            }
            const out = rows.map((row)=>({
                Id: row.Id,
                Owner: row.Owner,
                Text: row.Text,
                Likes: row.Likes,
                Dislikes: row.Dislikes,
                Useful: row.Useful,
                ProjectID: row.ProjectID,
                Date: row.Date,
            }));

            resolve(out);
        })
    })
}

/**
 * retrieve all the info regarding a specific comment from the database.
 * @param {*} commentID the ID of the comment whose informations must be retrieved.
 * @returns all the info about the comment identified by commentID
 */
exports.getCommentInfo = function(commentID){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * from comments WHERE Id=?';
        sysDB.get(sql, commentID, (err, row)=>{
            if (err)
            {
                reject(err);
                return;
            }
            if (row===undefined)
            {
                reject(err);
                return;
            }
            const out = {
                Owner: row.Owner,
                Text: row.Text
            }

            resolve(out);
        })
    })
}

/**
 * retrieve all the info about a personal page of an user from the database.
 * @param {*} Nick the Nick of the user whose personal page's info must be retrieved.
 * @returns return all the info about the personal page of the user identified by 'Nick'.
 */
exports.getPersonalPage = function(Nick){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * from profiles WHERE Nick=?;';
        sysDB.get(sql, Nick, (err, row)=>{
            if (err)
            {
                reject(err);
                return;
            }
            if (row===undefined)
            {
                reject(err);
                return;
            }
            const out = {
                Nick: row.Nick,
                Id: row.Id,
                Name: row.Name,
                Surname: row.Surname,
                Country: row.Country,
                Status: row.Status,
                State: row.State,
                frontBio: row.frontBio,
                Age: row.Age,
                Birthday: row.Birthday,
                Bio: row.Bio,
                Image: row.Image,
                NumComments: row.NumComments,
                Likes: row.Likes,
                Dislikes: row.Dislikes,
                Rating: row.Rating,
                Role: row.Role,
                projectsNum: row.projectsNum
            };

            resolve(out);
        })
    })
}

/**
 * retrieve all the favourite projects of an user from the database.
 * @param {*} userID the ID of the user whose favourite projects must be retrieved.
 * @returns returns the favourite projects (and all their info) of the user identified by 'userID'.
 */
exports.getFavourites = function(userID){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM favourites WHERE Owner=?;';
        sysDB.all(sql, [userID], (err, rows)=>{
            if (err)
            {
                reject(err);
                return;
            }
            const out = rows.map((row)=>({
                Id:row.ProjectID,
            }));

            resolve(out);
        })
    })
}

/**
 * retieve the Nickname of an user from the databse, given its Id.
 * @param {*} Id the Id of the user whose Nickname must be retrieved.
 * @returns the Nickname of the user identified by Id.
 */
exports.getNick = function(Id){
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * from profiles WHERE Id=?;';
        sysDB.get(sql, Id, (err, row)=>{
            if (err)
            {
                reject(err);
                return;
            }
            if (row===undefined)
            {
                reject(undefined);
                return;
            }

            const out = {
                Nick: row.Nick,
                Image: row.Image
            }
            resolve(out);
        })
    })
}

/**
 * retrieve nickname and mail of an user, if client's nickname and password equals the ones of the locally saved user.
 * @param {*} Nick the Nickname of the user whose mail you want to retrieve.
 * @param {*} Password the password of the user whose mail you want to retrieve.
 * @returns the mail and nickname of the user corresponding to the given Nick and Password.
 */
exports.getUserInfo = function(Nick, Password){
    return new Promise((resolve, reject)=>{
        fs.access(basePath+`/${Nick}`, fs.constants.F_OK, (err) => {
            if (err) { //checking if the folder of the nickname exists
              reject("Incorrect username or password.");
              return;
            }
            userDB = new sqlite.Database(`./users/${Nick}/userDB.db`, (err) => {
                if (err) reject(err);
            });
            const sql = 'SELECT * from ProfileInfo WHERE Nick=?;';
            userDB.get(sql, Nick, (err, row)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                else if (row === undefined)
                        resolve(['Incorrect username or password.']);

                try{
                    bcrypt.compare(Password, row.Password, function(err, result) {
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        else{
                            const out = {
                                Nickname:row.Nick,
                                Email:row.Email
                            };
    
                            if (result)
                            {
                                resolve([out, result]);
                            }
                            else
                            {
                                resolve([out, result]);
                            }
                        }
                    });
                }
                catch (err){
                    //throw new Error(err);
                    reject("Incorrect username or password.");
                    return;
                }
            })
        })
    })
}

/**
 * function needed to register a new user to the database.
 * @param {*} Nick the Nick of the new user that is SigninUp
 * @param {*} Passwd the Password of the new user that is SigninUp
 * @param {*} Mail the Mail of the new user that is SigninUp
 * @returns the nickname and encrypted Mail if everything went according to plans, an error otherwise.
 */
exports.register = function(Nick, Passwd, Mail){
    return new Promise((resolve, reject)=>{
        fs.access(basePath+`/${Nick}`, fs.constants.F_OK, (err) => {
            if (!err) { //checking if the folder of the nickname already exists
              reject("Username already in use!");
              return;
            }
            bcrypt.hash(Passwd, saltRounds, function(errPasswd, hashPasswd) {
                if (errPasswd)
                {
                    //an error has occurred
                    reject(errPasswd);
                    return;
                }

                //let's encrypt the email
                const encryptedMail = CryptoJS.AES.encrypt(Mail, passPhrase).toString();
                // Store all the hash's in the DB.
                //create the folder for the new user
                fs.mkdirSync(basePath+`/${Nick}`, '0700', (err)=>{
                    if (err)
                    {
                        console.log(`An error has occurred while creating directory for user ${Nick}!`);
                        reject(err);
                    }
                });
                console.log(`Directory created successfully for user ${Nick}!`);
                //create the database for the new user
                let fd = fs.openSync(basePath+`/${Nick}/userDB.db`, "w", 0o666);
                console.log(`Database file created successfully for user ${Nick}!`);
                fs.closeSync(fd);
                userDB = new sqlite.Database(`./users/${Nick}/userDB.db`, (err) => {
                    if (err) reject(err);
                    });
                //create all tables
                let sql = 'CREATE TABLE "ProfileInfo" ("Nick"	TEXT NOT NULL,"Password"	TEXT NOT NULL CHECK(length("Password") >= 8),"Email"	TEXT NOT NULL UNIQUE,PRIMARY KEY("Nick"));';
                userDB.run(sql,[],(err)=>{
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    sql = 'CREATE TABLE "Favourites" ("ProjectID"	INTEGER NOT NULL CHECK("ProjectID" >= 0),PRIMARY KEY("ProjectID"));';
                    userDB.run(sql,[],(err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                    })
                    sql = 'CREATE TABLE "Interactions" ("Interaction"	INTEGER,"Object"	TEXT,"Id"	INTEGER,PRIMARY KEY("Object","Id"));';
                    userDB.run(sql, [], (err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                    })
                    //insert data
                    sql = 'INSERT INTO ProfileInfo("Nick", "Password", "Email") VALUES (?, ?, ?);';
                    userDB.run(sql, [Nick, hashPasswd, encryptedMail], (err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        resolve({Nickname:Nick, Mail:encryptedMail});
                    });
                });
            });
        });
    })
}

/**
 * function adding a project to the database.
 * @param {*} Name Name of the project to be added to the database.
 * @param {*} Owner the Owner of the project to be added to the database.
 * @param {*} Img The Img Paths of the project to be added to the database.
 * @param {*} Files The Source Files of the project to be added to the database.
 * @param {*} FilesNames the Original FileNames of the project to be added to the database.
 * @param {*} Description the Description of the project to be added to the database.
 * @param {*} Type the type of the project to be added to the database.
 * @param {*} imageDescription the Image Descriptions of the project to be added to the database.
 * @returns an empty object if the function was succesful, an error otherwise.
 */
exports.addProject = function(Name, Owner, Img, Files, FilesNames, Description, Type, imageDescription){
    return new Promise((resolve, reject)=>{

        let sql = 'INSERT INTO projects(Name, Date, Owner, Img, Files, FilesNames, Description, Type, Recent, ImgDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        sysDB.run(sql, [Name, new Date().getTime(), Owner, Img, Files, FilesNames, Description, Type, 1, imageDescription], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            sql = "UPDATE profiles SET projectsNum = projectsNum + 1 WHERE id = ?"; //update the number of projects an user has uploaded
            sysDB.run(sql, [Owner], (err)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                resolve({});
            });
        });
    })
}

/**
 * function needed to create the personal page entry on the SysDB database, after the user has been logged an both his folder and database have been created already.
 * @param {*} Nick the Nick of the user whose personal page is to be created
 * @param {*} hashedMail the hashedMail of the user whose personal page is to be created.
 * @returns an empty object if the function was succesful, an error otherwise.
 */
exports.addSysUser = function(Nick, hashedMail){
    return new Promise((resolve, reject)=>{
        const sql = 'INSERT INTO profiles(Nick, Email) VALUES (?, ?);';
        sysDB.run(sql, [Nick, hashedMail], (err)=>{
        if (err)
        {
            reject(err);
            return;
        }
        resolve({});
    });
    });
}

/**
 * function needed to update a personal page of an user in the database.
 * @param {*} obj the onject containing all the information about the update.
 * @returns an empty object if the function was succesful, an error otherwise.
 */
exports.updateProfile = function(obj){    //Name, Surname, Bday, Bio, frontBio, Image, Country, State, Status, Role
    return new Promise((resolve, reject)=>{
        let notNull = Object.values(nonNullValues(obj)); //create an array with only not null values of the original obj
        notNull.push(obj.Nick); //push nick at the end of the array
        const sql = `UPDATE profiles SET ${obj.Name===undefined?'':'Name=?,'}${obj.Surname===undefined?'':'Surname=?,'}${obj.Bday===undefined?'':'Birthday=?,'}${obj.Bio===undefined?'':'Bio=?,'}${obj.frontBio===undefined?'':'frontBio=?,'}${obj.Image===undefined?'':'Image=?,'}${obj.Country===undefined?'':'Country=?,'}${obj.State===undefined?'':'State=?,'}${obj.Status===undefined?'':'Status=?,'}${obj.Role===undefined?'':'Role=?,'}`.slice(0,-1).concat(" WHERE Nick=?;");
        sysDB.run(sql, notNull, (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to add a comment to a project, while inserting it in the database as well.
 * @param {*} projectID the ID of the Project the user wished to comment.
 * @param {*} Owner the Owner of the comment to be added under the project identified by ProjectID.
 * @param {*} Text the Text of the comment.
 * @returns an empty object if the function was succesful, an error otherwise.
 */
exports.addComment = function(projectID, Owner, Text){
    return new Promise((resolve, reject)=>{
        let sql = `INSERT INTO "main"."comments"("Owner", "Text", "ProjectID", "Date") VALUES (?,?,?,?);`;
        sysDB.run(sql, [Owner, Text, projectID, new Date(Date.now()).getTime()], (err)=>{    //add a new comment, with the date of the creation of such comment.
            if (err)
            {
                reject(err);
                return;
            }
            sql = "UPDATE profiles SET NumComments = NumComments + 1 WHERE id = ?";     
            sysDB.run(sql, [Owner], (err)=>{    //update the comment number in the 'profiles' table
                if (err)
                {
                    reject(err);
                    return;
                }
                resolve({});
            });
        })
    });
}

/**
 * function needed to check if an user has interacted with a specific element of the page.
 * @param {*} userID the ID of the user whose interaction is to be checked in the database.
 * @param {*} Object the Object the 'userID' should have interacted with.
 * @param {*} Id the Id of the Object the 'userID' should have interacted with.
 * @returns 
 */
exports.hasInteracted = function(userID, Object, Id){
    return new Promise((resolve, reject)=>{

        if(Object==="comment" || Object==="project" | Object==="useful")
        {
            const sql = `SELECT interaction from Interactions WHERE (Owner=? and Object=? and Id=?);`;
            sysDB.get(sql, [userID, Object, Id], (err, row)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                if (row===undefined || row===null) 
                {
                    resolve({Interaction:-1});
                    return;
                }
                resolve({Interaction: row.Interaction});
            });
        }
        else if(Object==="favourite")
        {
            const sql = `SELECT * from favourites WHERE (Owner=? and ProjectID=?);`;
            sysDB.get(sql, [userID, Id], (err, row)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                if (row===undefined || row===null) 
                {
                    resolve({Interaction:-1});
                    return;
                }
                resolve({Interaction: 1});
            });
        }
    });
}

/**
 * function needed to notify the database about the will of the client to upvote a project.
 * @param {*} projectID the project's ID whose interactions should be updated.
 * @returns an empty object if the function was succesful, an error otherwise.
 */
exports.upvoteProject = function(projectID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE projects SET Likes=Likes+1 WHERE Id=?`;
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from projects WHERE Id=?";
            sysDB.get(sql, [projectID], (err, row)=>{    //get the owner ID of the project
                 if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Likes = Likes + 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            })
        })
    });
}

/**
 * function needed to notify the database about the will of the client to toggle the upvote of a project.
 * @param {*} projectID the project's ID whose interactions should be updated.
 * @returns an empty object if the function was succesful, an error otherwise.
 */
exports.toggleUpvoteProject = function(projectID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE projects SET Likes=likes-1 WHERE Id=?`;
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from projects WHERE Id=?";
            sysDB.get(sql, [projectID], (err, row)=>{    //get the owner ID of the project
                 if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Likes = Likes - 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            })
        })
    });
}

/**
 * function needed to ask the database to retrieve an user's image.
 * @param {*} Nick Nick of the owner whose image is to be retrieved
 * @returns an image path if the function was succesfull, an error otherwise
 */
exports.getUserImage = function(Nick){
    return new Promise((resolve, reject)=>{
        const sql = `SELECT Image FROM profiles WHERE Nick=?`;
        sysDB.get(sql, [Nick], (err, row)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({
                Image: row.Image
            });
        })
    });
}

/**
 * function needed to update the database interactions table. This table has all the info about the user's interaction with the various website elements.
 * @param {*} Interaction set it to 1 for a positive interaction, 0 for a negative one (i.e: upvote/downvote respectfully).
 * @param {*} Object the Object whose interaction should be saved on the database.
 * @param {*} Id the Id of the object whose the client ahs interacted with.
 * @param {*} userID the identifier of the client.
 * @param {*} deleteBool set it to true to remove an interaction from the database. set it to false to add an interaction otherwise.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.updateInteraction = function(Interaction, Object, Id, userID, deleteBool){
    return new Promise((resolve, reject)=>{

        if (deleteBool)
        {
            const sql = `DELETE FROM Interactions WHERE Interaction=? AND Object=? AND Id=? AND Owner=?;`;
            sysDB.run(sql, [Interaction, Object, Id, userID], (err)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                resolve({});
            });
        }
        else
        {
            const sql = `INSERT INTO Interactions ("Interaction", "Object", "Id", "Owner") VALUES (?, ?, ?, ?);`;
            sysDB.run(sql, [Interaction, Object, Id, userID], (err)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                resolve({});
            });
        }
    });
}

/**
 * function needed to ask the database to downvote a project.
 * @param {*} projectID the project who shall be downvoted.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.downvoteProject = function(projectID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE projects SET Dislikes=Dislikes+1 WHERE Id=?`;
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from projects WHERE Id=?";
            sysDB.get(sql, [projectID], (err, row)=>{    //get the owner ID of the project
                if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Dislikes = Dislikes + 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            });
        })
    });
}

/**
 * function needed to ask the database to toggle a downvote of a project (or, in other words, reduce the dislikes by 1).
 * @param {*} projectID the ID of the project whose downvote shall be toggled.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.toggleDownvoteProject = function(projectID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE projects SET Dislikes=Dislikes-1 WHERE Id=?`;
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from projects WHERE Id=?";
            sysDB.get(sql, [projectID], (err, row)=>{    //get the owner ID of the project
                if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Dislikes = Dislikes - 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            });
        })
    });
}

/**
 * function needed to ask the database to upvote a comment.
 * @param {*} commentID the comment that must be upvoted.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.upvoteComment = function(commentID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE comments SET Likes=Likes+1 WHERE Id=?`;
        sysDB.run(sql, [commentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from comments WHERE Id=?";
            sysDB.get(sql, [commentID], (err, row)=>{    //get the owner ID of the project
                 if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Likes = Likes + 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            })
        })
    });
}

/**
 * function needed to ask the database to toggle the upvote of a comment (or, in other words, reduce the upvotes of a comment by 1).
 * @param {*} commentID the comment whose upvote must be toggled.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.toggleUpvoteComment = function(commentID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE comments SET Likes=Likes-1 WHERE Id=?`;
        sysDB.run(sql, [commentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from comments WHERE Id=?";
            sysDB.get(sql, [commentID], (err, row)=>{    //get the owner ID of the project
                 if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Likes = Likes - 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            })
        })
    });
}

/**
 * function needed to ask the database to downvote a comment.
 * @param {*} commentID the comment that must be downvote.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.downvoteComment = function(commentID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE comments SET Dislikes=Dislikes+1 WHERE Id=?`;
        sysDB.run(sql, [commentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from comments WHERE Id=?";
            sysDB.get(sql, [commentID], (err, row)=>{    //get the owner ID of the project
                if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Dislikes = Dislikes + 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            });
        })
    });
}

/**
 * function needed to ask the database to toggle the downvote of a comment (or, in other words, reduce the downvotes of a comment by 1).
 * @param {*} commentID the comment whose downvote must be toggled.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.toggleDownvoteComment = function(commentID){
    return new Promise((resolve, reject)=>{
        let sql = `UPDATE comments SET Dislikes=Dislikes-1 WHERE Id=?`;
        sysDB.run(sql, [commentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            /*update the owner likes.*/
            sql = "SELECT Owner from comments WHERE Id=?";
            sysDB.get(sql, [commentID], (err, row)=>{    //get the owner ID of the project
                if (err)
                {
                    reject(err);
                    return;
                }
                sql = "UPDATE profiles SET Dislikes = Dislikes - 1 WHERE id = ?";     
                sysDB.run(sql, [row.Owner], (err)=>{    //update the likes in the 'profiles' table
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({});
                });
            });
        })
    });
}

/**
 * function needed to ask the database to mark a comment as useful by an user.
 * @param {*} commentID the comment that must be marked as useful.
 * @returns nothing if everything went smootly, an error otherwise.
 */
exports.usefulComment = function(commentID){
    return new Promise((resolve, reject)=>{
        const sql = `UPDATE comments SET Useful=Useful+1 WHERE Id=?`;
        sysDB.run(sql, [commentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to ask the database to toggle the mark of a comment as useful.
 * @param {*} commentID the comment that must be not anymore marked as useful by one user.
 * @returns nothing if everything went smootly, an error otherwise.
 */
exports.toggleUsefulComment = function(commentID){
    return new Promise((resolve, reject)=>{
        const sql = `UPDATE comments SET Useful=Useful-1 WHERE Id=?`;
        sysDB.run(sql, [commentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function asking the database to remove every information about a project. The function will also irreversibly destroy every project
 * data such as images and files, as they will be completely destroyed from the file system.
 * @param {*} projectID the ID of the project that must be destroyed.
 * @returns nothing if everything went smoothly, an error otherwise.
 */
exports.deleteProject = function(projectID){
    return new Promise((resolve, reject)=>{
        let sql = `DELETE FROM projects WHERE Id=?;`;   //delete projects
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            sql = 'SELECT Id FROM comments WHERE ProjectID=?;'  //get all the comments to delete
            sysDB.all(sql, projectID, (err, rows)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                if (rows==undefined || rows==null)
                {
                    reject("Couldn't get comment's ID!")
                    return;
                }
                for (let row of rows)
                {
                    sql = 'DELETE FROM interactions WHERE ((Object="comment" or Object="useful") and Id=?);';    //delete comments interactions
                    sysDB.run(sql, row.Id, (err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                    })
                }
                sql = 'DELETE FROM comments WHERE ProjectID=?;' //delete comments
                sysDB.run(sql, projectID, (err)=>{  //also delete comments from project
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    //update interactions and favourites
                    sql = 'DELETE FROM interactions WHERE Id=?' //delete interactions with the project
                    sysDB.run(sql, projectID, (err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        sql = 'DELETE FROM favourites WHERE ProjectID=?'    //delete favourite interactions with the project
                        sysDB.run(sql, projectID, (err)=>{
                            if (err)
                            {
                                reject(err);
                                return;
                            }
                            resolve({});
                        })
                    })
                })
            })
        })
    });
}

/**
 * function needed to set a project as recent.
 * @param {*} projectID the project that must be set to recent.
 * @returns nothing if the function was succesful, an error otherwise.
 */
exports.setRecent = function(projectID){
    return new Promise((resolve, reject)=>{
        const sql = `UPDATE projects SET Recent=1 WHERE Id=?`;
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to set a project as non recent.
 * @param {*} projectID the project that must be removed from the recent ones.
 * @returns nothing if the function was succesful, an error otherwise.
 */
exports.toggleRecent = function(projectID){
    return new Promise((resolve, reject)=>{
        const sql = `UPDATE projects SET Recent=0 WHERE Id=?`;
        sysDB.run(sql, [projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to change the type of a project.
 * @param {*} Type the new type of the project.
 * @param {*} projectID the project whose type must be updated.
 * @returns nothing if the function was succesful, an error otherwise.
 */
exports.changeType = function(Type, projectID){
    return new Promise((resolve, reject)=>{
        const sql = `UPDATE projects SET Type=? WHERE Id=?`;
        sysDB.run(sql, [Type, projectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to update a project's info.
 * @param {*} obj an object containing all the new info of the project. This obj will then be stripped of all the value that
 * hasn't changed, and adjust the sql query as such.
 * @param {*} projectID the ID of the project that must be updated.
 * @param {*} requester user requesting the update.
 * @param {*} role the role of the requester (moderators and administrators can delete/update a project even without user's permissions)
 * @param {*} concat if set to true, the user can add informations about the project, otherwise, old informations will be updated.
 * @returns nothing if the function was succesful, an error otherwise.
 */
exports.updateProject = function(obj, projectID, requester, role, concat=true){   //obj = {Name, Img, Files, Description, imageDescription, type}
    return new Promise((resolve, reject)=>{

        //checking if requester has permissions to modify the project
        let sql;
        if (requester.Role==="user")    //users can modify a project only if it's theirs.
        {
            sql = `SELECT Owner FROM projects WHERE Id=?;`;
            sysDB.get(sql, projectID, (err, row)=>{
                if (err || row===undefined)    //an error has occurred while trying to retrieve project's ownership
                {
                    reject("Couldn't check for user permissions! "+err);
                    return;
                }
                if (row.Owner != requester.Id)  //user doesn't have permissions to do so.
                {
                    reject("You don't have the permissions to modify such project!");
                    return;
                }
                else    //user has the permissions to modify project's info.
                {
                    let notNull;
                    if (concat) //user wants to add elements to the already existing ones (default use)
                    {
                        notNull = Object.values(nonNullValues(obj));    //remove the info which are undefined or empty.
                        notNull.push(projectID);
                        sql = `UPDATE projects SET ${obj.Name==="" || obj.Name===undefined?'':'Name=?,'}${obj.Img===""|| obj.Img===undefined?'':'Img=Img||?,'}${obj.Files===""|| obj.Files===undefined?'':'Files=Files||?,'}${obj.FilesNames===""|| obj.FilesNames===undefined?'':'FilesNames=FilesNames||?,'}${obj.Description===""|| obj.Description===undefined?'':'Description=?,'}${obj.imageDescription===""|| obj.imageDescription===undefined?'':'ImgDescription=?,'}${obj.type===""|| obj.type===undefined?'':'Type=?,'}`.slice(0,-1).concat(" WHERE Id=?;");
                    }
                    else    //user wants to overwrite what is already in the database (used when user wants to remove an image or a file from the project)
                    {
                        notNull = Object.values(nonUndefinedValues(obj));    //remove the info which are undefined or empty.
                        notNull.push(projectID);
                        sql = `UPDATE projects SET ${obj.Name===undefined?'':'Name=?,'}${obj.Img===undefined?'':'Img=?,'}${obj.Files===undefined?'':'Files=?,'}${obj.FilesNames===undefined?'':'FilesNames=?,'}${obj.Description===undefined?'':'Description=?,'}${obj.imageDescription===undefined?'':'ImgDescription=?,'}${obj.type===undefined?'':'Type=?,'}`.slice(0,-1).concat(" WHERE Id=?;");
                    }
                    sysDB.run(sql, notNull, (err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        resolve({});
                    })
                }

            })
        }
        else    //user has a role with enough authority
        {
            let notNull;
            if (concat) //user wants to add elements to the already existing ones (default use)
            {
                notNull = Object.values(nonNullValues(obj));    //remove the info which are undefined or empty.
                notNull.push(projectID);
                sql = `UPDATE projects SET ${obj.Name==="" || obj.Name===undefined?'':'Name=?,'}${obj.Img===""|| obj.Img===undefined?'':'Img=Img||?,'}${obj.Files===""|| obj.Files===undefined?'':'Files=Files||?,'}${obj.Description===""|| obj.Description===undefined?'':'Description=?,'}${obj.imageDescription===""|| obj.imageDescription===undefined?'':'ImgDescription=?,'}${obj.type===""|| obj.type===undefined?'':'Type=?,'}`.slice(0,-1).concat(" WHERE Id=?;");
            }
            else    //user wants to overwrite what is already in the database (used when user wants to remove an image or a file from the project)
            {
                notNull = Object.values(nonUndefinedValues(obj));    //remove the info which are undefined or empty.
                notNull.push(projectID);
                sql = `UPDATE projects SET ${obj.Name===undefined?'':'Name=?,'}${obj.Img===undefined?'':'Img=?,'}${obj.Files===undefined?'':'Files=?,'}${obj.Description===undefined?'':'Description=?,'}${obj.imageDescription===undefined?'':'ImgDescription=?,'}${obj.type===undefined?'':'Type=?,'}`.slice(0,-1).concat(" WHERE Id=?;");
            }
            sysDB.run(sql, notNull, (err)=>{
                if (err)
                {
                    reject(err);
                    return;
                }
                resolve({});
            })
        }
    });
}

/**
 * function needed to add a project to the user's favpurites.
 * @param {*} userID the ID of the user requesting to add a project to its favourites.
 * @param {*} ProjectID the ID of the project to be added to the user's favorites.
 * @returns an error if the function wasn't succesful.
 */
exports.addToFavourite = function(userID, ProjectID){
    return new Promise((resolve, reject)=>{
        const sql = `INSERT INTO favourites (Owner, ProjectID) VALUES (?,?);`;
        sysDB.run(sql, [userID, ProjectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve('Database updated correctly!');
        })
        //});
    });
}

/**
 * function needed to remove a project to the user's favpurites.
 * @param {*} userID the ID of the user requesting to remove a project to its favourites.
 * @param {*} ProjectID the ID of the project to be removed from the user's favorites.
 * @returns an error if the function wasn't succesful.
 */
exports.toggleFromFavourite = function(ProjectID){
    return new Promise((resolve, reject)=>{
        const sql = `DELETE FROM favourites WHERE ProjectID=?;`;
        userDB.run(sql, [ProjectID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
        //});
    });
}

/**
 * function needed to update an already written comment.
 * @param {*} Text the new text of the comment to be updated.
 * @param {*} CommentID the ID of the comment to be updated.
 * @returns an error if the function wasn't succesful.
 */
exports.updateComment = function(Text, CommentID){
    return new Promise((resolve, reject)=>{
        const sql = `UPDATE comments SET Text=? WHERE Id=?`;
        sysDB.run(sql, [Text, CommentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to delete an user's comment.
 * @param {*} CommentID the ID of the comment to be deleted.
 * @returns an error if the function wasn't succesful.
 */
exports.deleteComment = function(CommentID){
    return new Promise((resolve, reject)=>{
        const sql = `DELETE FROM comments WHERE Id=?;`;
        sysDB.run(sql, [CommentID], (err)=>{
            if (err)
            {
                reject(err);
                return;
            }
            resolve({});
        })
    });
}

/**
 * function needed to remove an element from the file system. Authenticate the user before performing this funtion, as it is irreversable!
 * @param {*} fileNames an array of files to be removed from the file system.
 * @param {*} type specify the type of the object to be deleted. defaults to undefined. If it has a different value from undefined, the function will be used in 'delete user folder' mode.
 */
exports.removeFromFileSystem = function(fileNames, type=undefined){
    return new Promise((resolve, reject)=>{
        for (let fileName of fileNames)
        {
            if (fileName.length!=0)
            {
                if (type == undefined)
                {
                    fileName = fileName.toString().replaceAll('&#x2F;', '\\');
                    fileName = fileName.toString().replaceAll('&#x5C;', '/');  //for some reasons, multer changes the '/' and the '\' into those two codes, so they must be translated back.
                    fs.unlink(`./public/public/userFiles/${fileName}`, (err)=>{
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                    })
                }
            }
        }

        if (fileNames.length!=0)
        {
            if (type!=undefined)    //deletes user
            {
                fs.rm(`./users/${fileNames.toString()}`, {recursive:true}, ()=>{
                    console.log(`${fileNames}'s user folder deleted!`)
                });
            }
        }
        resolve("files succesfully removed from the file system!");
    })
}

/**
 * function retreiving from the Database all the relevant info to implement the search functionality
 * @param {*} searchType type of the element to be searched
 * @param {*} searchCategory category of the element to be searched
 * @param {*} searchTxt complete or partial name of the element to be searched
 * @param {*} searchTime timestamp interval of the element to be searched defaults to undefined. If set to undefined, the search will not care about time.
 * @returns the elements matching or partially matching the above info's
 */
exports.searchDB = function(searchType, searchCategory, searchTxt, searchTime=undefined){
    return new Promise((resolve, reject)=>{
        searchTxt = '%'+searchTxt+'%';  //'%' means that it's enough that just a portion of the Name can be matching
        let sql;

        if (searchType=="projects")
        {
            if (searchCategory=="recent")
                sql = `SELECT * FROM ${searchType} WHERE (${searchType=='profiles'?'Nick':'Name'} like ? ${searchTime!=undefined?`AND Date>='${searchTime}'`:``}${searchType=='projects' && searchCategory!='all'?`AND recent=1)`:')'};`;
            else
                sql = `SELECT * FROM ${searchType} WHERE (${searchType=='profiles'?'Nick':'Name'} like ? ${searchTime!=undefined?`AND Date>='${searchTime}'`:``}${searchType=='projects' && searchCategory!='all'?`AND Type='${searchCategory}')`:')'};`;
        }
        else if(searchType=="profiles")
            sql = `SELECT * FROM profiles WHERE Nick like ?`;

        sysDB.all(sql, searchTxt, (err, rows)=>{
            if (err)
            {
                reject(err)
                return;
            }
            if (rows==undefined || rows==null)
            {
                reject(err);
                return;
            }

            //returns the needed info
            let out;
            if (searchType == 'projects')   //get all the info about projects
            {
                out = rows.map((e)=>({
                    ID: e.Id,
                    Title: e.Name,
                    Owner: e.Owner,
                    Likes: e.Likes,
                    Dislikes: e.Dislikes,
                    latestComment: '',
                    Date: e.Date
                }));
            }
            else if(searchType == 'profiles')   //get all the info about profiles
            {
                out = rows.map((e)=>({
                    Nick: e.Nick,
                    frontBio: e.frontBio,
                    Image: e.Image,
                    Role: e.Role
                }));
            }
            resolve(out);
        })
    })
}

/**
 * Removes all interaction in the sysDB database of the user identified by 'userID'
 * @param {*} userID the user whose interactions must be completely removed from the database
 */
exports.removeAllInteractions = function(userID){
    return new Promise((resolve, rejects)=>{
        let sql = `DELETE FROM Interactions WHERE Owner=${userID};`;
        sysDB.run(sql, [], (err)=>{
            if (err)
            {
                rejects(err);
                return
            }
            sql = `DELETE FROM Favourites WHERE Owner=${userID};`;
            sysDB.run(sql, [], (err)=>{
                if (err)
                {
                    rejects(err);
                    return;
                }
                sql = `DELETE FROM comments WHERE Owner=${userID};`;

                sysDB.run(sql, [], (err)=>{
                    if (err)
                    {
                        rejects(err);
                        return(err);
                    }
                    resolve({msg:"User interactions completly removed from the database!"});
                })
            })
        })
    });
}

/**
 * get all the projects of the user identified by 'userID'
 * @param {*} userID the user whose projects are to be returned
 */
exports.getUserProjects = function(userID){
    return new Promise((resolve, rejects)=>{
        let sql = `SELECT * FROM projects WHERE Owner=${userID}`;
        sysDB.all(sql, [], (err, rows)=>{
            if (err)
            {
                rejects(err);
                return;
            }
            if (rows==undefined || rows==null)
            {
                resolve({});
                return;
            }
            const out = rows.map((e)=>({    //get all the projects
                ID: e.Id,
                Title: e.Name,
                Owner: e.Owner,
                Likes: e.Likes,
                Img: e.Img.split(","),        //this is an array of string. Each string has a path to an image in the server repo.
                ImgDescription: e.ImgDescription.split(","),
                Files: e.Files.split(","),    //an array of strings with the files 
                FilesNames: e.FilesNames.split(','),
                Dislikes: e.Dislikes,
                latestComment: '',
            }));
            resolve(out);
        })
    })
}

/**
 * function used to remove an user from the profile table inside the database
 * @param {*} userID the user to be removed
 */
exports.removeUserFromProfilesTable = function(userID){
    return new Promise((resolve, rejects)=>{
        let sql = `DELETE FROM profiles WHERE Id=${userID}`;
        sysDB.run(sql, [], (err)=>{
            if (err)
            {
                rejects(err);
                return;
            }
            resolve({msg:"user succesfully removed from database!"})
        })
    })
}