from django.db import models
from django.contrib.auth.models import User
import os

def rename_thumbnail(instance, filename, request=None):
    upload_to = 'song_thumbnails/'
    ext = filename.split('.')[-1]
    filename = '{}_{}.{}'.format(instance.name, request.user.username, ext)
    return os.path.join(upload_to, filename)

class ArtistModel(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    followers = models.ManyToManyField(User, related_name='following', blank=True)

    def __str__(self):
        return self.username.first_name


class MoviesModel(models.Model):
    name = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='movie_thumbnails')
    director = models.ForeignKey(ArtistModel, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class SongModel(models.Model):
    name = models.CharField(max_length=100, null=False)
    thumbnail = models.ImageField(upload_to='song_thumbnails', default='default/user.png')
    song = models.FileField(upload_to='songs/', null=False)
    artist = models.ManyToManyField(ArtistModel, blank=True)
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    movie = models.ForeignKey(MoviesModel, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.name

