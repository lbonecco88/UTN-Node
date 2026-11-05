import os from "node:os";

const getOSName = () => {
  return `Sistema operativo: ${os.platform()} ${os.type()}`;
};

const getOSTotalMem = () => {
  return `Memoria total: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`;
};

export { getOSName, getOSTotalMem };
