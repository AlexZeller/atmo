const express = require('express')
const app = express()
const path = require('path');
const https = require('https')
const fs = require('fs')
const port = 443

app.use(express.static(path.join(__dirname, '../atmo-ui/dist')));

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certificates/atmo.local.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates/atmo.local.crt'))
}
const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port)
    })