import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { DbConstants } from 'src/common/constants/db.constants';
import { WalletSchema } from './entities/wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DbConstants.wallet,
        schema: WalletSchema,
      },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletRepository],
})
export class WalletModule {}
