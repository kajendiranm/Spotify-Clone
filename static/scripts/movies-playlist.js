const song_list = document.querySelectorAll('.song-box')
song_list.forEach( song => {
    song.addEventListener('click', () => {
        id = song.querySelector('input').value
        play_song(id)
    })
})
