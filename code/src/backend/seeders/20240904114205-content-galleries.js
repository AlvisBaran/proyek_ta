'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.bulkInsert(
    //   'contents_galleries',
    //   [
    //     {
    //       contentRef: 1,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 3,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 4,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 5,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 6,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 7,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 8,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 9,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     },
    //     {
    //       contentRef: 10,
    //       title: 'content-1-gallery-1',
    //       alt: 'content-1-gallery-1',
    //       minio_object_name: 'content-1/gallery/image-1.jpg'
    //     }
    //   ],
    //   {}
    // )
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('contents_galleries', null, {})
  }
}
