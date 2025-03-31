import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DbConstants } from 'src/common/constants/db.constants';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { formatNumberWithCommas } from 'src/common/utils/string.utils';
import {
  MAX_BALANCE,
  MIN_BALANCE,
} from 'src/common/constants/business.constants';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ timestamps: true, collection: DbConstants.wallet })
export class Wallet extends AbstractEntity {
  @Prop({
    name: 'balance',
    required: true,
    default: MIN_BALANCE,
    validate: {
      validator: function (v) {
        return v <= MAX_BALANCE; // Example: 1,000,000 max balance
      },
      message: (props) =>
        `${
          props.value
        } exceeds the maximum allowed balance of ${formatNumberWithCommas(
          MAX_BALANCE,
        )}`,
    },
  })
  balance: number;

  @Prop({ name: 'name', required: true, unique: true })
  name: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({ name: 1 }, { unique: true });
