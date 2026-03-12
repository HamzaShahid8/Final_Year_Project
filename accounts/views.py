from django.shortcuts import render
from rest_framework import generics
from .serializers import RegisterSerializer, TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import *

# Create your views here.

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
class LoginView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'username':user.username,
            'email':user.email,
            'phn-no':user.phn_no,
            'role':user.role
        })
        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if not user.check_password(request.data['old_password']):
            return Response({'error': 'Wrong Password'})
        
        user.set_password(request.data['new_password'])
        user.save()
        return Response({'message': 'Password Updated'})
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                'message': 'Logout Successful'
            })
        except Exception:
            return Response({
                'error': 'Invalid Token'
            })
            
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role == 'admin' or user.role == 'receptionist':
            message = 'Welcome Admin/Receptionist'
            
        elif user.role == 'doctor':
            message = 'Welcome Doctor'
            
        elif user.role == 'patient':
            message = f"Welcome {user.username}, you are logged in as a patient"
        
        else:
            message = 'Unknown Role'
            
        return Response({
            'message': message,
            'username': user.username,
            'email': user.email,
            'role': user.role            
        })