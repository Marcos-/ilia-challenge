import express, { Router, Request, Response, NextFunction } from 'express';
import BatidaModel from '../models/batidasModel';
import FolhasDePontoModel from '../models/folhasDePontoModel';
import {calculateWorkedHours} from '../lib/utils';
import moment from 'moment';
const router: Router = express.Router();

type Expediente = {
  dia: string;
  pontos: string[];
}

// Route for POST /v1/batidas
router.post('/', async function(req: Request, res: Response, next: NextFunction) {

  try {
    const { momento } = await req.body;
    if (!momento) {
      return res.status(400).json({ message: 'Campo obrigatório não informado', error: 400 });
    }

    const parsedMoment = moment(momento, 'YYYY-MM-DDTHH:mm:ss', true); // Adjust the format based on your actual format
    if (!parsedMoment.isValid()) {
      return res.status(400).json({ message: 'Data e hora em formato inválido', error: 400 });
    }

    // Check if the given date is a weekend
    if (parsedMoment.day() === 0 || parsedMoment.day() === 6) {
      return res.status(400).json({ message: "Sábado e domingo não são permitidos como dia de trabalho", error: 400 });
    }

    // Check if there is already a registry for the given date
    const anoMes = parsedMoment.format('YYYY-MM');
    const folhaDePonto = await FolhasDePontoModel.findOne({ anoMes: anoMes });
    if (!folhaDePonto) {
      const exp = {
        dia: parsedMoment.format('YYYY-MM-DD'),
        pontos: [parsedMoment.format('HH:mm:ss')],
      } as Expediente;
      await FolhasDePontoModel.create({
        anoMes: anoMes,
        horasTrabalhadas: 'PT0H',
        horasExcedentes: 'PT0H',
        horasDevidas: 'PT0H',
        expedientes: [exp],
      });
      console.log(`Folha de ponto criada para o mês ${anoMes}`);
      return res.status(201).json({ exp });
    } 

    // Check if there are already 4 points for the given date
    const exp = folhaDePonto.expedientes.find((exp: Expediente) => exp.dia === parsedMoment.format('YYYY-MM-DD'));

    if (exp && exp.pontos && exp.pontos.length > 3) {
      return res.status(400).json({ message: 'Apenas 4 horários podem ser registrados por dia', error: 400 });
    }

    // Check if the given time is already registered
    if (exp?.pontos && exp?.pontos.includes(parsedMoment.format('HH:mm:ss'))) {
      return res.status(400).json({ message: 'Horário já registrado', error: 409 });
    }
    
    if (exp) {
      exp.pontos.push(parsedMoment.format('HH:mm:ss'));
      await folhaDePonto.save();
      console.log(`Batida registrada para o dia ${parsedMoment.format('YYYY-MM-DD')}`);
    } else {
      const newExp = {
        dia: parsedMoment.format('YYYY-MM-DD'),
        pontos: [parsedMoment.format('HH:mm:ss')],
      } as Expediente;
      folhaDePonto.expedientes.push(newExp);
      await folhaDePonto.save();
      console.log(`Batida registrada para o dia ${parsedMoment.format('YYYY-MM-DD')}`);
    }
    
    // Calculate worked hours if there are 4 points for the given date
    if (exp?.pontos.length === 4) {
      const horasTrabalhadas = calculateWorkedHours(anoMes, exp?.pontos as string[]);
      const somaHorasTrabalhadas = moment.duration(horasTrabalhadas).add(moment.duration(folhaDePonto.horasTrabalhadas));
      folhaDePonto.horasTrabalhadas = somaHorasTrabalhadas.toISOString();

      // Check if it excedes 8 hours
      if ( moment.duration(horasTrabalhadas) > moment.duration('PT8H')) {
        const horasExcedentes =  moment.duration(horasTrabalhadas).subtract(moment.duration('PT8H'));
        const somaHorasExcedentes = moment.duration(horasExcedentes).add(moment.duration(folhaDePonto.horasExcedentes));
        folhaDePonto.horasExcedentes = somaHorasExcedentes.toISOString();
      }
      // Check if it is less than 8 hours
      if ( moment.duration(horasTrabalhadas) < moment.duration('PT8H')) {
        const horasDevidas = moment.duration('PT8H').subtract( moment.duration(horasTrabalhadas));
        const somaHorasDevidas = moment.duration(horasDevidas).add(moment.duration(folhaDePonto.horasDevidas));
        folhaDePonto.horasDevidas = somaHorasDevidas.toISOString();

      }

      await folhaDePonto.save();
      console.log(`Horas trabalhadas: ${horasTrabalhadas}`);
    }

    // Respond with the saved Batida data
    return res.status(201).json(folhaDePonto);
  } catch (error) {
    console.error(error);
    if (error === "Invalid lunch break") {
      return res.status(400).json({ message: 'Deve haver no mínimo 1 hora de almoço', error: 400 });
    }
    return res.status(500).json({ message: 'Erro ao registrar batida', error: 500 });
  }

});

export = router;
