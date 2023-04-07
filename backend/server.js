const { app } = require('./index');

portVal = process.env.PORT || 3001
server = app.listen(portVal, () => {
});