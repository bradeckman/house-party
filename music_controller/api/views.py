from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse



# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'
    
    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if room_result.exists():
                room = room_result.first()
                data = RoomSerializer(room).data
                data['is_host'] = self.request.session.session_key == room.host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
        
    
class CreateRoomView(APIView):
    
    serializer_class = CreateRoomSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            votes_threshold = serializer.data.get('votes_threshold')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.votes_threshold = votes_threshold
                room.save(update_fields=['votes_threshold'])
            else:
                room = Room(host=host, votes_threshold=votes_threshold)
                room.save()

            self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    
    
class JoinRoom(APIView):
    
    lookup_url_kwarg = 'code'
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if room_result.exists():
                room = room_result.first()
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
        
            return Response({'Bad Request: Invalid room code'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Bad Request: Invalid POST data, did not find code key'}, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')  #will return None if user not in Room
        }
        
        return JsonResponse(data, status=status.HTTP_200_OK)
        
    
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
    

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer
    
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            votes_threshold = serializer.data.get('votes_threshold')
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'message': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
            room = queryset.first()
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'message': 'User is not the host of the provided room'}, status=status.HTTP_403_FORBIDDEN)
            room.votes_threshold = votes_threshold
            room.save(update_fields=['votes_threshold'])
            print(RoomSerializer(room).data)
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            

        return Response({'Bad Request': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)
                

