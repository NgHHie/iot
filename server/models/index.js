import { Sequelize } from "sequelize";
import ThietBi from "./thietbi.js";
import CamBien from "./cambien.js";

const initModels = (sequelize) => {
  const thietbiModel = ThietBi(sequelize);
  const cambienModel = CamBien(sequelize);

  // Gán lại mô hình vào một đối tượng
  return {
    ThietBi: thietbiModel,
    CamBien: cambienModel,
  };
};

export default initModels;
