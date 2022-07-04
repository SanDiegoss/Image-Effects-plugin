
/**
 * @param {HTMLElement} element 
 */
let createEvents = function createVisualEvents(element){
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName)=>{
        element.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        element.addEventListener(eventName, highlight, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        element.addEventListener(eventName, unhighlight, false);
    });
}

/**
 * @param {Event} event 
 */
let highlight = function addClassHighlight(event){
    this.classList.add('highlight');
};

/**
 * @param {Event} event 
 */
let unhighlight = function removeClassHighlight(event){
    this.classList.remove('highlight');
};

/**
 * @param {Event} event 
 */
function preventDefaults (event) {
    event.preventDefault()
    event.stopPropagation()
}

export {createEvents, preventDefaults};