from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

# incoming validator       
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')
        

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])  # so it doesn;t reference the 'code' field from Room which must be unique
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')