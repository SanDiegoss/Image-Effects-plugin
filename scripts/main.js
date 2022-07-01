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
    const fu = module.addFunction(function() {console.log(123)}, 'v');
    module._foo(fu);
    module.removeFunction(fu);
    return 123;
}();