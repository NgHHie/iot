import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class CamBien extends Model {
    static associate(models) {}
  }
  CamBien.init(
    {
      MaCamBien: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      NhietDo: DataTypes.FLOAT,
      DoAm: DataTypes.FLOAT,
      AnhSang: DataTypes.FLOAT,
      ThoiGian: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CamBien",
      tableName: "cambien",
      timestamps: false,
    }
  );

  CamBien.removeAttribute("id");
  return CamBien;
};
