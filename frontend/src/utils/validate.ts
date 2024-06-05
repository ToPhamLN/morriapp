import * as yup from 'yup'

export const schemaTrack = yup.object().shape({
  album: yup.object().shape({
    title: yup.string().required('Vui lòng chọn album.'),
    _id: yup.string().required('Vui lòng chọn album.')
  }),
  title: yup.string().required('Vui lòng nhập tiêu đề.'),
  photo: yup
    .mixed()
    .required('Vui lòng tải ảnh lên.')
    .nullable(),
  source: yup
    .mixed()
    .required('Vui lòng tải nhạc lên.')
    .nullable(),
  duration: yup.string(),
  lyrics: yup.string(),
  artist: yup.array().of(
    yup.object().shape({
      username: yup
        .string()
        .required('Vui lòng nhập tên người dùng.'),
      _id: yup
        .string()
        .required('Vui lòng nhập giá trị người dùng.')
    })
  )
})

export const schemaUpdateTrack = yup.object().shape({
  album: yup.object().shape({
    title: yup.string().required('Vui lòng chọn album.'),
    _id: yup.string().required('Vui lòng chọn album.')
  }),
  title: yup.string().required('Vui lòng nhập tiêu đề.'),
  photo: yup.mixed().nullable(),
  source: yup.mixed().nullable(),
  duration: yup.string(),
  lyrics: yup.string(),
  artist: yup.array().of(
    yup.object().shape({
      username: yup
        .string()
        .required('Vui lòng nhập tên người dùng.'),
      _id: yup
        .string()
        .required('Vui lòng nhập giá trị người dùng.')
    })
  )
})
