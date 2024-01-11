'use strict';

/**
 * create the projects category header which can be seen at the top, before showing the projects.
 * @param {*} text text of the category header.
 * @returns HTML.
 */
function createProjectHeader(text) {
  return `<strong>${text}</strong>`;
} 

export default createProjectHeader;