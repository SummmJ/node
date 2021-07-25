let connection = require('../bin/mysql')

function recordPlayList (req, res) {
    let param = req.body
    let userID = param.userID
    let name = param.name
    let msg = {}
    if(userID && name) {
      let sqlone = "SELECT times FROM playlist_statistics WHERE userID = ? AND name = ?"
      let sqltwo = "INSERT INTO playlist_statistics(userID, name, times) VALUES(?,?,?)"
      let sqlthree = "UPDATE playlist_statistics SET times = ? WHERE userID = ? AND name = ?"
      connection.query(sqlone, [userID, name], function(error, results, fields) {
        if (error) throw error
        // 之前有记录
        if(results.length >= 1) {
            let times = results[0].times + 1
            // res.send({results: results})
            connection.query(sqlthree, [times, userID, name], function(error, results, fields) {
                if (error) throw error
                    if (results) {
                        msg.playlist = 'updatePlaylist'
                        res.send(msg)
                    }
            })
        } else {
            let times = 1
            connection.query(sqltwo, [userID, name, times], function(error, results, fields) {
                if (error) throw error
                    if (results) {
                        msg.playlist = 'insertplatlist'
                        res.send(msg)
                    }
            })
        }
      })
    }
}
module.exports = recordPlayList;