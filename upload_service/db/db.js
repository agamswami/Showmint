import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function addVideoDetailsToDB(title, filename,description, author, url) {
 const videoData = await prisma.videoData.create({
  data: {
      title: title,
      filename: filename,
      description: description,
      author: author,
      url: url
  } })
 console.log(videoData);
 return videoData
}
