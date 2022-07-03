import {createEvents} from './visualEvents.js'

let image = document.createElement('img');

/* Drag n Drop */

let dropArea = document.getElementById("drop-area");
/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas')

const context = CANVAS.getContext('2d');

createEvents(dropArea);

let imagePreview = function drawImageOnDisplay(){
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    context.drawImage(this, 0, 0, CANVAS.width, CANVAS.height);
};

/**
 * @param {DragEvent} event 
 */
let handleFiles = function handleFilesFromForm(event){
    let files = event.dataTransfer.files;
    if(files.length > 1) {
        console.error("Too many files!");
        throw new Error('Only 1 file, please.');
    }
    let file = files.item(0);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        image.src = reader.result;
        image.onload = imagePreview;
    }
}

dropArea.addEventListener('drop', handleFiles, false);

let lulz = async function lul(){
    let module = await Module();
    // fu - наш "указатель" на JS функцию
    const fu = module.addFunction(function() {console.log('gg')}, 'v');
    module._foo(fu);
    module.removeFunction(fu);

    var mem = allocateMemory(module, 4, 4);
    setMemory(module, [1, 2, 3, 4], mem, 4)
    module._print(mem, 4);
    freeMemory(module, mem);
    return 123;
}();

// int - 4
// short - 2
// char - 1

// allocate memory for wasm, returns pointer
function allocateMemory(module, length, bytesPerElement)
{
    return module._malloc(length * bytesPerElement);
}

// free memory
function freeMemory(module, ptr)
{
    module._free(ptr);
}

// fill memory
function setMemory(module, data, ptr, bytesPerElement)
{
    module.HEAP32.set(data, (ptr / bytesPerElement));
}
