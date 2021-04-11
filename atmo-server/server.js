const express = require('express')
const app = express()
const path = require('path');
const port = 80

app.use(express.static(path.join(__dirname, '../atmo-ui/dist')));

app.listen(port, () => {
    console.log('server running at ' + port)
})