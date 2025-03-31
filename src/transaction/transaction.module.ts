import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { DbConstants } from 'src/common/constants/db.constants';
import { TransactionSchema } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DbConstants.transaction,
        schema: TransactionSchema,
      },
    ]),
    WalletModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
