from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required

from .models import SongModel, ArtistModel, MoviesModel
from django.contrib.auth.models import User

from django.db.models import Q

# Create your views here.

@login_required(login_url='login')
def home(request):
    songs = SongModel.objects.all().order_by('?')[:5]
    artists = ArtistModel.objects.all().order_by('?')[:5]
    movies = MoviesModel.objects.all().order_by('?')[:5]
    return render(request, 'songs/home.html', {
        'songs': songs,
        'artists': artists,
        'movies': movies
    })

@login_required(login_url='login')
def playlist(request, artist):
    artist = User.objects.get(username=artist).artistmodel
    songs = artist.songmodel_set.all()
    follow_status = artist in request.user.following.all()
    return render(request, 'songs/playlist.html',{
        'artist': artist,
        'songs': songs,
        'follow_status': follow_status
    })

@login_required(login_url='login')
def movies_playlist(request, id):
    movie = MoviesModel.objects.get(pk=id)
    songs = SongModel.objects.filter(movie=movie)
    return render(request, 'songs/movies-playlist.html', {
        'movie': movie,
        'director': movie.director,
        'songs': songs,
    })

@login_required(login_url='login')
def liked_songs(request):
    liked_songs = (request.user.likes.all())
    return render(request, 'songs/liked.html', {
        'songs': liked_songs
    })

@login_required(login_url='login')
def fetch_song(request, id):
    data = SongModel.objects.get(pk=id)
    song = {
        'name': data.name,
        'artists': [artist.username.first_name for artist in data.artist.all()],
        'url': data.song.url,
        'image': data.thumbnail.url,
        'pk': data.pk
    },
    return JsonResponse({'song': song})

@login_required(login_url='login')
def like_unlike_songs(request):
    if request.method == 'POST':
        song_id = request.POST['song_id']
        song = SongModel.objects.get(id=song_id)
        if(request.user not in song.likes.all()):
            song.likes.add(request.user)
            return JsonResponse({'data': 'Liked Successfully'})
        else:
            song.likes.remove(request.user)
            return JsonResponse({'data': 'Uniked Successfully'})

@login_required(login_url='login')
def search_page(request):
    return render(request, 'songs/search.html')

@login_required(login_url='login')
def search_api(request):
    data = request.POST.get('data')
    all_songs = SongModel.objects.filter(name__icontains=data)
    artists = ArtistModel.objects.filter(username__first_name__icontains=data)
    movies = MoviesModel.objects.filter(name__icontains=data)

    songs = []
    song_id_list = []
    artists_list = []
    movies_list = []

    for movie in movies:
        per_movie = {
            'name': movie.name,
            'thumbnail': movie.thumbnail.url,
            'director': movie.director.username.first_name,
            'id': movie.pk
        }
        movies_list.append(per_movie)
        movie_songs = movie.songmodel_set.all()
        for song in movie_songs:
            per_song = {
            'name': song.name,
            'artists': [artist.username.first_name for artist in song.artist.all()],
            'song': song.song.url,
            'thumbnail': song.thumbnail.url,
            'id': song.pk
        }
            if not song_id_list:
                    songs.append(per_song)
                    song_id_list.append(song.pk)
            else:
                if song.pk not in song_id_list:
                    songs.append(per_song)
                    song_id_list.append(song.pk)

    for artist in artists:
        per_artist = {
            'name': artist.username.first_name,
            'username': artist.username.username,
            'image': artist.username.useraccountmodel.profileImage.url,
        }
        artists_list.append(per_artist)
        for song in artist.songmodel_set.all():
            per_song = {
                'name': song.name,
                'artists': [artist.username.first_name for artist in song.artist.all()],
                'song': song.song.url,
                'thumbnail': song.thumbnail.url,
                'id': song.pk
            }
            if not song_id_list:
                songs.append(per_song)
                song_id_list.append(song.pk)
            else:
                if song.pk not in song_id_list:
                    songs.append(per_song)
                    song_id_list.append(song.pk)
                    
    for song in all_songs:
        per_song = {
            'name': song.name,
            'artists': [artist.username.first_name for artist in song.artist.all()],
            'song': song.song.url,
            'thumbnail': song.thumbnail.url,
            'id': song.pk
        }
        if not song_id_list:
                songs.append(per_song)
                song_id_list.append(song.pk)
        else:
            if song.pk not in song_id_list:
                songs.append(per_song)
                song_id_list.append(song.pk)

    return JsonResponse({
        'songs': songs,
        'artists': artists_list,
        'movies': movies_list,
    })
    

@login_required(login_url='login')
def library(request):
    following_artists = request.user.following.all()
    liked_songs = (request.user.likes.all())
    return render(request, 'songs/library.html', {
        'artists': following_artists,
        'songs': liked_songs
        })