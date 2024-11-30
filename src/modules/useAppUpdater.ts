import { ref } from "vue";
import axios from "axios";
import packageJson from "../../package.json";

export default function useAppUpdater() {
  const newVersionAvailable = ref(false);
  const latestRelease = ref(null);
  const repo = packageJson.repository.url.split("github.com/")[1];
  const repoUrl =
    `https://api.github.com/repos/${repo}/releases`;
  const downloadPageUrl = packageJson.website ? packageJson.website : `https://github.com/${repo}/releases`;
  const localCacheKey = "latest_release";
  const localPackageVersion = ref(packageJson.version); // Versión actual desde el package.json

  const loadLocalCache = () => {
    const cachedData = localStorage.getItem(localCacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  };

  const saveLocalCache = (data: JSON) => {
    localStorage.setItem(localCacheKey, JSON.stringify(data));
  };

  const clearCacheIfVersionMatches = () => {
    const localCache = loadLocalCache();
    if (localCache && localCache.tag_name === localPackageVersion.value) {
      localStorage.removeItem(localCacheKey);
    }
  };

  const checkCacheAndUpdate = () => {
    const localCache = loadLocalCache();

    // Si hay caché y la versión coincide, usamos la caché y borramos
    if (localCache && localCache.tag_name === localPackageVersion.value) {
      newVersionAvailable.value = false;
      latestRelease.value = localCache.tag_name;
      clearCacheIfVersionMatches();
    } else if (localCache) {
      // Si hay caché pero la versión no coincide, mostrar la nueva versión
      newVersionAvailable.value = true;
      latestRelease.value = localCache.tag_name;
    }
  };

  const getLatestRelease = async () => {
    try {
      const response = await axios.get(repoUrl);
      return response.data[0];
    } catch (error) {
      console.error("Error al obtener la última release:", error);
      return null;
    }
  };

  const compareVersions = (localVersion: string, remoteVersion: string) => {
    const localParts = localVersion.split('.').map(Number);
    const remoteParts = remoteVersion.split('.').map(Number);
  
    // Compara los dos primeros números de la versión
    if (remoteParts[0] > localParts[0]) {
      return true;
    } else if (remoteParts[0] === localParts[0] && remoteParts[1] > localParts[1]) {
      return true;
    }
    
    return false;
  };
  
  const checkForUpdates = async () => {
    const localCache = loadLocalCache();
    
    // Si no hay caché, hacemos la solicitud
    if (!localCache) {
      const latestReleaseData = await getLatestRelease();
  
      // Si hay una nueva versión y es mayor en los dos primeros números, guardamos en caché
      if (
        latestReleaseData &&
        compareVersions(localPackageVersion.value, latestReleaseData.tag_name)
      ) {
        newVersionAvailable.value = true;
        latestRelease.value = latestReleaseData.tag_name;
        saveLocalCache(latestReleaseData); // Guardar la nueva versión en caché
      } else {
        newVersionAvailable.value = false;
      }
    } else {
      // Usamos la caché si ya existe
      checkCacheAndUpdate();
    }
  };
  
/*
  onMounted(() => {
    checkForUpdates();
  });
*/
  return {
    newVersionAvailable,
    latestRelease,
    localPackageVersion,
    downloadPageUrl,
    checkForUpdates,
    checkCacheAndUpdate
  }
}
