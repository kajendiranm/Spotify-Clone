const song_list = document.querySelectorAll('.song-list .item')
song_list.forEach( song => {
    song.addEventListener('click', () => {
        id = song.querySelector('input').dataset.song_id
        play_song(id, song)
    })
})