import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class CanhBao extends Model {
    static associate(models) {}
  }
  CanhBao.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      Count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CanhBao",
      tableName: "canhbao",
      timestamps: false,
    }
  );

  CanhBao.removeAttribute("id");
  return CanhBao;
};
