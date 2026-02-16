import type { Asset } from "~/interfaces/asset.interface";

export const useAssetStore = defineStore('asset', () => {
    const assets: Ref<Asset[]> = ref<Asset[]>([]);

    return {
        assets
    }
})