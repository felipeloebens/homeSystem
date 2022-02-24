const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi');

class MasterController {
  async list(req, res) {
    //exemplo de get com a query http://localhost:8080/api/masters?query&name=plc1
    const { count : countElements } = await models.masters.findAndCountAll({});
    if (countElements !== 0) {
    try {
      const query = {
        where: {}
      }
      if (req.query.ids) {
        query.where.id = req.query.ids.split(',');
      }
      if (req.query.name) {
        query.where.name = {
          [Op.like]: `%${req.query.name.trim()}%`,
        }
      }

      if (req.query.ip_address) {
        query.where.ip_address = {
          [Op.like]: `%${req.query.ip_address.trim()}%`,
        }
      }

      const data = await models.masters.findAll(query);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
  }else{
    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }

}

//função de inserção de um novo master no sistema
  async create(req, res) {
    const schema = Joi.object({
      name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
      ip_address: Joi.string().ip().required()
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
          const { count : countIp } = await models.masters.findAndCountAll({
            where: {
              ip_address: {
                [Op.like]:`%${req.body.ip_address}%`
              }
            }
          });

          const { count : countName } = await models.masters.findAndCountAll({
            where: {
              name: {
                [Op.like]: `%${req.body.name}%`
              }
            }
          });

            if (countIp === 0 && countName === 0) {

              try {
                const data = await models.masters.create(req.body);
                return res.status(200).json(data);
              } catch (error) {
                console.error(error)
                return res.status(500).json(error);
              }

            } else if (countIp !== 0) {

              return res.status(500).send(`Validation error: ${"the ip address is not unique!"}`);

            }else if (countName !== 0){

              return res.status(500).send(`Validation error: ${"the name is not unique!"}`);
            }
            
        } catch (error) {
          console.error(error)
          return res.sendStatus(500);
        }


    }

  }

 //função de update da level acesses selecionado
  async update(req, res) {
    const { count : countElements } = await models.masters.findAndCountAll({});

    if (countElements !== 0) {
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }
      const masterId = req.params.id;
      const master = await models.masters.findOne({ where: { id: masterId } });
      if (!master) {
        return res.status(400).send({
          message: "Master not found."
        });
      }

      await models.masters.update(req.body, { where: { id: masterId } });
      return res.status(200).json(await models.masters.findOne({ where: { id: masterId } }));

    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
  }else{

    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
}

 //função de exclusão de um master
  async delete(req, res) {
    
    const { count : countElements } = await models.masters.findAndCountAll({});

    if (countElements !== 0) {
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }
      const masterId = req.params.id;
      const master = await models.masters.findOne({ where: { id: masterId } });
      if (!master) {
        return res.status(400).send({
          message: "Master not found."
        });
      }

      await models.masters.destroy({ where: { id: masterId } });

      return res.status(201).json({message: "Success delete!"});

    } catch (error) {
      console.error(error)
      return res.sendStatus(500);
    }
  }else{

    return res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
  
  }
}

module.exports = new MasterController();