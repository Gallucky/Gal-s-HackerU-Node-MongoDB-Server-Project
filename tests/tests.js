const arr = __filename.split("\\");
console.log("File name:", arr[arr.length - 1]);

const fileBaseName = (filename) => {
    const arr = filename.split("\\");
    return arr[arr.length - 1];
};

console.log("File name:", fileBaseName(__filename));

const path = require("path");

console.log("Path basename:", path.dirname(__filename));
