import { UTApi, UTFile } from "uploadthing/server"

export const utapi = new UTApi()

export async function uploadFile(file: File, customId?: string) {
  const imageFormatted = new UTFile([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
    customId
  })
  return await utapi.uploadFiles(imageFormatted)
}

export async function deleteFile(key: string) {
  return await utapi.deleteFiles(key)
}
