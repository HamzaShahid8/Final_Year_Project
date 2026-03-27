from rest_framework.permissions import BasePermission

class IsAdminOrReceptionist(BasePermission):
    message = "Only Admin or Receptionist can perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['admin','receptionist'])
    
class IsDoctor(BasePermission):
    def has_permission(self, request, view):    
        return request.user.role == 'doctor'
    
class IsNurse(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "nurse"
    
class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "patient"
    
class IsPharmacist(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'pharmacist'
    
class IsLabTechnician(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'lab_technician'