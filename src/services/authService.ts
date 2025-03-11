import api from '../api/api'
import {
    LoginRequest,
    UpdatePasswordRequest,
    LoginResponse
} from '../types/auth.types'

const authService = {
    // Login function that works for both drvers and admins
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        console.log('Login function called');
        const response = await api.post<LoginResponse>('/auth/login', {
            "username": request.username,
            "password": request.password,
            "role": request.role
        })
        console.log('Login response:', response.data);
        return response.data
    },

    // Update password
    updatePassword: async (request: UpdatePasswordRequest) => {
        const response = await api.put('/auth/update-password', {
            "old_password": request.oldPassword,
            "new_password": request.newPassword
        })
        return response.data
    }
}

export default authService