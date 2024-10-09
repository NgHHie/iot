import { models, sequelize } from "../config/connectDB.js";
import { publishMqtt } from "../config/mosquitto.js";
import { Op, fn, col } from "sequelize";

export const queryAllThietBi = async (page, pageSize, sort, search) => {
  // Generate sort format for Sequelize (example: { TenThietBi: 'DESC' })
  const generateSort = () => {
    const sortParsed = JSON.parse(sort);
    sortParsed.field = sortParsed.field || "ThoiGian";
    const sortFormatted = {
      [sortParsed.field]: sortParsed.sort === "asc" ? "ASC" : "DESC",
    };
    return sortFormatted;
  };

  const sortFormatted = Boolean(sort) ? generateSort() : { ThoiGian: "DESC" }; // Default sort by MaThietBi
  console.log("sort: ", Boolean(sort));
  // Build search condition: if search exists, search in multiple fields
  const generateSearch = () => {
    const searchParsed = JSON.parse(search);
    if (
      searchParsed &&
      typeof searchParsed.input === "string" &&
      searchParsed.input.trim() === ""
    ) {
      delete searchParsed.input; // Xóa trường 'input' nếu nó là chuỗi rỗng sau khi trim
    }

    return Object.keys(searchParsed).length ? searchParsed : null;
  };

  const searchFormatted = generateSearch();
  console.log("search: ");
  const searchCondition = searchFormatted
    ? {
        [Op.or]: [
          {
            [Op.and]: sequelize.where(
              fn("DATE_FORMAT", col("ThoiGian"), "%Y-%m-%d %H:%i:%s"),
              {
                [Op.like]: `%${searchFormatted.input}%`,
              }
            ),
          },
        ],
      }
    : {};

  // Fetch thietbi records with pagination and sorting
  const thietbi = await models.ThietBi.findAll({
    where: searchCondition,
    order: [[Object.keys(sortFormatted)[0], Object.values(sortFormatted)[0]]],
    offset: (page - 1) * pageSize,
    limit: parseInt(pageSize, 10),
  });
  // console.log("thietbi: ", thietbi);
  // Count total records
  const total = await models.ThietBi.count({
    where: searchCondition,
  });

  return { thietbi, total };
};

export const getAllThietBi = async (req) => {
  let data = {};
  try {
    const { page = 1, pageSize = 20, sort = "{}", search = "{}" } = req.query;
    console.log(req.query);
    const { thietbi, total } = await queryAllThietBi(
      page,
      pageSize,
      sort,
      search
    );

    data = { status: 200, thietbi: thietbi, total: total };
  } catch (error) {
    data = { status: 404, message: "Lỗi server." };
  }
  return data;
};

export const postDataThietBi = async (data) => {
  try {
    const res = await models.ThietBi.create(data);
  } catch (error) {}
};

export const postRemoteThietBi = async (req) => {
  try {
    const { topic, message } = req.body;
    await publishMqtt(topic, message);

    return { status: 200 };
  } catch (error) {
    return { status: 404, message: "Yêu cầu không thành công." };
  }
};
