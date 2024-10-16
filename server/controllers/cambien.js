import { getAllCamBien, getCount } from "../services/cambien.services.js";

export const getCountHiep = async (req, res) => {
  const data = await getCount();
  if (data.status == 200) {
    res.status(200).json({
      data: data.data,
    });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};

export const getCamBien = async (req, res) => {
  const { page, pageSize, sort, search } = req.query;

  // Validate dữ liệu đầu vào
  if (page && (isNaN(page) || page < 1)) {
    return res
      .status(404)
      .json({ message: "Số thứ tự trang không hợp lệ, phải >= 1." });
  }

  if (pageSize && (isNaN(pageSize) || pageSize < 0)) {
    return res
      .status(404)
      .json({ message: "Kích thước trang không hợp lệ, phải >= 0." });
  }

  try {
    // Validate 'sort' phải là JSON hợp lệ
    if (sort) {
      const sortObj = JSON.parse(sort);
    }

    // Validate 'search' phải là JSON hợp lệ
    if (search) {
      const searchObj = JSON.parse(search);
    }
  } catch (err) {
    return res.status(404).json({ message: "Định dạng JSON không hợp lệ." });
  }

  const data = await getAllCamBien(req);
  console.log(data.cambien);
  if (data.status == 200) {
    res.status(200).json({
      cambien: data.cambien,
      total: data.total,
    });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};
