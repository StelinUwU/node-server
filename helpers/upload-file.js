const path = require("path");
const { v4: uuidv4 } = require("uuid");
const defaultExtensions = ["png", "jpg", "jpeg", "gif"];

const uploadFile = (
  files,
  extensionesValidas = defaultExtensions,
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const Cutname = file.name.split(".");
    const extension = Cutname[Cutname.length - 1];
    //Validar la extensión

    if (!extensionesValidas.includes(extension)) {
      return reject("Invalid extension");
    }
    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, nombreTemp);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(nombreTemp);
    });
  });
};

module.exports = {
  uploadFile,
};
