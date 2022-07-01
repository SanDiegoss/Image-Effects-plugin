/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas');

/**
 * @param {HTMLElement} element 
 */
let createEvents = function AddEventsOnElement(element){
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName)=>{
        element.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        element.addEventListener(eventName, highlight, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        element.addEventListener(eventName, unhighlight, false);
    });
    element.addEventListener('drop', handleDrop, false);
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
 * @param {DragEvent} event 
 */
let handleDrop = function dropEvent(event){
    let files = event.dataTransfer.files;

    handleFile(files);
}
/**
 * @param {FileList} files 
 */
let handleFile = function handleFile(files) {
    ([...files]).forEach(uploadFile)
}
/**
 * @param {File} file 
 */
let uploadFile = function uploadFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = function() {
        let img = document.createElement('img')
        img.src = reader.result
        const ctx = CANVAS.getContext('2d');
        img.onload = function(){
            ctx.drawImage(img, 0, 0, 500, 500);
        }
    }
};

/**
 * @param {Event} event 
 */
function preventDefaults (event) {
    event.preventDefault()
    event.stopPropagation()
}

export {createEvents};