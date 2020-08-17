// In here. The following function will handle promise errors
// or async errors it will catch any errors that come from our
// async await code.
module.exports = {
    asyncErrorHandler: (fn) => 
        // return callback anonymous function
        (req, res, next) => {
            //Promise.resolve returns a promise object that is resolved with a given value.
            Promise.resolve(fn(req, res, next)) //this fn function is going to be the async function
                   .catch(next); // error
        
    }
}