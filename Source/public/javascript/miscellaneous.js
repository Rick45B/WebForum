"use strict";
import Api from './api.js';
import { createCommentPromptHTML, imagePreviewCardHTML } from './templates/projects-template.js';

/**
 * function used to test if an element in the html has been already pressed
 * @param {*} elementID the element's id to test
 * @param {*} lastChild overwrites the default testing behaviour. If this is set to true, then the lastChild will be tested before the firstChild of the container.
 */
function testSelected(elementID, lastChild=false){
    const elem = document.getElementById(elementID);
    let color;
    if (elem === null || elem === undefined)    return false;
    if (elem.lastChild.style!==undefined && lastChild==true)  //The element is the last child of the container
        color = new String(elem.lastChild.style.fill);  //it's a favourite project button!
    else
        color = new String(elem.firstChild.style.fill); //the element is the first child of the container
    console.log("color: "+color);
    return (color.localeCompare("currentcolor")==0 || color.length==0)?false:true;  //if the fill style has currentcolor setted, then the user hasn't interacted with the user yet!
}

/**
 * Function needed to show the next/previous image on the carousel.
 * @param {*} mode set it to 1 for next button, 0 for the previous button, 2 for activating a certain image slideshow based on num
 * @param {*} num the number of the slideshow image to show, if the mode has been set to 2
 */
function buttonCarouselPressed(mode, num){
    if(mode===1)    //pressed the 'next' button
    {
        for(let i=0; document.getElementById(`carousel-item${i}`)!==null; i++)  //scan all the carouselItem until the active one has been found
        {
            if (document.getElementById(`carousel-item${i}`).className!==null)
            {
                if(document.getElementById(`carousel-item${i}`).className.includes("active"))   //active carousel item was found
                {
                    document.getElementById(`carousel-item${i}`).className = "carousel-item";   //deactivate the current carousel
                    document.getElementById(`carouselButton${i}`).className = "";   //deactivate the correct button, inside the carousel-indicators div
                    if (document.getElementById(`carousel-item${i+1}`)!==null)
                    {
                        document.getElementById(`carousel-item${i+1}`).className = "carousel-item active";  //activate the next carousel
                        document.getElementById(`carouselButton${i+1}`).className = "active";   //sets the correct button to active, inside the carousel-indicators div
                    }
                    else
                    {
                        document.getElementById(`carousel-item${0}`).className = "carousel-item active";   //activate the next carousel (used if i need to go back to the first carousel)
                        document.getElementById(`carouselButton${0}`).className = "active";   //sets the correct button to active, inside the carousel-indicators div
                    } 
                    break;  //quitting the iteration (active carousel has been found)
                }
            }
        }
    }
    else if(!mode)    //pressed the 'previous' button
    {
        let count = 0;  //counter storing the number of images of a project
        for(count=0; document.getElementById(`carousel-item${count}`)!==null; count++)  //count the number of images a project has
        {}
        for(let i=count-1; i!=-1; i--) //scan all the carouselItem until the active one has been found
        {
            if (document.getElementById(`carousel-item${i}`).className!==null)
            {
                if(document.getElementById(`carousel-item${i}`).className.includes("active"))   //active carousel item was found
                {
                    console.log("active: "+document.getElementById(`carousel-item${i}`).className);
                    document.getElementById(`carousel-item${i}`).className = "carousel-item";   //deactivate the current carousel
                    document.getElementById(`carouselButton${i}`).className = "";   //deactivate the correct button, inside the carousel-indicators div
                    if (document.getElementById(`carousel-item${i-1}`)!==null)  
                    {
                        document.getElementById(`carousel-item${i-1}`).className = "carousel-item active";  //activate the previous carousel
                        document.getElementById(`carouselButton${i-1}`).className = "active";   //sets the correct button to active, inside the carousel-indicators div
                    }
                    else 
                    {
                        document.getElementById(`carousel-item${count-1}`).className = "carousel-item active"; //activate the previous carousel (used if i need to go back to the last carousel)
                        document.getElementById(`carouselButton${count-1}`).className = "active";   //sets the correct button to active, inside the carousel-indicators div
                    }
                    break;  //quitting the iteration (active carousel has been found)
                }
            }
        }
    }
    else if(mode===2)
    {
        for(let i=0; document.getElementById(`carousel-item${i}`)!==null; i++)  //count the number of images a project has
        {
            if (document.getElementById(`carousel-item${i}`).className!==null)
            {
                if(document.getElementById(`carousel-item${i}`).className.includes("active"))   //active carousel item was found
                {
                    document.getElementById(`carousel-item${i}`).className = "carousel-item";   //deactivate the current carousel
                    document.getElementById(`carouselButton${i}`).className = "";   //deactivate the correct button, inside the carousel-indicators div
                    break;  //quitting the iteration (active carousel has been found)
                }
            }
        }
        console.log("number of image selected: "+num);
        document.getElementById(`carousel-item${num}`).className = "carousel-item active";
        document.getElementById(`carouselButton${num}`).className = "active";   //sets the correct button to active, inside the carousel-indicators div
    }
}

/**
 * function needed to show the comment prompt page.
 * @param {*} comment comment to modify, if the function has been called because a 'modify-comment' action
 */
function showCommentPromptPage(comment){
    //document.getElementById("commenti").insertAdjacentHTML('afterbegin', createCommentPromptHTML(comment));
    document.getElementById("commentPrompt").style.display="";  //show the comment insert prompt. (has display:none by default)
}

/**
 * function needed to remove (display:none) the image from the HTML of the 'add a project' page.
 * @param {*} imageIndex the index of the image to be removed
 */
