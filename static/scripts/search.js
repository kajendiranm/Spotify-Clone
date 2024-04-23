const search_input = document.querySelector('.search-input')
document.addEventListener('DOMContentLoaded', () => {
    search_input.focus()
});
const song_list = document.querySelector('.song-list')
const songs_container = document.querySelector('.songs-container')

const movie_container = document.querySelector('.movies-container')
const movie_main = document.querySelector('.movie-main')

const artists_container = document.querySelector('.artists-container')
const artist_main = document.querySelector('.artist-main')


let timer

let tempElements

search_input.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        search_song(search_input.value)
    }, 500)
    
})

function search_song(val) {
    $.ajax({
        url: '/search-api/',
        method: 'post',
        data: {
            csrfmiddlewaretoken: csrftoken,
            data: val
        },
        success: data => {
            create_artist_nodes(data.artists)
            create_movie_nodes(data.movies)
            create_nodes(data)
        },
        error: data => {
            console.log(data)
        }
    })
}

function create_nodes(data){
    songs_list = []
    song_list.innerHTML = ''
    songs_container.classList.add('hide')
    if(search_input.value == ''){
        return
    }
    data.songs.forEach(song => {
        songs_container.classList.remove('hide')
        let songEl = document.createElement('div')
        songEl.className = "item"
        songEl.innerHTML = `
            <input type="hidden" name="" id="" data-song_id="${ song.id }">
            <input type="hidden" name="song_authors" value="${author_generator(song.artists)}">
            <img src="${ song.thumbnail }" />
            <div class="play">
                <span class="fa fa-play"></span>
            </div>
            <h4>${ song.name }</h4>
            <p>${author_generator(song.artists)}</p>
        `
        song_list.appendChild(songEl)

        songs_list.push( song.id )
    })
    tempElements = document.querySelectorAll('.item')
    tempElements.forEach(el => {
        el.addEventListener('click', () => {
            let songId = el.querySelector('input').getAttribute('data-song_id')
            play_song(songId)
        })
    })
}

function create_artist_nodes(artists){
    let url = window.location.origin
    artist_main.innerHTML = ''
    artists_container.classList.add('hide')
    if(search_input.value == ''){
        return
    }
    artists.forEach(artist => {
        artists_container.classList.remove('hide')
        artist_node = document.createElement('div')
        artist_node.className = 'item'
        artist_node.innerHTML = `
            <a href="${url}/playlist/${artist.username}"><img src="${artist.image}" /></a>
            <div class="play">
                <a href="${url}/playlist/${artist.username}"><span class="fa fa-play"></span></a>
            </div>
            <h4>${artist.name}</h4>
        `
        artist_main.appendChild(artist_node)
    })
}

function create_movie_nodes(movies){
    let url = window.location.origin
    movie_main.innerHTML = ''
    movie_container.classList.add('hide')
    if(search_input.value == ''){
        return
    }
    movies.forEach(movie => {
        movie_container.classList.remove('hide')
        movie_node = document.createElement('div')
        movie_node.className = 'item'
        movie_node.innerHTML = `
            <a href="${url}/playlist/movie/${movie.id}"><img src="${movie.thumbnail}" /></a>
            <div class="play">
                <a href="${url}/playlist/movie/${movie.id}"><span class="fa fa-play"></span></a>
            </div>
            <h4>${movie.name}</h4>
            <p>${movie.director}</p>
        `
        movie_main.appendChild(movie_node)
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
