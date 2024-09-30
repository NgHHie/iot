import { getAllCamBien } from "../services/cambien.services.js";

export const getCamBien = async (req, res) => {
  const data = await getAllCamBien(req);
  if (data.status == 200) {
    res.status(200).json({
      cambien: data.cambien,
      total: data.total,
    });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};
