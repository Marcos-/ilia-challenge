# Ilia App

## Descrição
Este é o arquivo README para o aplicativo Ilia. O aplicativo Ilia é um aplicativo JavaScript construído com Express.js e MongoDB.

## Pré-requisitos
Antes de executar o aplicativo, certifique-se de ter o seguinte instalado em sua máquina:
- Node.js (v16 ou superior)
- MongoDB

## Instalação
1. Clone o repositório:
git clone https://github.com/seu-nome-de-usuario/ilia-app.git

2. Navegue até o diretório do projeto:
cd ilia-app

3. Instale as dependências:
npm install


## Configuração
1. Crie um arquivo `.env` no diretório raiz do projeto.
2. Adicione as seguintes variáveis de ambiente ao arquivo `.env`:
PORT=3000 
MONGODB_URI=mongodb://mongodb:27017/ilia

## Executando o Aplicativo
Para executar o aplicativo localmente, use o seguinte comando:
npm run dev
ou
npm start

O aplicativo estará acessível em `http://localhost:3000`.

## Executando o Aplicativo com o Docker
Para executar o aplicativo usando o Docker, certifique-se de ter o Docker instalado em sua máquina.

1. Execute a imagem docker:
docker-compose build
docker-compose up -d

O aplicativo estará acessível em `http://localhost:3000`.

## Testes
Para executar os testes, use o seguinte comando:
npm test