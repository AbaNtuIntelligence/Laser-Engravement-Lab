from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def status(request):
    return Response({
        "status": "online",
        "service": "Laser Engraving Store API",
        "version": "1.0.0",
    })