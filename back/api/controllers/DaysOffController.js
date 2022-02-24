const models = require('../models/index');
const Op = models.Sequelize.Op;
const Joi = require('joi')
  .extend(require('@joi/date'));


  
class DaysOffController {

  
//função de consulta
async list(req, res) {

  const { count : countElements } = await models.days_off.findAndCountAll({});

  if (countElements !== 0) {
    try {
      //exemplo de get com a query http://localhost:8080/api/daysoff?query&ids=1,2
      const query = {
          where: {}
        }
        //cláusula where por ID
        if (req.query.ids) {
          query.where.id = req.query.ids.split(',');
        }
        //cláusula where por date
        if (req.query.date) {
          query.where.description = {
            [Op.like]: `%${req.query.date.trim()}%`,
          }
        }

        const data = await models.days_off.findAll(query);
        res.status(200).json(data);
      } catch (error) {
        console.error(error)
        res.sendStatus(500);
      }
    }else{
      res.status(500).send(`error: ${"Does not has registers in table!"}`);
  }
}

//função de de inserção de um level access
async create(req, res) {
  const schema = Joi.object({
    date: Joi.date()
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
      res.status(500).send(msgError);
  } else {
    //se o Json é válido realiza rotina de inserção no db
    req.body = value;    
    try {
      const { count : countDate } = await models.days_off.findAndCountAll({
        where: {
          date: {
            [Op.like]: `%${req.body.date}%`
          }
        }
      });

        if (countDate === 0) {

          try {
            const data = await models.days_off.create(req.body);
            res.status(200).json(data);
          } catch (error) {
            console.error(error)
            res.status(500).json(error);
          }

        }else if (countDate !== 0){

          res.status(500).send(`Validation error: ${"the date is not unique!"}`);
        }
        
    } catch (error) {
      console.error(error)
      res.sendStatus(500);
    }
  }

}

//função de update da level accesses selecionado
async update(req, res) {

    const { count : countElements } = await models.days_off.findAndCountAll({});

    if (countElements !== 0) {
      try {
        if (!req.params.id) {
          return res.status(400).send({
            message: "Send the id parameter."
          });
        }
        const dateOffId = req.params.id;
        const dateOff = await models.days_off.findOne({ where: { id: dateOffId } });
        if (!dateOff) {
          return res.status(400).send({
            message: "Date off, not found."
          });
        }

        await models.days_off.update(req.body, { where: { id: dateOffId } });
        return res.status(200).json(await models.days_off.findOne({ where: { id: dateOffId } }));

      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
      }
    }else{
      return res.status(500).send(`error: ${"Does not has registers in table!"}`);
    }
}

//função de exclusão de um daysOff
async delete(req, res) {
  const { count : countElements } = await models.days_off.findAndCountAll({});

  if (countElements !== 0) {
    try {
      if (!req.params.id) {
        return res.status(400).send({
          message: "Send the id parameter."
        });
      }

      const daysOffId = req.params.id;
      const dayOff = await models.days_off.findOne({ where: { id: daysOffId } });
      if (!dayOff) {
        return res.status(400).send({
          message: "Day off not found."
        });
      }

      await models.days_off.destroy({ where: { id: daysOffId } });
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

module.exports = new DaysOffController()