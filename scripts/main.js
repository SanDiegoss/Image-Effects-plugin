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

    // ptr для JS, ptr_ для wasm
    let [ptr, ptr_] = allocateMemory(module, 4);

    setMemory(module, [1, 2, 3, 4], ptr_)
    ptr
    module._print(ptr_, 4);
    for(let i = 0; i < 4; i++) console.log(ptr[i]);


    freeMemory(module, ptr_);
    return 123;
}();

// allocate memory for wasm, returns pointer
function allocateMemory(module, length)
{
    var ptr = module._malloc(length);
    return [new Uint8ClampedArray(module.HEAP8.buffer, ptr, length), ptr];
}

// free memory
function freeMemory(module, ptr)
{
    module._free(ptr);
}

// fill memory
function setMemory(module, data, ptr)
{
    module.HEAP8.set(data, ptr);
}
