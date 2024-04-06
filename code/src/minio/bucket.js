// ! Ini adalah file coba"
// TODO: Coba untuk pake cara next 14 dengan pipeline dari stream
// TODO: Klo ga bsa baru pake cara next 12/13 yang pake multer

// ** Kurang lebih step nya:
// *  - Ambil file dari form data
// *  - File nya di masukin ke temp folder
// *  - Klo sukses file nya dijadiin stream pake fs
// *  - Trus pake minio client (putObject) nya untuk masukin file ke cloud
// *  - Klo minio uploadnya sukses hapus file temp nya tadi

import { minioClient } from './config'
// import { pipeline } from 'stream'

const currBucket = process.env.NEXT_PUBLIC_MINIO_BUCKET ?? 'bucket-01'

minioClient.bucketExists(currBucket, function (err, exists) {
  if (err) {
    return console.log(err)
  }
  if (exists) {
    return console.log('Bucket exists.')
  }
})
