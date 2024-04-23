from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import UserAccountModel

from django.contrib.auth import authenticate, login, logout

import os

def logoutPage(request):
    logout(request)
    print('log')
    return redirect('login')

def loginPage(request):
    invalid = False
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        invalid = True
        if user is not None:
             login(request, user)
             return redirect('home')
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, 'accounts/login.html', {'invalid': invalid})

def signupPage(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        username = request.POST['username']
        password1 = request.POST['password1']
        user = User.objects.filter(username=username)
        if user.exists():
            return render(request, 'accounts/signup.html', {
                'error': 'Username already exists!',
                'name': name,
                'email': email,
                'username': username
                })
        user = User.objects.create_user(first_name=name, email=email, username=username, password=password1)
        UserAccountModel.objects.create(username=user)
        return redirect('login')
    return render(request, 'accounts/signup.html')

def follow(request):
    if request.method == 'POST':
        artist = request.POST['artist_name']
        artist = User.objects.get(username=artist).artistmodel
        if request.user not in artist.followers.all():
            artist.followers.add(request.user)
            return JsonResponse({'data': 'Followed Succussfully!'})
    return JsonResponse({'data': 'Something went wrong...'})

def unfollow(request):
    if request.method == 'POST':
        artist = request.POST['artist_name']
        artist = User.objects.get(username=artist).artistmodel
        if request.user in artist.followers.all():
            artist.followers.remove(request.user)
            return JsonResponse({'data': 'Unfollowed Succussfully!'})
    return JsonResponse({'data': 'Something went wrong...'})

def profile(request):
    if request.user.username == 'spotify_user':
        return render(request, 'accounts/profile.html', {'commonAccount': True})
    if request.method == "POST" :
        name = request.POST['name']
        image = request.FILES.get('image')
        user = request.user
        user.first_name = name
        user.save()

        if image:
            default = '/home/kaja/Desktop/spotify/media_files/default/user.png'
            old_image = user.useraccountmodel.profileImage.path
            user_acc = user.useraccountmodel
            user_acc.profileImage = image
            user_acc.save()
            if old_image != default:
                os.remove(old_image)

    creator = True if request.user.useraccountmodel.type == 'creator' else False
    return render(request, 'accounts/profile.html', {'creator': creator})
