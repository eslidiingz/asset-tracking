import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // เช็คสถานะการ Login (ตอนนี้ใช้ useCookie ใน Store แล้ว ทำให้ Server และ Client เห็นตรงกัน)
    const isLoggedIn = authStore.isAuthenticated

    // 1. ถ้า Login แล้ว และกำลังจะไปหน้า Login ให้กลับไปหน้า index
    if (isLoggedIn && to.path === '/login') {
        return navigateTo('/')
    }

    // 2. ถ้ายังไม่ได้ Login และกำลังจะไปหน้าอื่นที่ไม่ใช่หน้า Login ให้ไปหน้า Login
    if (!isLoggedIn && to.path !== '/login') {
        return navigateTo('/login')
    }
})
