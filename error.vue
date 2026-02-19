<script setup lang="ts">
const props = defineProps({
    error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <div
        class="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 font-sans ring-1 ring-gray-800">
        <div class="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <!-- Icon / Illustration Area -->
            <div class="relative flex justify-center">
                <div class="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                <div
                    class="relative w-24 h-24 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Icon name="lucide:alert-triangle" class="w-12 h-12 text-red-400" />
                </div>
            </div>

            <!-- Error Content -->
            <div class="space-y-3">
                <h1 class="text-7xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                    {{ error?.statusCode || '500' }}
                </h1>
                <h2 class="text-2xl font-bold tracking-tight">
                    {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
                </h2>
                <p class="text-gray-400 leading-relaxed">
                    {{ error?.message || 'We apologize for the inconvenience. Our team has been notified and is working
                    to fix the issue.' }}
                </p>
            </div>

            <!-- Action Button -->
            <div class="pt-4">
                <Button @click="handleError"
                    class="!bg-white !text-gray-950 !border-none !px-8 !py-3 !rounded-xl !font-bold hover:!bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:arrow-left" class="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </div>
                </Button>
            </div>

            <!-- Technical Details (Hidden by default, can be toggled if needed) -->
            <div v-if="process.dev"
                class="mt-8 text-left bg-gray-900/50 p-4 rounded-lg border border-gray-800 overflow-auto max-h-40">
                <p class="text-xs font-mono text-gray-500 leading-none mb-2 uppercase tracking-widest">Stack Trace (Dev
                    Only)</p>
                <div class="text-[10px] font-mono text-gray-600 whitespace-pre">
                    {{ error?.stack }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes zoom-in {
    from {
        transform: scale(0.95);
    }

    to {
        transform: scale(1);
    }
}

.animate-in {
    animation-fill-mode: both;
}
</style>
