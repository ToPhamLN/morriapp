import BiosModel from '~/models/bios.models'
import { v2 as cloudinary } from 'cloudinary'
import { Request, Response, NextFunction } from 'express'

export const getBios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idArtist } = req.params
    let bios = await BiosModel.findOne({ artist: idArtist })
    if (!bios) {
      bios = new BiosModel({ artist: idArtist })
      await bios.save()
    }
    res.status(200).json(bios)
  } catch (error) {
    next(error)
  }
}

export const updateBios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRole } = req.auth
    const { content, birthday, links, photosOld } = req.body

    const existBios = await BiosModel.findOne({ artist: idRole })
    if (!existBios) throw new Error('Không tìm thấy tiểu sử này')
    const existPhoto = existBios?.photos

    let convertLinks: ILinks[] = []
    let photos: IImage[] = []
    let deletePhotos: IImage[] = []
    if (links) {
      convertLinks = JSON.parse(links)
    }

    if (req.files) {
      const files = req.files as Express.Multer.File[]
      photos = files.map((file) => ({
        path: file.path,
        fileName: file.filename
      }))
    }

    if (photosOld) {
      const photoOldConvert: IImage[] = JSON.parse(photosOld)
      deletePhotos =
        existPhoto?.filter(
          (existingPhoto) =>
            !photoOldConvert.some(
              (oldPhoto) =>
                oldPhoto?.fileName === existingPhoto?.fileName
            )
        ) || []
      photos = [...photoOldConvert, ...photos]
    }

    const newBios = {
      content: content,
      birthday: birthday,
      links: convertLinks,
      photos: photos
    }

    const updatedBios = await BiosModel.findOneAndUpdate(
      { artist: idRole },
      { $set: newBios },
      { new: true }
    )
    if (!updatedBios) {
      throw new Error('Không thể cập nhập.')
    }

    for (const file of deletePhotos)
      if (file?.fileName)
        await cloudinary.uploader.destroy(file.fileName)

    res.status(200).json({
      message: 'Cập nhập thành công.'
    })
  } catch (error) {
    if (req.files) {
      const files = req.files as Express.Multer.File[]
      for (const file of files) {
        await cloudinary.uploader.destroy(file.filename)
      }
    }
    next(error)
  }
}
