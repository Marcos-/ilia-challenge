import express, { Express, Request, Response , Application } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import mongoose, { ConnectOptions } from 'mongoose'
import bodyParser from 'body-parser'

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Mongoose connection
mongoose.connect('mongodb://mongodb:27017/mongodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}as ConnectOptions)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

var jsonParser = bodyParser.json()
app.use(jsonParser)

// Define routes
require('./api/route')(app)

app.get('/', (req: Request, res: Response) => {
  res.send('Ília - Desafio Técnico \nDesafio técnico enviado à candidatos para posições de desenvolvedor da Ília.');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

export default app;