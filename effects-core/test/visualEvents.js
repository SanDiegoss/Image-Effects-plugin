/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable max-len */

const dropArea = document.getElementById('drop-area');

/**
 * @param {Event} event
 */
 const highlight = function addClassHighlight(event) {
    dropArea.classList.add('highlight');
};

/**
 * @param {Event} event
 */
const unhighlight = function removeClassHighlight(event) {
    dropArea.classList.remove('highlight');
};

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
['dragenter', 'dragover'].forEach(function(eventName) {
    dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach(function(eventName) {
    dropArea.addEventListener(eventName, unhighlight, false);
});

/**
 * @param {Event} event
 */
function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
}

