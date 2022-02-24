const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi');

class ControlGroups {
//função de consulta
async list(req, res) {
  const { count : countElements } = await models.control_groups.findAndCountAll({});
  if (countElements !== 0) {
    try {
      //exemplo de get com a query http://localhost:8080/api/controlGroups?query&ids=1,2
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

        const data = await models.control_groups.findAll(query);
        return res.status(200).json(data);
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }
    }else{
      return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
}

//função para inserção de um novo control group
  async create(req, res) {

    const schema = Joi.object({
      description: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
      id_level: Joi.number().required(),
      id_days_off: Joi.number(),
      days: Joi.number(),
      last_operation: Joi.number().required()

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

          const { count : countDescription } = await models.control_groups.findAndCountAll({
            where: {
              description: {
                [Op.like]: `%${req.body.description}%`
              }
            }
          });

            if (countDescription === 0) {

              try {
                const data = await models.control_groups.create(req.body);
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

 //função de update da level acesses selecionado
 async update(req, res) {
  const { count : countElements } = await models.control_groups.findAndCountAll({});

  if (countElements !== 0) {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        message: "Send the id parameter."
      });
    }
    const controlGroupId = req.params.id;
    const controlGroup = await models.control_groups.findOne({ where: { id: controlGroupId } });
    if (!controlGroup) {
      return res.status(400).send({
        message: "Master not found."
      });
    }

    await models.control_groups.update(req.body, { where: { id: controlGroupId } });

    return res.status(200).json(await models.control_groups.findOne({ where: { id: controlGroupId } }));

  } catch (error) {
    console.error(error)
    return res.sendStatus(500);
  }
}else{

  return res.status(500).send(`error: ${"Does not has registers in table!"}`);
}
}

//função de exclusão de um control group
 async delete(req, res) {
  const { count : countElements } = await models.control_groups.findAndCountAll({});

  if (countElements !== 0) {
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }

      const controlGroupId = req.params.id;
      const controlGroup = await models.control_groups.findOne({ where: { id: controlGroupId } });
      if (!controlGroup) {
        return res.status(400).send({
          message: "Master not found."
        });
      }

      await models.control_groups.destroy({ where: { id: controlGroupId } });
      return res.status(201).json({message: "Success delete!"});

    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }

  }else{
    return res.status(500).send(`error: ${"Does not has register in table!"}`);
  }
}


}
module.exports = new ControlGroups()