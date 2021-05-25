const formidable = require('formidable');
const path = require('path');

module.exports = (app) => {
  app.post('/api/upload', (req, res) => {
    const destination = __dirname + '/static/uploads';
    const form = formidable({ uploadDir: destination, keepExtensions: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        console.log(error);
        res.json({ success: false });
        return;
      }

      let fileName = files.file.path.split(path.sep);
      fileName = fileName[fileName.length - 1];
      console.log('File uploaded:', fileName);

      res.json({ success: true, path: fileName });
    });
  });
};
