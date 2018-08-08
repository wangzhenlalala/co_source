/**
 * 目标： 
 *  subscribers对象中的每一个属性都是一个，generator function,其中完成异步的调用。（可能是一连串的异步调用）
 *  用同步的写法实现异步。
 * expression_to_return_a_promise()后面不在允许添加then，catch
 */

let expression_to_return_a_promise = function(args) {
    
    let pro = new  Promise(function(resolve,reject){
        setTimeout(function(){
            let ran = Math.ceil( Math.random() * 4 );

            if(ran > 2){
                resolve(args);
            }else{
                reject(args);
            }
            
        },2000);
    }).then(function(value){
        console.log(value);
        return `${args}__changed`;
    });
    return pro;

};
function isGeneratorFunction(target){
    let constructor = target.constructor;
    return constructor && constructor.name === 'GeneratorFunction'
};


function isPromise(target){
    
    return target && target.then ;
};

let models = {
    subscribers: {
        first: function *(){
            let a1 = yield expression_to_return_a_promise("1");
                console.log(a1, 'result_a1');
            let a2 = yield expression_to_return_a_promise('2');  
                console.log(a2, 'result_a2');
            let a3 = yield expression_to_return_a_promise("3");  
                console.log(a3, 'result_a3');
        }
    }
};

function so(generator_function){
    if( !isGeneratorFunction(generator_function)) return ;
    //得到生成器
    let gen = generator_function.call(this);
    

    function next(res){
        //decide if it is necessary to continue execute !!!
        try{
            let result =  gen.next(res);
            let promise = result.value;
            if( !isPromise(promise) ) {
                gen.next(promise);
                return
            }
            return promise.then(onResolved,onRejected);
        }catch(e){
            gen.throw(new Error("sorry something wrong, exited",e.stack));
        }
        
    };

    function onResolved(value){
        next(value);
    };

    function onRejected(value){
        console.error(value)
    };

    next();
};

// so(function *(){
//     let value1 = yield expression_to_return_a_promise();
    
//     console.log(value1);
// });

so(models.subscribers.first);


