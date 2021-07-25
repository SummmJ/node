let connection = require('../bin/mysql')

function recordSongs(req, res) {
    let param = req.body
    let userID = param.userID
    let songID = param.songID
    let loveValue = param.loveValue
    let singerID = param.singerID
    let singer = param.singer
    let flag = false
    let msg = {}
    if (userID && songID && loveValue) {
        connection.query("SELECT userID FROM music_statistics WHERE userID = ? AND songID = ?", [userID, songID], function (error, results, fields) {
            // 歌曲已记录则更新
            if (results.length >= 1) {
                connection.query("UPDATE music_statistics SET favorite_value = ? WHERE userID = ? AND songID = ?", [loveValue, userID, songID], function (error, results, fields) {
                    if (error) {
                        throw error
                    } else {
                        flag = true
                        msg.song = 'updateSong'
                    }
                })
                // 没有记录则插入
            } else {
                connection.query("INSERT INTO music_statistics(userID, songID, favorite_value) VALUES(?,?,?)", [userID, songID, loveValue], function (error, results, fields) {
                    if (error) throw error
                    if (results) {
                        flag = true
                        msg.song = 'insertSong'
                    }
                })
            }
        })
    }
    if (singerID && singer) {
        connection.query("SELECT times FROM artists_statistics WHERE userID = ? AND singerID = ?", [userID, singerID], function(error, results, fields) {
            if (error) throw error
            // 歌手之前有记录
            if(results.length >= 1) {
                let times = results[0].times + 1
                connection.query("UPDATE artists_statistics SET times = ? WHERE userID = ? AND singerID = ?", [times, userID, singerID], function(error, results, fields) {
                    if (error) throw error
                    if (results) {
                        msg.singer = 'updateSinger'
                        res.send(msg)
                    }
                })
            } else {
                let times = 1
                connection.query("INSERT INTO artists_statistics(userID, singerID, singer, times) VALUES(?,?,?,?)", [userID, singerID, singer, times], function(error, results, fields) {
                    if (error) throw error
                    if (results) {
                        msg.singer = 'insertSinger'
                        res.send(msg)
                    }
                })
            }
        })
    }
}

module.exports = recordSongs;