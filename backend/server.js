const { app } = require('./index');

portVal = process.env.PORT || 3000
server = app.listen(portVal, () => {
});