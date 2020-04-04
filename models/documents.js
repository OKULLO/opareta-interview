const { Sequelize, Model, DataTypes } = require('sequelize');
const{ sequelize } = require('./dbConfig');


//user model
class User extends Model{}
      User.init({
          username:DataTypes.STRING,
          email:DataTypes.STRING,
          password:{
              type:Sequelize.STRING,
              validate:{
                  min:8
              }
          }
      },{ sequelize, modelName: 'user'})
//document  model
class Documents extends Model{}
        Documents.init({
            document_type:DataTypes.STRING,
            document_body:DataTypes.TEXT,
            doc_code:DataTypes.STRING,
            status:{
                type:Sequelize.ENUM('approved','notapproved','waiting'),
                defaultValue:'waiting'
            }
            /* doc_date:DataTypes.DATE,
          
            */
        },{ sequelize, modelName: 'Documents'})

        Documents.sequelize.sync()

//student class
class Student extends Model{}
    Student.init({
        fname:DataTypes.STRING(40),
        lname:DataTypes.STRING(40),
        Regno:DataTypes.STRING(20),
        email:DataTypes.STRING(40),
        contact:DataTypes.INTEGER(11),
    },{ sequelize, modelName: 'Students'})

//department model

class Department extends Model{}
    Department.init({
        dep_name:{
            type:Sequelize.STRING(40),
            required: true
        }
    },{ sequelize, modelName: 'departments'})

//faculties
class Faculty extends Model{}
    Faculty.init({
        faculty_name:{
            type:Sequelize.STRING(40),
            required: true
        }
    },{ sequelize, modelName: 'faculty'})


//leaves
class StaffLeave extends Model{}
        StaffLeave.init({
            leave_type: DataTypes.STRING,
            leave_description: DataTypes.TEXT,
            leave_code: DataTypes.STRING,
            status:{
                type: Sequelize.ENUM('approved','notapproved','waiting'),
                defaultValue:'waiting'
            },
            post_date: DataTypes.DATE,
            return_date:DataTypes.DATE,
            forwarded:DataTypes.BOOLEAN
           
        },{ sequelize, modelName: 'Leave'})

//staff model
class Staff extends Model{}
    Staff.init({
        fname:DataTypes.STRING(45),
        lname:DataTypes.STRING(45),
        email:DataTypes.STRING(40),
        contact:DataTypes.INTEGER(11),
        role:DataTypes.ENUM('lecturer','casual'),
    
    },{ sequelize, modelName: 'Staff'});

//class administrators

class Administrator extends Model{}
   Administrator.init({
       fname:DataTypes.STRING,
       lname:DataTypes.STRING,
       contact:DataTypes.INTEGER(11),
       email:DataTypes.STRING(20),
       gender:DataTypes.ENUM('male','female'),
       admin_role:DataTypes.ENUM('secretary','hod','dean','AR')

       },{sequelize, modelName:'Administrators'});

   
       Department.hasOne(Staff,{as:'department'});
       Student.hasMany(Documents,{as:'student_id'});

    

       
module.exports = {
    User,
    Documents,
    Student,
    Faculty,
    Department,
    Staff,
    StaffLeave,
    Administrator,
    sequelize
}
