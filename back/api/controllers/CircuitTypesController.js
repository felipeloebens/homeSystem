const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi');

class CircuitTypesController {
//função de consulta
async list(req, res) {
  const data = await models.circuit_types.findAll();
  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  } 
    try {
      //exemplo de get com a query http://localhost:8080/api/controlGroups?query&ids=1,2
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

        const data = await models.circuit_types.findAll(query);
        return res.status(200).json(data);
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }
}

//função para inserção de um circuit type
async create(req, res) {
    const schema = Joi.object({
      name: Joi.string()
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

        // se o Json é válido realiza rotina de inserção no db
        req.body = value;    
        try {

          const { count : countName } = await models.circuit_types.findAndCountAll({
            where: {
              name: {
                [Op.like]: `%${req.body.name}%`
              }
            }
          });

            if (countName === 0) {

              try {
                const data = await models.circuit_types.create(req.body);
                return res.status(200).json(data);
              } catch (error) {
                console.error(error)
                return res.status(500).json(error);
              }

            }else if (countName !== 0){

              return res.status(500).send(`Validation error: ${"the name is not unique!"}`);
            }
            
        } catch (error) {
          console.error(error)
          return res.sendStatus(500);
        }
    }
  }

//função de update de um circuit type
async update(req, res) {
  const data = await models.circuit_types.findAll();
  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
  try {
    if (!req.params.id) {
      return res.status(400).send({
        message: "Send the id parameter."
      });
    }
    const circuitTypeId = req.params.id;
    const circuitType = await models.circuit_types.findOne({ where: { id: circuitTypeId } });
    if (!circuitType) {
      return res.status(400).send({
        message: "Master not found."
      });
    }

    await models.circuit_types.update(req.body, { where: { id: circuitTypeId } });

    return res.status(200).json(await models.circuit_types.findOne({ where: { id: circuitTypeId } }));

  } catch (error) {
    console.error(error)
    return res.sendStatus(500);
  }
}

//função de exclusão de um circuit type
async delete(req, res) {
  const data = await models.circuit_types.findAll();
  if(data.length === 0) {
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }

      const circuitTypeId = req.params.id;
      const circuitType = await models.circuit_types.findOne({ where: { id: circuitTypeId } });
      if (!circuitType) {
        return res.status(400).send({
          message: "Master not found."
        });
      }

      await models.circuit_types.destroy({ where: { id: circuitTypeId } });
      return res.status(201).json({message: "Success delete!"});

    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
}

}

module.exports = new CircuitTypesController()