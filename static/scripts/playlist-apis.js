const follow_btn = document.querySelector('.follow-btn')
const username = document.querySelector('.username').dataset.username
const followers_count = document.querySelector('.followers-count')

follow_btn.addEventListener('click', () => {
    if (follow_btn.dataset.status === 'true') {
        follow_btn.dataset.status = 'false'
        follow_btn.textContent = "Follow"
        follow_unfollow_api(false)
    }
    else{
        follow_btn.dataset.status = 'true'
        follow_btn.textContent = "Following"
        follow_unfollow_api(true)
    }
})

function follow_unfollow_api(follow) {
    url = follow ? 'follow' : 'unfollow'
    $.ajax({
        url: `/accounts/${url}/`,
        method: 'post',
        data: {
            csrfmiddlewaretoken: csrftoken,
            artist_name: username
        },
        success: data => {
            let count = parseInt(followers_count.textContent)
            if(url === 'follow')
                followers_count.textContent = `${count + 1} Followers`
            else
            followers_count.textContent = `${count - 1} Followers`
        },
        error: data => {
            console.log(data)
        }
    })
}