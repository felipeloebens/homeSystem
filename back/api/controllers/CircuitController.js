const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi');

class CircuitController {
//função de consulta
async list(req, res) {
  const { count : countElements } = await models.circuits.findAndCountAll({});
  if (countElements !== 0) {
    try {
      //exemplo de get com a query http://localhost:8080/api/circuits?query&ids=1,2
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
        //cláusula where por state
        if (req.query.state) {
          query.where.state = {
            [Op.like]: `%${req.query.state.trim()}%`,
          }
        }

        const data = await models.circuits.findAll(query);
        return res.status(200).json(data);
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }
    }else{
      return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
}

//função de inserção de um novo circuit no sistema
  async create(req, res) {
    const schema = Joi.object({
      name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
      id_master:  Joi.number().required(),
      id_type: Joi.number().required(),
      id_group: Joi.number(),
      register_com: Joi.number().required(),
      register_state: Joi.number(),
      state: Joi.number().required()
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
          const { count : countRegisterCom } = await models.circuits.findAndCountAll({
            where: {
              register_com: {
                [Op.like]:`%${req.body.register_com}%`
              }
            }
          });

          const { count : countName } = await models.circuits.findAndCountAll({
            where: {
              name: {
                [Op.like]: `%${req.body.name}%`
              }
            }
          });

            if (countRegisterCom === 0 && countName === 0) {

              try {
                const data = await models.circuits.create(req.body);
                return res.status(200).json(data);
              } catch (error) {
                console.error(error)
                return res.status(500).json(error);
              }

            } else if (countRegisterCom !== 0) {

              return res.status(500).send(`Validation error: ${"the modbus register is not unique!"}`);

            }else if (countName !== 0){

              return res.status(500).send(`Validation error: ${"the name is not unique!"}`);
            }
            
        } catch (error) {
          console.error(error)
          return res.sendStatus(500);
        }
    }
  }

  //função de update de um circuit selecionado
 async update(req, res) {
  const { count : countElements } = await models.circuits.findAndCountAll({});

  if (countElements !== 0) {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        message: "Send the id parameter."
      });
    }
    const circuitId = req.params.id;
    const circuit = await models.circuits.findOne({ where: { id: circuitId } });
    if (!circuit) {
      return res.status(400).send({
        message: "Master not found."
      });
    }

    await models.circuits.update(req.body, { where: { id: circuitId } });

    return res.status(200).json(await models.circuits.findOne({ where: { id: circuitId } }));

  } catch (error) {
    console.error(error)
    return res.sendStatus(500);
  }
}else{

  return res.status(500).send(`error: ${"Does not has registers in table!"}`);
}
}

//função de exclusão de um circuit
async delete(req, res) {
  const { count : countElements } = await models.circuits.findAndCountAll({});

  if (countElements !== 0) {
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }

      const circuitId = req.params.id;
      const circuit = await models.circuits.findOne({ where: { id: circuitId } });
      if (!circuit) {
        return res.status(400).send({
          message: "Master not found."
        });
      }

      await models.circuits.destroy({ where: { id: circuitId } });
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

module.exports = new CircuitController()