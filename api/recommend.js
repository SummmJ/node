let connection = require('../bin/mysql')

// 将数据库返回数据转换成二维数组的表格形式
function changeToMatrix (arr, arr2) {
    let len = arr.length
    let matrix = new Array(arr2.length + 1)
    for(let i = 0; i < matrix.length; i++) {
        matrix[i] = []
    }
    // 以二维数组的表格形式存放数据
    for(let i = 0; i < arr2.length; i++) {
        matrix[i + 1][0] = arr2[i].userID
    }
    matrix[0][0] = ''
    for(let i = 0; i < len; i++) {
        if(matrix[0].indexOf(arr[i].songID) === -1) {
            matrix[0].push(arr[i].songID)
        }
    }
    debugger
    // 在表格中插入数据
    for(let i = 1; i < matrix.length; i++) {
        for(let j = 1; j < matrix[0].length; j++) {
            matrix[i][j] = 0
        }
    }
    
    for(let i = 0; i < len; i++) {
        let x = 0
        for(let j = 1; j < matrix.length; j++) {
            let index = matrix[j].indexOf(arr[i].userID)
            if (index != -1) {
               x = j
            } 
        }
        let y = 0
        let index = matrix[0].indexOf(arr[i].songID)
        if(index != -1) {
            y = index
            matrix[x][y] = arr[i].favorite_value
        }
    }
    return matrix
}

// 找出与指定用户听歌喜好最接近的用户
function findSimilar (matrix, userID) {
    let userIndex = 0
    for(let j = 0; j < matrix.length; j++) {
        if (matrix[j].indexOf(userID) != -1) {
            userIndex = j
        } 
    }
    let mainUser = matrix[userIndex]
    matrix.splice(userIndex,1)
    matrix.splice(0,1)
    let otherUsers = matrix
    // let otherUsers = matrix.slice(1, userIndex + 1).concat(userIndex, matrix.length - 1)
    let res = {}
    for(let i = 0; i < otherUsers.length; i++) {
        let user = otherUsers[i][0]
        // 向量点积
        let Vector_dot_product = 0
        // 向量长度的叉积
        let Cross_product_of_vector_length = 0
        for(let j = 1; j < otherUsers[0].length - 1; j++) {
            Vector_dot_product += mainUser[j] * otherUsers[i][j]
        }
        let cr1 = 0
        let cr2 = 0
        for(let k = 1; k < otherUsers[0].length - 1; k++) {
            cr1 += Math.pow(mainUser[k], 2)
            cr2 += Math.pow(otherUsers[i][k], 2)
        }
        Cross_product_of_vector_length = Math.sqrt(cr1) + Math.sqrt(cr2)
        let Similarity = (Vector_dot_product/Cross_product_of_vector_length).toFixed(2)
        res[user] = Similarity
    }
    console.log(res)
    return res
}
function findUser (obj) {
    let arr = Object.keys(obj).map(function(i){return obj[i]-0})
    let max = Math.max(...arr)
    function findKey (value, compare = (a, b) => a === b) {
        return Object.keys(obj).find(k => compare(obj[k], value))
    }
    let similarUser = findKey(max+'')
    return similarUser
}
function recommend (req, res) {
    let param = req.body
    let userID = param.userID
    let selectAllUsers = "SELECT * FROM music_statistics"
    let data = {}
    let resObj = {}
    connection.query(selectAllUsers, function (error, results, fields) {
        if(results.length>=1) {
            data.res1 = results
        }
        connection.query("SELECT DISTINCT userID FROM music_statistics",function (error, numres, fields) {
            data.res2 = numres
            // res.send(data)
            let matrix = changeToMatrix(data.res1, data.res2)
            let sim = findSimilar(matrix, userID)
            let similarUserID = findUser(sim)
            resObj.similarUserID = similarUserID
            connection.query("SELECT songID FROM music_statistics WHERE userID=? AND favorite_value>1",[similarUserID], function (error, simres, fields){
                for(let i = 0; i < simres.length; i++) {
                    simres[i] = simres[i].songID
                }
                resObj.simSongID = simres
            })
            connection.query("SELECT singerID,times FROM artists_statistics WHERE userID=? ORDER BY times desc", [userID], function (error, singerRes, fields){
                if(singerRes) {
                    // 截取收听次数前两位的歌手id
                    let singerIDlist = singerRes.slice(0,2)
                    for(let i = 0; i < singerIDlist.length; i++) {
                        singerIDlist[i] = singerIDlist[i].singerID
                    }
                    resObj.simSingerID = singerIDlist
                }
                res.send(resObj)
            })
            
        })
        
        // res.send(msg)
    })
}

module.exports = recommend;