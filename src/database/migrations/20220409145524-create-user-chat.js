module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_chat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      chat_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_chat');
  }
}