export function hashToIntRange(
  input: string,
  min: number,
  max: number,
): number {
  if (min > max) {
    [min, max] = [max, min]; // Tự hoán vị nếu min lớn hơn max
  }

  // Thuật toán FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  const unsignedHash = hash >>> 0;
  const rangeSize = max - min + 1;

  // Lấy dư theo rangeSize rồi cộng min
  return (unsignedHash % rangeSize) + min;
}
