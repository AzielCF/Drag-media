import { expect, describe, it } from "vitest";
import { ref } from "vue";
import { useSelectVideoQuality } from "../selectVideoQuality";

describe("useSelectVideoQuality", () => {
  // Las variables son reactivas para el main por los selectores de opciones externos
  const downloadSizeMain = ref("hd");
  const mediaItemsMain = ref([
    {
      id: 123,
      video_files: [
        {
          id: 1283,
          quality: "hd",
          width: 1280,
          height: 720,
          link: "https://test.mp4",
        },
      ],
    },
  ]);

  describe("selectVideoQuality", () => {
    it("returns correct URL to params from useSelectVideoQuality", () => {
      const { selectVideoQuality } = useSelectVideoQuality(
        mediaItemsMain,
        downloadSizeMain
      );
      expect(selectVideoQuality(123)).toBe("https://test.mp4");
    });
    
    it("returns correct URL to params selectVideoQuality", () => {
      const { selectVideoQuality } = useSelectVideoQuality();
      expect(selectVideoQuality(123, mediaItemsMain, "hd")).toBe(
        "https://test.mp4"
      );
    });

    it("returns ThrowError for Number id", () => {
      const { selectVideoQuality } = useSelectVideoQuality();
      expect(() =>
        selectVideoQuality("123", mediaItemsMain, "hd")
      ).toThrowError();
    });
  });

  describe("findVideoFile", () => {
    const { findVideoFile } = useSelectVideoQuality();
    const videoFiles = [
      { height: 720, width: 3840, quality: "4kQhd" },
      { height: 720, width: 2560, quality: "qHd" },
      { height: 720, width: 1920, quality: "fullHd" },
      { height: 720, width: 1280, quality: "hd" },
      { height: 480, width: 960, quality: "sd" },
      // Archivo con orientación vertical
      { height: 1280, width: 720, quality: "vertical-hd" },
    ];

    const qualityTestCases = [
      { quality: "4kQhd", vertical: false },
      { quality: "qHd", vertical: false },
      { quality: "fullHd", vertical: false },
      { quality: "hd", vertical: false },
      { quality: "sd", vertical: false },
      { quality: "vertical-hd", vertical: true },
    ];

    qualityTestCases.forEach((testCase) => {
      const { quality, vertical } = testCase;
      // Realizamos este test para definir el tamaño minimo de sd y definir calidades
      it(`returns correct VideoFile for ${quality} quality`, () => {
        const result = findVideoFile(videoFiles, vertical, quality);
        expect(result).toBeDefined();
        expect(result.quality).toBe(quality);
      });
    });

    it("returns correct VideoFile for vertical HD quality", () => {
      const result = findVideoFile(videoFiles, true, "vertical-hd");
      expect(result).toBeDefined();
      expect(result?.quality).toBe("vertical-hd");
    });

    it("returns undefined for non-existent quality", () => {
      const result = findVideoFile(videoFiles, false, "nonexistent");
      expect(result).toBeUndefined();
    });

    it("returns undefined for vertical orientation with horizontal video", () => {
      const result = findVideoFile(videoFiles, true, "hd");
      expect(result).toBeUndefined();
    });

    it("returns ThrowError for String quality", () => {
      expect(() => findVideoFile(videoFiles, false, 561)).toThrowError();
    });
  });
});
