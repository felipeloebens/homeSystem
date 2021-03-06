const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi');

class UsersController {
//função de consulta
async list(req, res) {
  try {
    //exemplo de get com a query http://localhost:8080/api/users?query&ids=1,2
    const query = {
        where: {}
      }
      //cláusula where por ID
      if (req.query.ids) {
        query.where.id = req.query.ids.split(',');
      }
      //cláusula where por name
      if (req.query.name) {
        query.where.name = {
          [Op.like]: `%${req.query.name.trim()}%`,
        }
      }
      //cláusula where por email
      if (req.query.email) {
        query.where.email = {
          [Op.like]: `%${req.query.email.trim()}%`,
        }
      }

      const data = await models.users.findAll(query);

      if(data.length === 0) {
        return res.status(500).send(`error: ${"Does not has registers in table!"}`);
      } 
      
      return res.status(200).json(data);
    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
}
  
//funcao de insert na tabela users
  async create(req, res) {

    const schema = Joi.object({
      id_level : Joi.number().required(),
      name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    pass: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*]{3,25}$')),
    repeat_pass: Joi.ref('pass'),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ind'] },})
    });

    const options = {
      abortEarly: false, 
      allowUnknown: false, 
      stripUnknown: false 
    };

    const { error, value } = schema.validate(req.body, options);
  
    if (error) {
        // mostra os erros de validação separados por vírgula 
        const msgError = (`Validation error: ${error.details.map(x => x.message).join(', ')}`);

        console.error(msgError)
        return res.status(500).send(msgError);
  
    } else {

      // se o Json é válido realiza rotina de inserção no db
      req.body = value;    
      try {
        const { count : countName } = await models.users.findAndCountAll({
          where: {
            name: {
              [Op.like]: `%${req.body.name}%`
            }
          }
        });

        const { count : countEmail } = await models.users.findAndCountAll({
          where: {
            email: {
              [Op.like]: `%${req.body.email}%`
            }
          }
        });

          if (countName === 0 && countEmail === 0) {
            try {
              const data = await models.users.create(req.body);
              delete data.dataValues.pass;
              
              return res.status(200).json(data);
            } catch (error) {
              console.error(error)
              return res.status(500).json(error);
            }
          }else if (countName !== 0){

            return res.status(500).send(`Validation error: ${"the name is not unique!"}`);
          }else if (countEmail !== 0){

            return res.status(500).send(`Validation error: ${"the email is not unique!"}`);
          }
          
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }
    }

 }

  //função de update de um user selecionado
  async update(req, res) {
    
    const data = await models.users.findAll();

    if(data.length === 0) {
      return res.status(500).send(`error: ${"Does not has registers in table!"}`);
    }

    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }
      const userId = req.params.id;
      const user = await models.users.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(400).send({
          message: "Master not found."
        });
      }

      await models.users.update(req.body, { where: { id: userId } });

      return res.status(200).json(await models.users.findOne({ where: { id: masterId } }));

    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }

}

//função de exclusão de um level access
async delete(req, res) {

  const data = await models.users.findAll();

  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }

  try {
        if (!req.params.id) {
          return res.status(400).send({
            message: "Send the id parameter."
          });
        }
        const userId = req.params.id;
        const user = await models.users.findOne({ where: { id: userId } });
        if (!user) {
          return res.status(400).send({
            message: "User not found."
          });
        }
        await models.users.destroy({ where: { id: userId } });
        return res.status(201).json({message: "Success delete!"});
    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }

  }


}



module.exports = new UsersController()