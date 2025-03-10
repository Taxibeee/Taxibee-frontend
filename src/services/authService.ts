import api from '../api/api'
import {
    LoginRequest,
    UpdatePasswordRequest,
    LoginResponse
} from '../types/auth.types'

const authService = {
    // Login function that works for both drvers and admins
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', {
            request
        })
        return response.data
    },

    // Update password
    updatePassword: async (request: UpdatePasswordRequest) => {
        const response = await api.put('/auth/update-password', {
            request
        })
        return response.data
    }
}

export default authService