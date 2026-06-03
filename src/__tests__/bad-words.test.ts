import { describe, it, expect } from "vitest";
import { containsBadWords } from "@/lib/bad-words";

describe("containsBadWords", () => {
  it("يعترف بالنصوص العادية", () => {
    expect(containsBadWords("مرحباً كيف حالك")).toBe(false);
    expect(containsBadWords("هذا مقال جميل")).toBe(false);
    expect(containsBadWords("This is a nice post")).toBe(false);
  });

  it("يكتشف الكلمات البذيئة العربية", () => {
    expect(containsBadWords("أنت كلب")).toBe(true);
    expect(containsBadWords("يا خول")).toBe(true);
    expect(containsBadWords("هذا كلام قذر")).toBe(true);
  });

  it("يكتشف الكلمات البذيئة الإنجليزية", () => {
    expect(containsBadWords("you are an asshole")).toBe(true);
    expect(containsBadWords("fuck this")).toBe(true);
    expect(containsBadWords("what the shit")).toBe(true);
  });

  it("يكتشف التكرار", () => {
    expect(containsBadWords("fuuuuck")).toBe(true);
    expect(containsBadWords("كللللب")).toBe(true);
  });

  it("يتعامل مع النصوص الفارغة", () => {
    expect(containsBadWords("")).toBe(false);
    expect(containsBadWords("   ")).toBe(false);
    expect(containsBadWords(null as unknown as string)).toBe(false);
  });
});
