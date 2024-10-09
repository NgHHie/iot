import {
  getAllThietBi,
  postRemoteThietBi,
} from "../services/thietbi.services.js";

export const getThietBi = async (req, res) => {
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

  // Nếu tất cả hợp lệ, tiếp tục truy vấn dữ liệu
  const data = await getAllThietBi(req);

  if (data.status === 200) {
    return res.status(200).json({
      thietbi: data.thietbi,
      total: data.total,
    });
  } else {
    return res.status(data.status).json({ message: data.message });
  }
};

export const postThietBi = async (req, res) => {
  const { topic, message } = req.body;
  if (!topic || !message) {
    return res.status(404).json({ message: "Thiếu thông tin." });
  }
  if (message != "0" && message != "1") {
    return res
      .status(404)
      .json({ message: `Dữ liệu không hợp lệ, phải là "0" hoặc "1".` });
  }
  if (
    topic != "home/light" &&
    topic != "home/air_conditioner" &&
    topic != "home/fan"
  ) {
    return res.status(404).json({ message: "Topic không hợp lệ." });
  }

  const data = await postRemoteThietBi(req);
  if (data.status == 200) {
    res.status(200).json({ message: "Gửi yêu cầu thành công." });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};
