import {createEvents} from './drop.js'
/* Drag n Drop */

let dropArea = document.getElementById("drop-area");

createEvents(dropArea);

/*--------- */

let add = async function add(a, b){
    let module = await Module();
    return module.MyClass.add(a,b);
};

let result = add(1,2);
result.then((result)=>console.log(result));

let keka = async function lol(){
    let module = await Module();
    let a = module.MyClass.someData();
    a.push_back(2);
    let b = module.MyClass.addData(a)
    console.log(b.get(1))
    return a;
}();

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