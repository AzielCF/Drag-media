import { Ref, computed } from "vue";

export function useGroupedMediaColumn(
  columnCount: Ref<number>,
  mediaItems: Ref<string>
) {
  const updateColumnCount = () => {
    columnCount.value = window.innerWidth > 710 ? 3 : 2;
    window.addEventListener("resize", updateColumnCount);
    return () => {
      window.removeEventListener("resize", updateColumnCount);
    };
  };

  const groupedMedia = computed(() => {
    const columns: Array<Array<any>> = Array.from(
      { length: columnCount.value },
      () => []
    );
    const totalItems = mediaItems.value?.length;

    for (let i = 0; i < totalItems; i++) {
      const columnIndex = i % columnCount.value;
      columns[columnIndex].push(mediaItems.value[i]);
    }

    return columns;
  });

  return {
    updateColumnCount,
    groupedMedia,
  };
}
