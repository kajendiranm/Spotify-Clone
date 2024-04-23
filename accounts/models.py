from django.db import models
from django.contrib.auth.models import User

from songs.models import ArtistModel, SongModel
import os

# Create your models here.

def rename_profile_image(instance, filename):
    upload_to = 'user_profile_images/'
    ext = filename.split('.')[-1] 
    filename = '{}.{}'.format(instance.username.username, ext)
    return os.path.join(upload_to, filename)

class UserAccountModel(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('normal', 'Normal'),
        ('creator', 'Creator'),
    ]

    profileImage = models.ImageField(upload_to=rename_profile_image, default='default/user.png')
    username = models.OneToOneField(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=ACCOUNT_TYPE_CHOICES, default='normal')
    liked_songs = models.ManyToManyField(SongModel, related_name='liked', blank=True)
    # following = models.ManyToManyField(ArtistModel, related_name='followedBy')

    def __str__(self):
        return f'{self.username.username} - {self.type}'
