import express, { Router, Request, Response, NextFunction } from 'express';
import FolhasDePontoModel from '../models/folhasDePontoModel';
import {calculateWorkedHours} from '../lib/utils';
const router: Router = express.Router();

// Route for GET /v1/folhas-de-ponto/:anoMes
router.get('/:anoMes', async function(req: Request, res: Response, next: NextFunction) {
  const anoMes = req.params.anoMes;
  const [ano, mes] = anoMes.split('-');

  if (ano.length !== 4 || mes.length !== 2) {
    return res.status(400).json({ message: 'Formato de anoMes inválido', error: 400 });
  }
  if (mes < '01' || mes > '12') {
    return res.status(400).json({ message: 'Mês inválido', error: 400});
  }
  if (ano < '1900' || ano > '2024') {
    return res.status(400).json({ message: 'Ano inválido', error: 400});
  }

  try {
    const folhaDePonto = await FolhasDePontoModel.findOne({ anoMes: anoMes });
    if (!folhaDePonto) {
      return res.status(404).json({ message: 'Relatório não encontrado', error: 404});
    }



    return res.status(200).json(folhaDePonto);

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Erro ao consultar folha de ponto', error: 500 });
  }

  res.status(200).json({ message: `Folha de ponto do mês ${mes} do ano ${ano}` });
});

// Route for POST /v1/folhas-de-ponto/populate with JWT authentication
router.post('/populate', async function(req: Request, res: Response) {
  try {
    // Mock data for testing
    const mockFolhasDePonto = {
      anoMes: '2022-01',
      horasTrabalhadas: 'PT80H',
      horasExcedentes: 'PT10H',
      horasDevidas: 'PT5H',
      expedientes: [
        {
          dia: '2022-01-01',
          pontos: ['09:00:00', '12:00:00', '13:00:00', '18:00:00'],
        },
        {
          dia: '2022-01-02',
          pontos: ['08:30:00', '12:30:00', '13:30:00', '17:30:00'],
        },
        // Add more mock expedientes as needed
      ],
    };

    // Save the mock FolhasDePonto data to MongoDB
    const folhasDePonto = new FolhasDePontoModel(mockFolhasDePonto);
    const savedFolhasDePonto = await folhasDePonto.save();

    res.status(200).json(savedFolhasDePonto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export = router;
