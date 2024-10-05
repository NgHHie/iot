import { getDataDashBoard } from "../services/dashboard.services.js";

export const getDashBoard = async (req, res) => {
  const data = await getDataDashBoard(req);
  console.log(data);
  if (data.status == 200) {
    res.status(200).json({
      temper: data.nhietdo,
      humid: data.doam,
      light: data.anhsang,
    });
  } else {
    res.status(data.status).json({ message: data.message });
  }
};
