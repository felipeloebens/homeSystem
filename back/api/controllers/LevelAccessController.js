const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi');


class LevelAccessController {

//função de consulta
async list(req, res) {
  const data = await models.level_access.findAll();
  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  } 
    try {
      //exemplo de get com a query http://localhost:8080/api/levelAccess?query&ids=1,2
      const query = {
          where: {}
        }
        //cláusula where por ID
        if (req.query.ids) {
          query.where.id = req.query.ids.split(',');
        }
        //cláusula where por description
        if (req.query.description) {
          query.where.description = {
            [Op.like]: `%${req.query.description.trim()}%`,
          }
        }

        const data = await models.level_access.findAll(query);
        return res.status(200).json(data);
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }
}

//função de update da level accesses selecionado
async update(req, res) {
  const data = await models.level_access.findAll();
  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  } 
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }
      const levelId = req.params.id;
      const level = await models.level_access.findOne({ where: { id: levelId } });
      if (!level) {
        return res.status(400).send({
          message: "Level access not found."
        });
      }

      await models.level_access.update(req.body, { where: { id: levelId } });

      return res.status(200).json(await models.level_access.findOne({ where: { id: levelId } }));

    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
}

//função de de inserção de um level access
async create(req, res) {
    const schema = Joi.object({
      description: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
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
      //se o Json é válido realiza rotina de inserção no db
      req.body = value;    
      try {
        const { count : countDescription } = await models.level_access.findAndCountAll({
          where: {
            description: {
              [Op.like]: `%${req.body.description}%`
            }
          }
        });

          if (countDescription === 0) {

            try {
              const data = await models.level_access.create(req.body);
              return res.status(200).json(data);
            } catch (error) {
              console.error(error)
              return res.status(500).json(error);
            }

          }else if (countDescription !== 0){

            return res.status(500).send(`Validation error: ${"the description is not unique!"}`);
          }
          
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }


    }

  }

//função de exclusão de um level access
async delete(req, res) {
  const data = await models.level_access.findAll();
  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  } 
    try {
        if (!req.params.id) {
          return res.status(400).send({
            message: "Send the id parameter."
          });
        }
        const levelId = req.params.id;
        const level = await models.level_access.findOne({ where: { id: levelId } });
        if (!level) {
          return res.status(400).send({
            message: "Level access not found."
          });
        }
        await models.level_access.destroy({ where: { id: levelId } });
        return res.status(201).json({message: "Success delete!"});
    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
  }
}

module.exports = new LevelAccessController()