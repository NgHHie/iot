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
      pageSize = 10,
      sort = "",
      search = JSON.stringify({ column: "ThoiGian", input: today });
    // field = "ThoiGian";
    const cambien = await queryAllCamBien(page, pageSize, sort, search);
    // console.log(cambien);
    cambien["cambien"].forEach((item) => {
      const { NhietDo, DoAm, AnhSang, ThoiGian } = item;
      data.nhietdo.push({ GiaTri: NhietDo, ThoiGian });
      data.doam.push({ GiaTri: DoAm, ThoiGian });
      data.anhsang.push({ GiaTri: AnhSang, ThoiGian });
    });
    // console.log(data);
    return data;
  } catch (error) {
    data.status = 404;
    data.message = error.message;
    return data;
  }
};
