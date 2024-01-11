//imports
import Projects from "./projects.js";
import Comments from "./comments.js"
import Users from "./users.js";

class Api{

    /**
     * ask the server for all the projects of the user identified by userID
     * @param {*} userID the ID of the user whose project are wanted
     */
    static userProjects = async(userID)=>{
        const response = await fetch(`/api/getUserProjects/${userID}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson.map((ex) => Projects.from(ex));
        }
        else throw responseJson;
    }

    /**
     * Get the list of recent projects
     */
    static getRecentProjects = async () => {
        let response = await fetch('/api/recent');
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson.map((ex) => Projects.from(ex));
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Get the list of coding projects
     */
    static getCodingProjects = async () => {
        let response = await fetch('/api/coding');
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson.map((ex) => Projects.from(ex));
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Get the list of trending projects
     */
    static getTrendingProjects = async () => {
        let response = await fetch('/api/trending');
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson.map((ex) => Projects.from(ex));
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Get the list of digital projects
     */
    static getDigitalProjects = async () => {
        let response = await fetch('/api/digital');
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson.map((ex) => Projects.from(ex));
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Get the list of analog projects
     */
    static getAnalogProjects = async () => {
        let response = await fetch('/api/analog');
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson.map((ex) => Projects.from(ex));
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Get the ID's of favourite projects of the user Nick
     */
    static getFavouriteProjectsID = async () => {
        let response = await fetch(`/api/favourites`);
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson.map((ex) => Projects.from(ex));
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Get the list of favourite projects of the user Nick
     */
    static getFavouriteProjects = async (projects) => {
        let projectsJson = [];
        for (const project of projects)
        {
            let response = await fetch(`/api/project/${project.Id}`);
            if (!response.ok)   throw projectsJson;  // an object with the error coming from the server
            projectsJson.push(await response.json());
        }
        return projectsJson.map((ex) => Projects.from(ex));
    }

    /**
     * Get the info of the project 'ID'.
     * @param {*} ID id del progetto da cui prendere le informazioni
     */
    static getProjectInfo = async (ID) =>{
        let response = await fetch(`/api/project/${ID}`);
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson;
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * ask the server if the user sending the request is logged or not
     * @returns true if the user is logged, false otherwise.
     */
    static isLogged = async()=>{
        let response = await fetch(`/api/isLogged`);
        const projectsJson = await response.json();
        if (response.ok) {
            return projectsJson;
        } else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * @param {*} ID the ID of a project
     * @returns the latest comment of a project
     */
    static getLatestComment = async (ID) =>{
        
        const comment = await fetch(`/api/latestComment/${ID}`);
        const commentJson = await comment.json();
        if (comment.ok) {
            return commentJson;
        } else {
            throw commentJson;  // an object with the error coming from the server
        }
    }

    /**register a new user into the database
     * 
     * @param {*} Nickname Nickname of the new user
     * @param {*} Password Password of the new user
     * @param {*} Mail Mail of the new user
     */
    static registerNewUser = async(Nickname, Password, Mail, RepeatMail)=>{
        const user = new Users(Nickname, Password, Mail, RepeatMail);
        const query = await fetch(`/api/register`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        });
        const queryJson = await query.json();
        if (!query.ok)
        {
            throw(queryJson);
        }
    }

    /**
     * function needed to send the login-obtained info to the server
     * @param {*} Nickname Nickname found inside the form
     * @param {*} Password Password found inside the form
     */
    static loginUser = async(nickname, password)=>{
        const query = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname, password}),
        });
        if (query.ok)
        {
            return await query.json();
        }
        else
        {
            throw await query.json();  //andrà catturata
        }
    }

    /**get the number of comments of a project
     * 
     * @param {*} ProjectID 
     * @returns the number of comments of a project
     */
    static getCommentsNum = async(ProjectID)=>{
        const num = await fetch(`/api/projectComments/${ProjectID}`);
        const numJson = await num.json();
        if (num.ok)
        {
            return numJson;
        }
        else
        {
            throw numJson;
        }
    }

    /**
     * Get the Nick of the owner, given his ID.
     * @param {*} ownerID the id of the user you'd like to get the nick
     * @returns the Nick of the user identified by ownerID.
     */
    static getNick = async(ownerID)=>{
        const Nick = await fetch(`/api/getNick?id=${ownerID}`);
        const nickJson = await Nick.json();
        if (Nick.ok)
        {
            return nickJson;
        }
        else
        {
            throw nickJson;
        }
    }

    /**
     * Get an array of all the comments that a project has.
     * @param {*} projectID the id of the project you'd like to get the comments from.
     * @param {*} min the index of the minimum comment to be retrieved.
     * @param {*} num the number of comments to be retrieved after min.
     * @returns an array containing all the comments of the project identified by id.
     */
    static getProjectComments = async(projectID, min, num)=>{
        const comments = await fetch(`/api/project/${projectID}/comments?min=${min}&num=${num}`);
        const commentsJson = await comments.json();
        if (comments.ok) {
            return commentsJson.map((ex) => Comments.from(ex));
        } else {
            throw commentsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Function that, give a Nick, returns an object containing all the (non sensible) info of the user.
     */
    static getUserInfo = async(Nick)=>{
        const user = await fetch(`/api/${Nick}/userInfo`);
        const userJson = await user.json();
        if (user.ok){
            return userJson;
        }
        else throw userJson;
    };

    /**
     * Function needed to check if an user has already interacted to the current content.
     * @param {*} Id the id of the content to check
     * @param {*} type the type of the content
     * @returns 
     */
    static hasInteracted = async(Id, type)=>{
        const interaction = await fetch(`/api/hasInteracted?type=${type}&id=${Id}`);
        const interactionJson = await interaction.json();
        if (interaction.ok){
            return interactionJson;
        }
        else throw interactionJson;
    }

    /**
     * Upvote's a comment
     * @param {*} commentID 
     */
    static upvoteComment = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/upvoteComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * toggle a comment upvote
     * @param {*} commentID 
     */
    static toggleUpvoteComment = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/toggleUpvoteComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * downvote a comment
     * @param {*} commentID 
     */
    static downvoteComment = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/downvoteComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * toggle a comment downvote
     * @param {*} commentID 
     */
    static toggleDownvoteComment = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/toggleDownvoteComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * upvote a project
     * @param {*} projectID 
     */
    static upvoteProject = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/upvoteProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * toggle the upvote of a project
     * @param {*} projectID  
     */
    static toggleUpvoteProject = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/toggleUpvoteProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * downvote a project
     * @param {*} projectID  
     */
    static downvoteProject = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/downvoteProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * toggle a project downvote
     * @param {*} projectID
     */
    static toggleDownvoteProject = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/toggleDownvoteProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * add project to favourite 
     * @param {*} projectID 
     */
    static favouriteProject = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/addToFavourite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * remove project from user's favourites
     * @param {*} projectID 
     */
    static toggleFavouriteProject = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/toggleFromFavourite`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * set the commentID to useful for the user Nickname
     * @param {*} commentID 
     */
    static setCommentUseful = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/usefulComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * set the commentID to 'not anymore' useful for the user Nickname
     * @param {*} commentID 
     */
    static toggleCommentUseful = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/toggleUsefulComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * uses the REST API to insert a new comment in the database
     * @param {*} projectID the ID of the project where to create the new comment
     * @param {*} Text the Text contained inside the comment
     */
    static insertComment = async(projectID, Text)=>{
        const response = await fetch(`/api/${projectID}/addComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Text})
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * upload an array of files to the server.
     * @param {} files the files to be sent. Can be one as well.
     * @param {} type set it to 'project' if files belongs to a project, 'profile' if files belong to a personal page.
     */
    static fileUpload = async(formData, type)=>{

        const response = await fetch(`/api/uploadFiles?type=${type}`,{
            method: 'POST',
            body: formData,
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * uploads a new project to the server.
     * @param {*} Name the name of the project
     * @param {*} Img The img's of the project
     * @param {*} Files The source files of the project
     * @param {*} FilesNames the original name of the files of the project
     * @param {*} Description The description of the project
     * @param {*} type The type of the project
     */
    static projectAdd = async(Name, Img, Files, FilesNames, Description, type, imageDescription)=>{
        const response = await fetch(`/api/addProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Name, Img, Files, FilesNames, Description, type, imageDescription}),
        });
        const responseJson = await response.json();
            if (response.ok){
                return responseJson;
            }
            else throw responseJson;
    }

    /**
     * Send the server the info needed to update the personal profile page.
     * @param {*} buffer the buffer containing all the elements to be updated (the elements NOT to be updated will value undefined!!)
     */
    static personalPageUpdate = async(buffer)=>{
        const response = await fetch(`/api/updateProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Name:buffer[0], Surname:buffer[1], Bday:buffer[2], Bio:buffer[3], frontBio:buffer[4], Image:buffer[5],
                Country:buffer[6], State:buffer[7], Status:buffer[8], Role:buffer[9]}),
        });
        const responseJson = await response.json();
            if (response.ok){
                return responseJson;
            }
            else throw responseJson;
    }

    /**
     * function needed to update a project.
     * @param buffer the buffer containing all the elements of the project to be updated.
     * @param projectID the ID of the project you want to update.
     */
    static projectUpdate = async(buffer, projectID)=>{
        const response = await fetch(`/api/${projectID}/updateProject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Name:buffer[0], Img:buffer[1], Files:buffer[2], FilesNames:buffer[3], Description:buffer[4], imageDescription:buffer[5], type:buffer[6]}),
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * function asking the server to remove certain userFiles.
     * @param {*} fileIndexes the array of indexes of the files to be removed
     * @param {*} fileType the type of file to be removed (project image, user image....)
     * @param {*} contentID the content owning the image file (ID of a project, of a user page...)
     * @param {*} fileName the name of the file to be removed! Defaults to "undefined" (Might be used for future implementations)
     */
    static removeUserFiles = async(fileIndexes, fileType, contentID, fileName="undefined")=>{
        const response = await fetch(`/api/deleteUserFiles?fileType=${fileType}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({fileName:fileName, content:contentID, fileIndexes:fileIndexes}),
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * function asking the server (throught the REST API) to update a comment's text.
     * @param {*} commentID the ID of the comment to be updated
     * @param {*} textMod the updated text of the comment
     */
    static commentUpdate = async(commentID, textMod)=>{
        const response = await fetch(`/api/${commentID}/updateComment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Text:textMod}),
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * function asking the server (throught the REST API) to delete a comment's text.
     * @param {*} commentID the ID of the comment to be deleted
     */
    static commentDelete = async(commentID)=>{
        const response = await fetch(`/api/${commentID}/deleteComment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * function asking the server (throught the REST API) to delete a project.
     * @param {*} projectID the ID of the project to delete
     */
    static projectDelete = async(projectID)=>{
        const response = await fetch(`/api/${projectID}/deleteProject`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * function asking the server (throught the REST API) to get a project's files (to download)
     * @param {*} projectID the ID of the project to download the files from
     */
    static getDownloadFiles = async(projectID)=>{
        const response = await fetch(`/api/downloadProjectFiles/${projectID}`, {
            method: 'GET',
            mode: 'no-cors',
            referrerPolicy: 'no-referrer'
        }).then((res)=>{
            if (res.status == 200)
                res.blob().then((res)=>{    //prompts the download
                    const aElement = document.createElement("a");
                    aElement.setAttribute("download", "ProjectSourceFiles.zip");
                    const href = URL.createObjectURL(res);
                    aElement.href = href;
                    aElement.setAttribute("target", "_blank");
                    aElement.click();
                    URL.revokeObjectURL(href);
                }).catch((err)=>{console.log(err)});
            else
                throw new Error("Project has no source files!");
        }).catch((err)=>console.log(err));
    }

    /**
     * function asking the server to search for a specific element on the site
     * @param {*} searchType type of the element to be searched
     * @param {*} searchTime timestamp interval of the element to be searched
     * @param {*} searchCategory category of the element to be searched
     * @param {*} searchTxt complete or partial name of the element to be searched
     * @returns the elements matching or partially matching the above info's
     */
    static searchSiteContents = async(searchType, searchTime, searchCategory, searchTxt)=>{
        let response = await fetch(`/api/search?searchType=${searchType}&searchTime=${searchTime}&searchCategory=${searchCategory}&searchTxt=${searchTxt}`, {
        });
        const projectsJson = await response.json();
        if (response.ok && searchType=='projects') {
            return projectsJson.map((ex) => Projects.from(ex));
        }
        else if (response.ok && searchType=='profiles') {
            return projectsJson.map((ex) => Users.from(ex));
        }
        else {
            throw projectsJson;  // an object with the error coming from the server
        }
    }

    /**
     * function requesting the server to logout the current logged user, and destroy the session.
     * @returns "User logged out succesfully!" if everything went according to plan, an error mesage otherwise.
     */
    static logOut = async()=>{
        const response = await fetch(`/api/logout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * function requesting the server to delete the personal image of the  user.
     * @param {*} userNickname the nickname whose image is to be removed from the FS
     * @returns "File destroyed succesfully!" if everything went according to plan, an error mesage otherwise.
     */
    static deleteUserImage = async(userNickname)=>{
        const response = await fetch(`/api/deleteUserImage/${userNickname}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }

    /**
     * API function, used to ask the server to delete an user from the database.
     * @param {*} userID the ID of the user to delete
     */
    static userDelete = async(userID)=>{
        const response = await fetch(`/api/deleteUser/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseJson = await response.json();
        if (response.ok){
            return responseJson;
        }
        else throw responseJson;
    }
}

export default Api;
