import {
  getAllThietBi,
  postRemoteThietBi,
} from "../services/thietbi.services.js";

export const getThietBi = async (req, res) => {
  const data = await getAllThietBi(req);
  if (data.status == 200) {
    res.status(200).json({
      thietbi: data.thietbi,
      total: data.total,
    });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};

export const postThietBi = async (req, res) => {
  const data = await postRemoteThietBi(req);
  if (data.status == 200) {
    res.status(200).json({ message: "Success" });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};
