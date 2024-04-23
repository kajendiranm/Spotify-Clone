const main = document.querySelectorAll('.right-side')

main.forEach(el => {
    el.addEventListener('click', event => {
        event.stopPropagation()
        let heart = el.querySelector('.fa-heart')
        let likes_count = el.querySelector('.likes')
        let song_id = el.dataset.songid
        like_dislike(song_id, heart, likes_count)
    })
})

function like_dislike(song_id, heart, likes_count){
    let val = parseInt(likes_count.textContent)
    if(heart.classList.contains('liked')) {
        heart.classList.remove('liked')
        likes_count.classList.remove('liked')
        likes_count.textContent = val - 1
    }
    else {
        heart.classList.add('liked')
        likes_count.classList.add('liked')
        likes_count.textContent = val + 1
    }
    $.ajax({
        url: `/like-dislike/`,
        method: 'post',
        data: {
            song_id: parseInt(song_id),
            csrfmiddlewaretoken: csrftoken,
        },
        success: data => {
            // console.log(data)
        },
        error: data => {
            // console.log(data)
        }
    })
}