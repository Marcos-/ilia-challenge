"use strict"

import batidasRouter from './batidas';
import folhasDePontoRouter from './folhasDePonto';

module.exports = (app: any) => {
    app.use('/v1/batidas', batidasRouter); // Use the batidas router for /v1/batidas
    app.use('/v1/folhas-de-ponto', folhasDePontoRouter); // Use the folhasDePonto router for /v1/folhas-de-ponto
}

