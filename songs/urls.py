from django.urls import path
from django.shortcuts import redirect
from . import views

urlpatterns = [
    path('', lambda request: redirect('login')),
    path('home/', views.home, name='home'),
    path('playlist/<str:artist>/',views.playlist, name='playlist' ),
    path('playlist/movie/<int:id>/', views.movies_playlist, name='movie'),
    path('library/', views.library, name="library"),
    path('liked', views.liked_songs, name='liked-songs'),
    path('song/<int:id>/', views.fetch_song),
    path('like-dislike/', views.like_unlike_songs),
    path('search/', views.search_page, name='search'),
    path('search-api/', views.search_api)
]
