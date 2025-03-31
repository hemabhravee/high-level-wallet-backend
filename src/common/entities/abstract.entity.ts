import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class AbstractEntity {
  _id: Types.ObjectId;

  @Prop()
  readonly createdAt: Date;
  @Prop()
  readonly updatedAt: Date;

  __v: number;
}
