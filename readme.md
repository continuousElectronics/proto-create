## Proto Create

This module produces a function that creates and returns a target object which inherits from another object. The syntax used internally is "Object.create()" and this module is meant to provide a cleaner and better looking solution with the added benefit of "sub-classing" arrays, or effectively having an array inherit from any object (including null). The benefit of this is that you do not have to pollute Array.prototype when a custom array method is desired.

Thank you to <a href="https://github.com/kangax">kangax</a> for the article on subclassing arrays. I used his method of creating an object and giving it the special characteristics of an array manually. The article can be seen here:
<a href="http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/">http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/</a>

The argument of the function must be an object. The accepted optional properties are: 

[ proto ] : the desired prototype of the newly created target object. if [ target ] is an array, [ proto ] defaults to Array.prototype, otherwise it defaults to Object.prototype

[ target ] : The new object to be created. This may be an array. Literal syntax is recommended since a shallow copy of the properties will take place. 

[ descriptors ] : The descriptors of the object may be defined here.

If both [ target ] and [ descriptors ] are not defined, the function will return an empty object.

## Install
```
npm install proto-create
```

## Usage

```javascript
const trace = require("proto-create");

// creating an object that inherits from Object.prototype to be used as a new prototype
let myObjectPrototype = create({
    proto: Object.prototype,
    target: { a: 1 }
});
// creating an object that inherits from "myObjectPrototype"
let x = create({
    proto: myObjectPrototype,
    target: { b: 2 }
});
console.log(x.b, x.a, x.toString); // 2, 1, [Function: toString]

// creating an object to be used as a prototype for an array, which inherits from Array.prototype
let myArrayPrototype = create({
    proto: Array.prototype,
    descriptors: {
        last: {
            value: function () {
                return this[this.length - 1];
            }
        }
    }
});
// creating an array which inherits from "myArrayPrototype", which in turn inherits from Array.prototype
let y = create({
    proto: myArrayPrototype,
    target: [32, 43, 54, 65]
});
console.log(y.last(), y.map(x => 2 * x)); // 65, [ 64, 86, 108, 130 ]

```