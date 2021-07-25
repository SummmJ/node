let connection = require('../bin/mysql')

function analysis (req, res) {
    let param = req.body
    let userID = param.userID
    let msg = {}
    if (userID) {
        let sql1 = "SELECT name,times FROM playlist_statistics WHERE userID = ?"
        connection.query(sql1, [userID], function (error, results, fields) {
          if (error) throw error
          if(results.length>=1) {
              msg.res1 = results
            //   res.send(msg)
          }
        })
        let sql2 = "SELECT singer,times FROM artists_statistics WHERE userID=? ORDER BY times desc"
        connection.query(sql2, [userID], function (error, results, fields) {
            if (error) throw error
            if(results.length>=1) {
                msg.res2 = results[0]
                // res.send(msg)
            }
          })
        let sql3 = "SELECT songID FROM music_statistics WHERE userID=? AND favorite_value=3"
        connection.query(sql3, [userID], function (error, results, fields) {
            if (error) throw error
            if(results) {
                msg.res3 = results.slice(0,2)
                
            }
            res.send(msg)
          })
         
    }
}

module.exports = analysis;