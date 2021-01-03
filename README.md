# TinyTemplate
a simple template engine for learn, inspired by ejs


# Example
```javascript
var str = TinyTemplate.render(`
    <%= users | first %>`, {
    users: [
        'jy',
        'hi'
    ]
});
console.log(str); // jy
```