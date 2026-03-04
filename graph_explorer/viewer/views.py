from django.http import JsonResponse
from django.shortcuts import render


def index(request):
    """Main page"""
    return render(request, 'index.html', {'message': 'Radi. Ovo je samo test prikaz.'})

def list_plugins(request):
    # Ovo treba da dobiješ iz platforme
    plugins = [
        "JSON Plugin",
        "CSV Plugin", 
        "XML Plugin",
        "RDF Plugin"
    ]
    
    return JsonResponse(plugins, safe=False)  # safe=False dozvoljava listu umesto dict