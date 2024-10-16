import { Sequelize } from "sequelize";
import ThietBi from "./thietbi.js";
import CamBien from "./cambien.js";
import CanhBao from "./canhbao.js";

const initModels = (sequelize) => {
  const thietbiModel = ThietBi(sequelize);
  const cambienModel = CamBien(sequelize);
  const canhbaoModel = CanhBao(sequelize);

  // Gán lại mô hình vào một đối tượng
  return {
    ThietBi: thietbiModel,
    CamBien: cambienModel,
    CanhBao: canhbaoModel,
  };
};

export default initModels;
