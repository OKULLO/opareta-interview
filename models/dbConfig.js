
const Sequelize = require('sequelize');
const db ={};

const sequelize = new Sequelize('appdemo','root','',{
    host:process.env.DB_HOST,
    dialect:'mysql'
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;


module.exports ={
    sequelize,
    Sequelize

}