'use strict';

/**
 * generates the HTML needed to show the sidebar.
 * @param {*} active the active element of the sidebar.
 * @returns HTML.
 */
function createSideBar(active){
    return `<a ${active==="Home"?'class="active"':''}href="/">Home</a>
    <a ${active==="Recent"?'class="active"':''}href="/recent">Recently added projects</a>
    <a ${active==="Trending"?'class="active"':''}href="/trending">Top trending</a>
    <a ${active==="Digital"?'class="active"':''}href="/digital">Digital Electronics</a>
    <a ${active==="Analog"?'class="active"':''}href="/analog">Analog Electronics</a>
    <a ${active==="Coding"?'class="active"':''}href="/coding">Coding</a>
    <a ${active==="Personal"?'class="active"':''}href="/personalPage">Personal page</a>
    <a ${active==="Favourites"?'class="active"':''}href="/favourites">Favourites</a>
    <a ${active==="personalProject"?'class="active"':''}href="/personalProjects">My projects</a>`;
}

export default createSideBar;