import { inflateRawSync } from "node:zlib"

export function extractZipEntry(zipBuffer: Buffer, fileName: string): string {
  const eocdSignature = 0x06054b50
  let eocdOffset = -1
  for (
    let i = zipBuffer.length - 22;
    i >= Math.max(0, zipBuffer.length - 65536);
    i--
  ) {
    if (zipBuffer.readUInt32LE(i) === eocdSignature) {
      eocdOffset = i
      break
    }
  }
  if (eocdOffset === -1) throw new Error("ZIP Error")
  const centralDirectoryOffset = zipBuffer.readUInt32LE(eocdOffset + 16)
  const totalEntries = zipBuffer.readUInt16LE(eocdOffset + 10)
  let offset = centralDirectoryOffset
  for (let i = 0; i < totalEntries; i++) {
    const fileNameLength = zipBuffer.readUInt16LE(offset + 28)
    const localHeaderOffset = zipBuffer.readUInt32LE(offset + 42)
    const entryName = zipBuffer
      .subarray(offset + 46, offset + 46 + fileNameLength)
      .toString("utf8")
      .toLowerCase()
    if (entryName.endsWith(fileName)) {
      const compMethod = zipBuffer.readUInt16LE(offset + 10)
      const compSize = zipBuffer.readUInt32LE(offset + 20)
      const nameLen = zipBuffer.readUInt16LE(localHeaderOffset + 26)
      const extraLen = zipBuffer.readUInt16LE(localHeaderOffset + 28)
      const dataStart = localHeaderOffset + 30 + nameLen + extraLen
      const data = zipBuffer.subarray(dataStart, dataStart + compSize)
      return compMethod === 8
        ? inflateRawSync(data).toString("utf8")
        : data.toString("utf8")
    }
    offset +=
      46 +
      fileNameLength +
      zipBuffer.readUInt16LE(offset + 30) +
      zipBuffer.readUInt16LE(offset + 32)
  }
  throw new Error(fileName)
}
