
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