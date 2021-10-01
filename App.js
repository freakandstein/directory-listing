var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const path = process.argv[2];
    getPropertyResponse(path).then((value) => {
        const jsonResponse = JSON.stringify(value)
        res.end(jsonResponse);
    }).catch((error) => {
        res.end(error);
    })
}).listen(8080);

function getPropertyResponse(path) {
    let properties = [];
    const filePath = fs.statSync(path)
    const isDir = filePath.isDirectory()
    if (isDir) {
        const files = fs.readdirSync(path)
        files.forEach((file) => {
            const subFilePath = `${path}/${file}`
            const subFile = fs.statSync(subFilePath)
            const isSubDir = subFile.isDirectory()
            const createdTime = subFile.ctime.toLocaleDateString()
            const size = subFile.size
            const fileName = getFileName(subFilePath)
            const fileProperty = {
                fileName: fileName,
                filePath: subFilePath,
                size: size,
                isDirectory: isSubDir,
                createdAt: getDate(createdTime)
            }
            properties.push(fileProperty)
        })
    } else {
        const createdTime = filePath.ctime.toLocaleDateString()
        const size = filePath.size
        const fileName = getFileName(path)
        const fileProperty = {
            fileName: fileName,
            filePath: path,
            size: size,
            isDirectory: isDir,
            createdAt: getDate(createdTime)
        }
        properties.push(fileProperty)
    }
    return new Promise((resolve, reject) => {
        if (properties.length == 0) {
            resolve("Invalid Path")
        } else {
            resolve(properties)
        }
    })
}

function getFileName(path) {
    const pathSplit = path.split("/")
    if (pathSplit.length > 0) {
        return pathSplit[1]
    } else {
        return pathSplit
    }
}

function getDate(date) {
    const formattedDate = date.substring(0, 16)
    const year = formattedDate.split("/")[2]
    const month = formattedDate.split("/")[1]
    const day = formattedDate.split("/")[0]

    return `${year}-${month}-${day}`
}