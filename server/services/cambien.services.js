import { models, sequelize } from "../config/connectDB.js";
import { Op } from "sequelize";

export const queryAllCamBien = async (page, pageSize, sort, search, field) => {
  // Generate sort format for Sequelize
  const generateSort = () => {
    const sortParsed = JSON.parse(sort);
    sortParsed.field = sortParsed.field || "ThoiGian";
    const sortFormatted = {
      [sortParsed.field]: sortParsed.sort === "asc" ? "ASC" : "DESC",
    };
    return sortFormatted;
  };

  const sortFormatted = Boolean(sort) ? generateSort() : { ThoiGian: "DESC" }; // Default sort by ThoiGian

  // Build search condition based on the specified field
  const searchCondition = search
    ? field === "all"
      ? {
          [Op.or]: [
            {
              MaCamBien: {
                [Op.eq]: isNaN(parseInt(search, 10))
                  ? null
                  : parseInt(search, 10),
              },
            },
            {
              NhietDo: {
                [Op.eq]: isNaN(parseFloat(search)) ? null : parseFloat(search),
              },
            },
            {
              DoAm: {
                [Op.eq]: isNaN(parseFloat(search)) ? null : parseFloat(search),
              },
            },
            {
              AnhSang: {
                [Op.eq]: isNaN(parseFloat(search)) ? null : parseFloat(search),
              },
            },
            sequelize.where(
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("ThoiGian"),
                "%Y-%m-%d %H:%i:%s"
              ),
              { [Op.like]: `%${search}%` } // ThoiGian là date, so sánh theo định dạng
            ),
          ],
        }
      : {
          [field]: (() => {
            if (field === "MaCamBien") {
              return {
                [Op.eq]: isNaN(parseInt(search, 10))
                  ? null
                  : parseInt(search, 10),
              }; // So sánh int
            } else if (field === "NhietDo") {
              return {
                [Op.eq]: isNaN(parseFloat(search)) ? null : parseFloat(search),
              };
            } else if (field === "DoAm") {
              return {
                [Op.eq]: isNaN(parseFloat(search)) ? null : parseFloat(search),
              };
            } else if (field === "AnhSang") {
              return {
                [Op.eq]: isNaN(parseFloat(search)) ? null : parseFloat(search),
              };
            } else if (field === "ThoiGian") {
              return sequelize.where(
                sequelize.fn(
                  "DATE_FORMAT",
                  sequelize.col("ThoiGian"),
                  "%Y-%m-%d %H:%i:%s"
                ),
                { [Op.like]: `%${search}%` }
              ); // So sánh date
            }
            return {};
          })(),
        }
    : {};
  const total = await models.CamBien.count({
    where: searchCondition,
  });
  // Fetch thietbi records with pagination and sorting
  const cambien = await models.CamBien.findAll({
    where: searchCondition,
    order: [[Object.keys(sortFormatted)[0], Object.values(sortFormatted)[0]]],
    offset: (page - 1) * pageSize,
    limit: parseInt(pageSize, 10),
  });

  console.log(cambien);
  const data = { cambien: cambien, total: total };
  return data;
};

export const getAllCamBien = async (req) => {
  let data = {};
  try {
    const {
      page = 1,
      pageSize = 20,
      sort = null,
      search = "",
      field = "all",
    } = req.query;

    const { cambien = [], total = 0 } = await queryAllCamBien(
      page,
      pageSize,
      sort,
      search,
      field
    );

    data = { status: 200, cambien, total };
  } catch (error) {
    data = { status: 404, message: error.message };
  }
  return data;
};

export const postDataCamBien = async (data) => {
  try {
    const res = await models.CamBien.create(data);
  } catch (error) {}
};
