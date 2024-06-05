// import React, { useEffect } from 'react'
// import {
//   setList,
//   setTrack,
//   setWaitingList
// } from '~/reduxStore/trackPlaySlice'
// import { useAppDispatch, useAppSelector } from '~/hooks'
// import {
//   reverseSuffle,
//   sortPlayList,
//   findTrack
// } from '~/utils/array'
// import {
//   setProfile,
//   updateProfile
// } from '~/reduxStore/profileSlice'

// const HomePage: React.FC = () => {
//   const dispatch = useAppDispatch()
//   const { mode, waitingList, track, list } = useAppSelector(
//     (state) => state.trackPlay
//   )
//   const handleChooseTrack = (
//     music: TrackType,
//     playList: PlayListType
//   ) => {
//     if (track == music && playList == list) return
//     dispatch(setList(playList))
//     dispatch(setTrack(music))
//     const indexTrack: number = findTrack(
//       music.name,
//       playList
//     )
//     const newArr = sortPlayList(indexTrack, playList)
//     if (mode.isSuffle) {
//       const newList = reverseSuffle(newArr)
//       dispatch(setWaitingList(newList))
//     } else {
//       dispatch(setWaitingList(newArr))
//     }
//   }
//   const profile = useAppSelector((state) => state.profile)
//   useEffect(() => {
//     console.log(profile)
//   }, [profile])
//   const handleDis = () => {
//     dispatch(
//       setProfile({
//         _id: 'string',
//         email: 'string',
//         role: 'string',
//         accessToken: 'string',
//         username: 'string',
//         avatar: 'string',
//         idRole: 'string'
//       })
//     )
//   }
//   return (
//     <div>
//       <div className='playlist'>
//         <button onClick={handleDis}>helll</button>
//         <h1>play list 1</h1>
//         {playList1.map((list) => (
//           <div key={list.name} className='itemlist'>
//             <span className='name'>{list.name}</span>
//             <button
//               onClick={() =>
//                 handleChooseTrack(list, playList1)
//               }
//             >
//               chọn
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className='playlist'>
//         <h1>play list 1</h1>
//         {playList1.map((list) => (
//           <div key={list.name} className='itemlist'>
//             <span className='name'>{list.name}</span>
//             <button
//               onClick={() =>
//                 handleChooseTrack(list, playList1)
//               }
//             >
//               chọn
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className='playlist'>
//         <h1>play list 1</h1>
//         {playList1.map((list) => (
//           <div key={list.name} className='itemlist'>
//             <span className='name'>{list.name}</span>
//             <button
//               onClick={() =>
//                 handleChooseTrack(list, playList1)
//               }
//             >
//               chọn
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className='playlist'>
//         <h1>play list 1</h1>
//         {playList1.map((list) => (
//           <div key={list.name} className='itemlist'>
//             <span className='name'>{list.name}</span>
//             <button
//               onClick={() =>
//                 handleChooseTrack(list, playList1)
//               }
//             >
//               chọn
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className='playlist'>
//         <h1>play list 1</h1>
//         {playList1.map((list) => (
//           <div key={list.name} className='itemlist'>
//             <span className='name'>{list.name}</span>
//             <button
//               onClick={() =>
//                 handleChooseTrack(list, playList1)
//               }
//             >
//               chọn
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className='playlist'>
//         <h1>play list 2</h1>
//         {playList2.map((list) => (
//           <div key={list.name} className='itemlist'>
//             <span className='name'>{list.name}</span>
//             <button
//               onClick={() =>
//                 handleChooseTrack(list, playList2)
//               }
//             >
//               chọn
//             </button>
//           </div>
//         ))}
//         <div className='waitinglist'>
//           <h2>Waiting LIST</h2>
//           {waitingList.map((list) => (
//             <div key={list.name} className='itemlist'>
//               <span className='name'>{list.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HomePage
// const playList1: PlayListType = [
//   {
//     name: 'audio 1 audio 1audio 1audio 1',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio1.mp3',
//       filename: 'e'
//     }
//   },

//   {
//     name: 'audio2',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio2.mp3',
//       filename: 'e'
//     }
//   },
//   {
//     name: 'audio3',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio3.mp3',
//       filename: 'e'
//     }
//   },
//   {
//     name: 'audio4',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio4.mp3',
//       filename: 'e'
//     }
//   },
//   {
//     name: 'audio5',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio5.mp3',
//       filename: 'e'
//     }
//   }
// ]

// const playList2: PlayListType = [
//   {
//     name: 'audio 2',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio2.mp3',
//       filename: 'e'
//     }
//   },
//   {
//     name: 'audio3',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio3.mp3',
//       filename: 'e'
//     }
//   },
//   {
//     name: 'audio6',
//     artist: {
//       name: 'vũ'
//     },
//     src: {
//       path: '/src/assets/audio6.mp3',
//       filename: 'e'
//     }
//   }
// ]

// import React, { useState } from 'react'

// function MP3Downloader() {
//   const [downloading, setDownloading] = useState(false)

//   const downloadMP3 = () => {
//     const url =
//       'https://res.cloudinary.com/dohywtebw/video/upload/v1710938851/demo/audio1_t8oxrs.mp3'
//     const filename = 'audio.mp3'

//     setDownloading(true)

//     fetch(url)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = filename
//         document.body.appendChild(a)
//         a.click()
//         document.body.removeChild(a)
//         window.URL.revokeObjectURL(url)
//         setDownloading(false)
//       })
//       .catch((error) => {
//         console.error('Lỗi khi tải file:', error)
//         setDownloading(false)
//       })
//   }

//   return (
//     <div>
//       <button onClick={downloadMP3} disabled={downloading}>
//         {downloading ? 'Đang tải...' : 'Tải File MP3'}
//       </button>
//     </div>
//   )
// }

// export default MP3Downloader
