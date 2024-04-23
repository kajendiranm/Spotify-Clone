from django.contrib import admin
from .models import ArtistModel, SongModel, MoviesModel
# Register your models here.

admin.site.register(ArtistModel)
admin.site.register(SongModel)
admin.site.register(MoviesModel)