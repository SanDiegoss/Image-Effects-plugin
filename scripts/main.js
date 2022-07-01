
/*
Module['onRuntimeInitialized'] = function(){
    var instance = new Module.MyClass(1);
    console.log(Module.MyClass.add(1,2));
    instance.delete(); 
}
*/
let add = async function add(a, b){
    let module = await Module();
    return module.MyClass.add(a,b);
};

let result = add(1,2);
result.then((result)=>console.log(result));