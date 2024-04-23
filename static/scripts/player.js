let song = document.getElementById('song')
let progress = document.getElementById('progress')
let previous = document.getElementById('previous')
let next = document.getElementById('next')
let pause_play = document.querySelector('.pause-play')
let songs = document.querySelectorAll('.song-box')
let comp_dur = document.querySelector('.completed-duration')
let total_dur = document.querySelector('.total-duration')
let green_play_btn = document.querySelector('.large-play-btn')

let currrentPk

let pause = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
</svg>`

let play = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
</svg>`

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

pause_play.addEventListener('click', () => {
    song.play()
})

songs.forEach(songEl => {
    songEl.addEventListener('click', () => {
        const songId = songEl.querySelector('input[name="song_id"]').value;
        play_song(songId, songEl)
    })
})

function play_song(songId) {
    const songImg = document.querySelector('#song-image')
    const songName = document.querySelector('.details .name')
    $.ajax({
        url: `/song/${songId}/`,
        method: 'get',
        success: data => {
            let tempSong = data.song[0]
            song.src = tempSong.url
            songImg.src = tempSong.image
            songName.textContent = tempSong.name
            currrentPk = tempSong.pk
            
            document.querySelector('.artists p').textContent = author_generator(tempSong.artists)

            song.onloadedmetadata = function() {
                progress.max = song.duration;
                progress.value = song.currentTime;
                total_dur.textContent = `${durationFormat(Math.floor(song.duration / 60))}:${durationFormat(Math.floor(song.duration % 60))}`
            }
            
            song.play()
            pause_play.classList.remove('play')
            pause_play.classList.add('pause')
            pause_play.innerHTML = pause

        },
        error: err => {

        }
    
    })
}

pause_play.addEventListener('click', () => {
    if (pause_play.classList.contains('pause')) {
        song.pause()
        pause_play.classList.remove('pause')
        pause_play.classList.add('play')
        pause_play.innerHTML = play
        return
    }

    if (pause_play.classList.contains('play')) {
        song.play()
        pause_play.classList.remove('play')
        pause_play.classList.add('pause')
        pause_play.innerHTML = pause
        return
    }

})

song.addEventListener("play", function() {
    setInterval(() => {
        progress.value = song.currentTime
        comp_dur.textContent = `${durationFormat(Math.floor(song.currentTime / 60))}:${durationFormat(Math.floor(song.currentTime % 60))}`
    }, 500);
});


progress.onchange = function() {
    song.currentTime = parseFloat(progress.value)
    console.log(song.currentTime)
    console.log(song.duration)
}
// let songs_list = []


previous.addEventListener('click', () => {
    currentIndex = songs_list.indexOf(currrentPk) - 1
    if (currentIndex >= 0)
        play_song(songs_list[currentIndex], )
    else
        return
})
function go_next(){
    currentIndex = songs_list.indexOf(currrentPk) + 1
    if (currentIndex < songs_list.length)
        play_song(songs_list[currentIndex])
    else
        play_song(songs_list[0])
}
next.addEventListener('click', go_next)

song.addEventListener('ended', () => {
    go_next()
})

function durationFormat(num){
    if(num<10) {
        return `0${num}`
    }
    else    
        return num
}
if (green_play_btn != null){
    green_play_btn.addEventListener('click', () => {
        play_song(songs_list[0])
    })
}
function author_generator(arr){
    let authors = ""
    arr.forEach(el => {
        authors = authors.concat(`${el}, `)
    })
    authors = authors.slice(0, -2)
    return authors
}
