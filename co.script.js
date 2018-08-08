//self-thinking

// debugger;
let glo = 0;
let result;

/**     this is a generator funciton  */
/* i think :
    generator will block given instruction stream, and only resume to execute the instruction stream when received an command ! generator.next();
    and it has the nature of block(suspend) !!!
    when we lanuch a promise , we instruct js engine to do something asynchronous for us. and we explictly invoke the Promise  instance's method
    .then to attach callbacks so that we can be notified when the async stuff has been completed; meanwhile,during the period when js engine perform
    the async work, we are free to do something else. in another word ,if we consider the hehavior to lanuch async action as a routine, after async
    action is under perform , ther routine is blocked and will be resumed when then async action has been completed!! when resumed it continue to execute
    its instructions - to invoke the functions attatched by then and catch !!!
    you see we consider the routinue to be blocked !!!
    and we know , a generator can block some  execution and let is go and return certain data when received an next message!!
    can we mix promise and generator to make generator block promise and resume promise when needed !!!
*/

//generator function; 
function *after(){
    glo = yield 'first';
    glo = yield 'second';
};

//a generater object;
let gen = after();

do{
    result = gen.next();
    if(result.done) break;
    // console.log(result.value);
}while(true);

/**     this is a generator funciton  */


/** This a promise  */
let promise = new Promise( /*executor*/
        function(resolve, reject){
            //do something ,and then settle this promise's status as you see fit;
            setTimeout(function(){
                    //resolve with some values;
                    resolve('resolved');
                    //or reject with some reasons
                    //reject('you are rejected any way');
                }, 
                2000
            );
        }
    ) /**end of new Promise  */
    .then(
        function resolved(value){},
        function rejected(error){}
    );
/** This a promise  */

////**************************** experiment */
    let g = undefined;
    let promiseGenerator = function () {
        let pro =  new Promise(function executor(resolve, reject){
            setTimeout(function(){
                /**
                 * we can not put next runner here,
                 * then function will never be the end of success callbacks. so it will not receive result return from upper functin  but ther original result from ther settled promise
                 * another reason is we have no chance to touch user's async logic..
                    pro.then(function(value){
                        // debugger
                        g.next(value);
                        return value;       
                    });
                */
                //settle the status of pro
                resolve('got it ');
            }, 1000);
        });
        return pro;
    }

    function *genFunc(){
        let value1 = yield promiseGenerator().then(
            function(v){ 
                debugger; 
                console.log(v,'following'); 
                return 'changed'
            }
        );
        console.log(value1);       
        let value2 = yield promiseGenerator();
        console.log(value2);       
        let value3 = yield promiseGenerator();
        console.log(value3);       
        let value4 = yield promiseGenerator();
        console.log(value4);       
        let value5 = yield promiseGenerator();
        console.log(value5);       
        let value6 = yield promiseGenerator();
        console.log(value6);       

    };
    
    g = genFunc();

    let pro = g.next().value; //let the generator to run for the first time !!!
    pro.then(function(value){
        // debugger
        g.next(value);
        return value;       
    });

    /*
    1. yield 后面只跟一个 要跟着一个 promise 生成函数（我自己这么叫的），因为 Promise的executor在promise对象初始化的时候，就被执行了，如果yield
        后面跟的是一个生成好的promise对象，那么就存在一个时间间隙。
    2. 要考虑到yield后面的promise可能已经被添加了好几个then，catch yield后面的语句，因该是被认为是个个promise的最会一个 then 
    */
////**************************** experiment */
