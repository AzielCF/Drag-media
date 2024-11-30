import { Ref, computed } from "vue";

export function useGroupedMediaColumn(
  searchMedia: (isFromInput?: boolean) => Promise<void>,
  columnCount: Ref<number>,
  mediaItems: Ref<any[]>
) {
  const updateColumnCount = () => {
    columnCount.value = window.innerWidth > 710 ? 3 : 2;
    window.addEventListener("resize", updateColumnCount);
    return () => {
      window.removeEventListener("resize", updateColumnCount);
    };
  };

  let reloadAttempts = 0; // Contador de intentos de recarga
  const maxReloads = 5 // Máximo número de recargas permitido
  
  const groupedMedia = computed(() => {
    const seen = new Set(); // Para rastrear elementos únicos
    const uniqueItems = mediaItems.value.filter((item) => {
      const identifier = item.id || item; // Usa `item.id` si existe, o el objeto en sí.
      if (seen.has(identifier)) {
        return false; // Duplicado, lo descartamos
      }
      seen.add(identifier);
      return true; // No es duplicado, lo incluimos
    });
  
    const columns: Array<Array<any>> = Array.from(
      { length: columnCount.value },
      () => []
    );
  
    const totalItems = uniqueItems.length;
  
    if (totalItems === 0) return columns;
  
    // Condición de recarga con límite de intentos
    if (reloadAttempts < maxReloads) {
      const needsMoreItems =
        (window.innerWidth <= 1440 && totalItems < 18) ||
        (window.innerWidth > 1440 && totalItems < 25);
  
      if (needsMoreItems) {
        reloadAttempts++;
        searchMedia();
        updateColumnCount();
      }
    }
  
    for (let i = 0; i < totalItems; i++) {
      const columnIndex = i % columnCount.value;
      columns[columnIndex].push(uniqueItems[i]);
    }
  
    return columns;
  });
  

  return {
    updateColumnCount,
    groupedMedia,
  };
}
