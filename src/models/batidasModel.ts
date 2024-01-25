import mongoose, { Schema, Document } from 'mongoose';

interface Batida {
  momento: string;
}

interface BatidaModel extends Batida, Document {}

const batidaSchema = new Schema({
  momento: {
    type: String,
    required: true,
  },
});

const BatidaModel = mongoose.model<BatidaModel>('Batida', batidaSchema);

export = BatidaModel;
