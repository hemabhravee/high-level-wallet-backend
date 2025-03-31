import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DbConstants } from 'src/common/constants/db.constants';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true, collection: DbConstants.transaction })
export class Transaction extends AbstractEntity {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ type: Types.ObjectId, ref: DbConstants.wallet })
  walletId: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
