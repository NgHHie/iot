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
  const generateSearch = () => {
    const searchParsed = JSON.parse(search);
    // searchParsed.column = searchParsed.column || "ThoiGian";
    if (!Object.keys(searchParsed).includes("input")) {
      return null;
    } else if (!Object.keys(searchParsed).includes("column")) {
      searchParsed.column = "all";
    }
    return Object.keys(searchParsed).length ? searchParsed : null;
  };

  const searchFormatted = generateSearch();
  console.log("search: ");
  // Build search condition based on the specified field
  const searchCondition = searchFormatted
    ? searchFormatted.column === "all"
      ? {
          [Op.or]: [
            {
              MaCamBien: {
                [Op.eq]: isNaN(parseInt(searchFormatted.input, 10))
                  ? null
                  : parseInt(searchFormatted.input, 10),
              },
            },
            {
              NhietDo: {
                [Op.eq]: isNaN(parseFloat(searchFormatted.input))
                  ? null
                  : parseFloat(searchFormatted.input),
              },
            },
            {
              DoAm: {
                [Op.eq]: isNaN(parseFloat(searchFormatted.input))
                  ? null
                  : parseFloat(searchFormatted.input),
              },
            },
            {
              AnhSang: {
                [Op.eq]: isNaN(parseFloat(searchFormatted.input))
                  ? null
                  : parseFloat(searchFormatted.input),
              },
            },
            sequelize.where(
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("ThoiGian"),
                "%Y-%m-%d %H:%i:%s"
              ),
              { [Op.like]: `%${searchFormatted.input}%` } // ThoiGian là date, so sánh theo định dạng
            ),
          ],
        }
      : {
          [searchFormatted.column]: (() => {
            if (searchFormatted.column === "MaCamBien") {
              return {
                [Op.eq]: isNaN(parseInt(searchFormatted.input, 10))
                  ? null
                  : parseInt(searchFormatted.input, 10),
              }; // So sánh int
            } else if (searchFormatted.column === "NhietDo") {
              return {
                [Op.eq]: isNaN(parseFloat(searchFormatted.input))
                  ? null
                  : parseFloat(searchFormatted.input),
              };
            } else if (searchFormatted.column === "DoAm") {
              return {
                [Op.eq]: isNaN(parseFloat(searchFormatted.input))
                  ? null
                  : parseFloat(searchFormatted.input),
              };
            } else if (searchFormatted.column === "AnhSang") {
              return {
                [Op.eq]: isNaN(parseFloat(searchFormatted.input))
                  ? null
                  : parseFloat(searchFormatted.input),
              };
            } else if (searchFormatted.column === "ThoiGian") {
              return sequelize.where(
                sequelize.fn(
                  "DATE_FORMAT",
                  sequelize.col("ThoiGian"),
                  "%Y-%m-%d %H:%i:%s"
                ),
                { [Op.like]: `%${searchFormatted.input}%` }
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

  // console.log(cambien);
  const data = { cambien: cambien, total: total };
  return data;
};

export const getAllCamBien = async (req) => {
  let data = {};
  try {
    const { page = 1, pageSize = 20, sort = "{}", search = "{}" } = req.query;

    const { cambien = [], total = 0 } = await queryAllCamBien(
      page,
      pageSize,
      sort,
      search
    );

    data = { status: 200, cambien, total };
  } catch (error) {
    data = { status: 404, message: "Lỗi server." };
  }
  return data;
};

export const postDataCamBien = async (data) => {
  try {
    const res = await models.CamBien.create(data);
  } catch (error) {}
};
