// import {
//   MongooseModuleOptions,
//   MongooseOptionsFactory,
// } from '@nestjs/mongoose';

// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class MongooseConfigService implements MongooseOptionsFactory {
//   createMongooseOptions(): MongooseModuleOptions {
//     console.log('xxx', {
//       uri: process.env.DATABASE_HOST,
//       dbName: process.env.DATABASE_NAME,
//       user: process.env.DATABASE_USERNAME,
//       pass: process.env.DATABASE_PASSWORD,
//       retryAttempts: 5,
//     });
//     return {
//       uri: process.env.DATABASE_HOST,
//       dbName: process.env.DATABASE_NAME,
//       user: process.env.DATABASE_USERNAME,
//       pass: process.env.DATABASE_PASSWORD,
//       retryAttempts: 5,
//     };
//   }
// }
