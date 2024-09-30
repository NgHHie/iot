import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ThietBi extends Model {
    static associate(models) {}
  }
  ThietBi.init(
    {
      MaThietBi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      TenThietBi: DataTypes.STRING,
      TrangThai: DataTypes.STRING,
      ThoiGian: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ThietBi",
      tableName: "thietbi",
      timestamps: false,
    }
  );

  ThietBi.removeAttribute("id");
  return ThietBi;
};
