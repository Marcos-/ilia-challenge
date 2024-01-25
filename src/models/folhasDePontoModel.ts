import mongoose, { Schema, Document } from 'mongoose';

interface Ponto {
  horario: string;
}

interface Expediente {
  dia: string;
  pontos: string[]; // Change to an array of strings
}

interface FolhasDePonto {
  anoMes: string;
  horasTrabalhadas: string;
  horasExcedentes: string;
  horasDevidas: string;
  expedientes: Expediente[];
}

interface FolhasDePontoModel extends FolhasDePonto, Document {}

const pontoSchema = new Schema({
  horario: {
    type: String,
    required: true,
  },
});

const expedienteSchema = new Schema({
  dia: {
    type: String,
    required: true,
  },
  pontos: {
    type: [String], // Change to an array of strings
    required: true,
  },
});

const folhasDePontoSchema = new Schema({
  anoMes: {
    type: String,
    required: true,
  },
  horasTrabalhadas: {
    type: String,
    required: true,
  },
  horasExcedentes: {
    type: String,
    required: true,
  },
  horasDevidas: {
    type: String,
    required: true,
  },
  expedientes: {
    type: [expedienteSchema],
    required: true,
  },
});

const FolhasDePontoModel = mongoose.model<FolhasDePontoModel>('FolhasDePonto', folhasDePontoSchema);

export = FolhasDePontoModel;
