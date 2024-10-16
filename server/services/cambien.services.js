import { models, sequelize } from "../config/connectDB.js";
import { Op } from "sequelize";

export const queryAllCamBien = async (page, pageSize, sort, search) => {
  try {
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
      if (
        searchParsed &&
        typeof searchParsed.input === "string" &&
        searchParsed.input.trim() === ""
      ) {
        delete searchParsed.input; // Xóa trường 'input' nếu nó là chuỗi rỗng sau khi trim
      }
      // searchParsed.column = searchParsed.column || "ThoiGian";
      if (!Object.keys(searchParsed).includes("input")) {
        return null;
      } else if (!Object.keys(searchParsed).includes("column")) {
        searchParsed.column = "all";
      }
      return Object.keys(searchParsed).length ? searchParsed : null;
    };

    const searchFormatted = generateSearch();
    console.log(
      "search: ",
      searchFormatted && searchFormatted.input
        ? parseFloat(searchFormatted.input)
        : ""
    );
    // Build search condition based on the specified field
    const searchCondition = searchFormatted
      ? searchFormatted.column === "all"
        ? {
            [Op.or]: [
              {
                MaCamBien: sequelize.where(
                  sequelize.cast(sequelize.col("MaCamBien"), "CHAR"),
                  { [Op.like]: `%${searchFormatted.input}%` }
                ),
              },
              {
                NewCamBien: sequelize.where(
                  sequelize.cast(sequelize.col("NewCamBien"), "CHAR"),
                  { [Op.like]: `%${searchFormatted.input}%` }
                ),
              },
              {
                NhietDo: sequelize.where(
                  sequelize.cast(sequelize.col("NhietDo"), "CHAR"),
                  { [Op.like]: `%${searchFormatted.input}%` }
                ),
              },
              {
                DoAm: sequelize.where(
                  sequelize.cast(sequelize.col("DoAm"), "CHAR"),
                  { [Op.like]: `%${searchFormatted.input}%` }
                ),
              },
              {
                AnhSang: sequelize.where(
                  sequelize.cast(sequelize.col("AnhSang"), "CHAR"),
                  { [Op.like]: `%${searchFormatted.input}%` }
                ),
              },
              sequelize.where(
                sequelize.fn(
                  "DATE_FORMAT",
                  sequelize.col("ThoiGian"),
                  "%Y-%m-%d %H:%i:%s"
                ),
                { [Op.like]: `%${searchFormatted.input}%` }
              ),
            ],
          }
        : {
            [searchFormatted.column]: (() => {
              switch (searchFormatted.column) {
                case "MaCamBien":
                  return sequelize.where(
                    sequelize.cast(sequelize.col("MaCamBien"), "CHAR"),
                    { [Op.like]: `%${searchFormatted.input}%` }
                  );
                case "NewCamBien":
                  return sequelize.where(
                    sequelize.cast(sequelize.col("NewCamBien"), "CHAR"),
                    { [Op.like]: `%${searchFormatted.input}%` }
                  );
                case "NhietDo":
                  return sequelize.where(
                    sequelize.cast(sequelize.col("NhietDo"), "CHAR"),
                    { [Op.like]: `%${searchFormatted.input}%` }
                  );
                case "DoAm":
                  return sequelize.where(
                    sequelize.cast(sequelize.col("DoAm"), "CHAR"),
                    { [Op.like]: `%${searchFormatted.input}%` }
                  );
                case "AnhSang":
                  return sequelize.where(
                    sequelize.cast(sequelize.col("AnhSang"), "CHAR"),
                    { [Op.like]: `%${searchFormatted.input}%` }
                  );
                case "ThoiGian":
                  return sequelize.where(
                    sequelize.fn(
                      "DATE_FORMAT",
                      sequelize.col("ThoiGian"),
                      "%Y-%m-%d %H:%i:%s"
                    ),
                    { [Op.like]: `%${searchFormatted.input}%` }
                  );
                default:
                  return {};
              }
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
  } catch (error) {
    console.log(error);
    return { status: 404, message: error.message };
  }
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

export const getCount = async () => {
  let data = {};
  try {
    const res = await models.CanhBao.findOrCreate({
      where: { Id: 1 },
      defaults: {
        Count: 0,
      },
    });
    console.log(res[0].Count);

    data = { status: 200, data: res[0] };
  } catch (error) {
    data = { status: 404, message: "Lỗi server." };
  }
  return data;
};
export const updateCount = async () => {
  let data = {};
  try {
    const res = await models.CanhBao.findOrCreate({
      where: { Id: 1 },
      defaults: {
        Count: 0,
      },
    });

    console.log(res[0].Count);
    await models.CanhBao.update(
      { Count: res[0].Count + 1 }, // Tăng Count thêm 1
      { where: { Id: 1 } } // Điều kiện Id bằng 1
    );
  } catch (error) {
    data = { status: 404, message: "Lỗi server." };
  }
};