function removeImagePreview(imageIndex){
    document.getElementById(`previewCard${imageIndex}`).style.display = "none";     //hide the image card the user wanted to delete

    let videoElement = document.getElementById(`videoPreview${imageIndex}`);
    videoElement.pause();
    videoElement.removeAttribute('src'); // empty source
    videoElement.load();
}

/**
 * function needed to remove (display:none) the file preview from the HTML of the 'add a project' page.
 * @param {*} fileIndex the index of the file to be removed 
 */
function removeFilePreview(fileIndex){
    document.getElementById(`filePreview${fileIndex}`).style.display = "none";     //hide the file preview the user wanted to delete
}

/**
 * private function, needed to check if the string is empty or contains only whitespaces
 * @param {*} str 
 * @returns true if the string is blank, false otherwise
 */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/**
 * function used to change the HTML of the comment on the 'modify a comment' mode.
 * @param {*} commentID the ID of the comment to modify
 */
function modifyComment(commentID){
    const commentTextContainer = document.getElementById(`commentText${commentID}`);
    const oldCommentText = commentTextContainer.innerText;  //the text of the not modified comment
    commentTextContainer.innerText="";   //clear inner text

    //inserting the textarea where the old inner text was
    commentTextContainer.insertAdjacentHTML('beforeend', `<textarea class="form-control" id="commentFormControlArea${commentID}" rows="3" placeholder="${oldCommentText}"></textarea>`);

    //hiding various comment features...
    document.getElementById(`upvoteComment${commentID}`).style.display = "none";
    document.getElementById(`downvoteComment${commentID}`).style.display = "none";
    document.getElementById(`usefulComment${commentID}`).style.display = "none";
    document.getElementById(`modifyComment${commentID}`).style.visibility = "hidden";
    document.getElementById(`deleteComment${commentID}`).style.visibility = "hidden";
    document.getElementById(`commentFormControlArea${commentID}`).value = oldCommentText;   //show the 'not yet modified' comment text to the user

    //shows the apply and cancel modification buttons
    document.getElementById(`cancelCommentMod${commentID}`).style.display="flex";
    document.getElementById(`applyCommentMod${commentID}`).style.display="flex";
}

/**
 * function used to restore the normal comment HTML (use it to go from 'modify a comment' mode to 'normal' mode)
 * @param {*} commentID the ID of the comment to restore the deafult HTML
 */
function restoreComment(commentID){
    const commentTextContainer = document.getElementById(`commentText${commentID}`);
    const text = document.getElementById(`commentFormControlArea${commentID}`).value;   //before deleting the textarea, save its modified value
    $(`#commentText${commentID}`).empty();     //removes the textarea
    
    commentTextContainer.innerText = text;
    //showing various comment features...
    document.getElementById(`upvoteComment${commentID}`).style.display = "";
    document.getElementById(`downvoteComment${commentID}`).style.display = "";
    document.getElementById(`usefulComment${commentID}`).style.display = "";
    document.getElementById(`modifyComment${commentID}`).style.visibility = "visible";
    document.getElementById(`deleteComment${commentID}`).style.visibility = "visible";

    //hide the apply and cancel modification buttons
    document.getElementById(`cancelCommentMod${commentID}`).style.display="none";
    document.getElementById(`applyCommentMod${commentID}`).style.display="none";
}

/**
 * small function needed to show the dropwdown options for the searchBar when the 'dropdownButtonSearch' is pressed
 */
function showDropdownButton(){
    document.getElementById('search-barDropdown').style.display = "block";    //shows the dropwdown
    document.getElementById('dropdownButtonSearch').setAttribute('onclick', 'hideDropdownButton()');   //when user will press the button again, it will hide the dropdwon
}

/**
 * small function needed to hide the dropwdown options for the searchBar when the 'dropdownButtonSearch' is pressed
 */
function hideDropdownButton(){
    document.getElementById('search-barDropdown').style.display = "none";    //shows the dropwdown
    document.getElementById('dropdownButtonSearch').setAttribute('onclick', 'showDropdownButton()');   //when user will press the button again, it will show the dropdwon
}

/**
 * function needed to disable the check of the category when profiles are selected, and viceversa (in the searchBar dropdown)
 * @param {string} type what ratio has been pressed
 * @param {*} opt if sets to 1, disables the radio selection of category. defaults to 0
 */
function checkRadio(type, opt=0){
    if (type == "profiles")
    {
        document.getElementById('categorySearch').checked = false;
        document.getElementById('categorySelected').disabled = true;
        document.getElementById('categorySearch').setAttribute('onclick', "checkRadio('category')");
    }
    else    {
        document.getElementById('profileSearch').checked = false;
        document.getElementById('categorySelected').disabled = false;
        document.getElementById('categorySearch').setAttribute('onclick', "checkRadio('category', 1)");
        if (opt==1) 
        {
            document.getElementById('categorySearch').checked = false;
            document.getElementById('categorySearch').setAttribute('onclick', "checkRadio('category')");
        }
    }
}

//needed to be sure that the function can be reached from the HTML
window.testSelected = testSelected;
window.buttonCarouselPressed = buttonCarouselPressed;
window.showCommentPromptPage = showCommentPromptPage;
window.removeImagePreview = removeImagePreview;
window.removeFilePreview = removeFilePreview;
window.modifyComment = modifyComment;
window.restoreComment = restoreComment;
window.showDropdownButton = showDropdownButton;
window.hideDropdownButton = hideDropdownButton;
window.checkRadio = checkRadio;

export {testSelected, buttonCarouselPressed, isBlank, restoreComment};