import { models, sequelize } from "../config/connectDB.js";
import { Op } from "sequelize";
import { queryAllCamBien } from "./cambien.services.js";
// import { getAllThietBi } from "./thietbi.services.js";

export const getDataDashBoard = async (req) => {
  const data = { status: 200, nhietdo: [], doam: [], anhsang: [] };

  try {
    let date = new Date();
    date.setHours(date.getHours() + 7);
    const today = date.toISOString().split("T")[0];
    const page = 1,
      pageSize = 20,
      sort = "",
      search = today,
      field = "ThoiGian";
    const cambien = await queryAllCamBien(page, pageSize, sort, search, field);
    // console.log(cambien);
    cambien["cambien"].forEach((item) => {
      const { NhietDo, DoAm, AnhSang, ThoiGian } = item;
      data.nhietdo.push({ NhietDo, ThoiGian });
      data.doam.push({ DoAm, ThoiGian });
      data.anhsang.push({ AnhSang, ThoiGian });
    });
    // console.log(data);
    return data;
  } catch (error) {
    data.status = 404;
    return data;
  }
};
