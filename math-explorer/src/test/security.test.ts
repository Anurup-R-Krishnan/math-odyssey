import { describe, it, expect } from "vitest";
import { encryptData, decryptData } from "@/lib/security";

describe("Security Utils", () => {
  it("should encrypt and decrypt an object correctly", () => {
    const data = { id: 1, name: "Test User", roles: ["admin", "user"] };
    const encrypted = encryptData(data);
    expect(encrypted).not.toBe(JSON.stringify(data));
    const decrypted = decryptData(encrypted);
    expect(decrypted).toEqual(data);
  });

  it("should encrypt and decrypt a string correctly", () => {
    const data = "Hello World";
    const encrypted = encryptData(data);
    expect(encrypted).not.toBe(data);
    const decrypted = decryptData(encrypted);
    expect(decrypted).toEqual(data);
  });

  it("should handle Unicode characters correctly", () => {
    const data = { message: "👋 Hello 🌍! çñö" };
    const encrypted = encryptData(data);
    const decrypted = decryptData(encrypted);
    expect(decrypted).toEqual(data);
  });

  it("should fallback to plain JSON if decryption fails", () => {
    const data = { legacy: true };
    const plainJson = JSON.stringify(data);
    const decrypted = decryptData(plainJson);
    expect(decrypted).toEqual(data);
  });

  it("should return null for invalid data", () => {
    const invalid = "Not Valid JSON or Base64";
    const decrypted = decryptData(invalid);
    expect(decrypted).toBeNull();
  });

  it("should return null for null input", () => {
    expect(decryptData(null)).toBeNull();
  });
});
