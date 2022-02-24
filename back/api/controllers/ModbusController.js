const ModbusRTU = require("modbus-serial");
const Joi = require('joi')

class ModbusController {

  constructor() {
    this.data = {};
    this.client = new ModbusRTU();
    this.connected = false;
    this.connParameter = {};
    this.erroCom = false;
  }

  async connect() {
    
    const error = await new Promise((resolve) => {
      this.client.setTimeout(3500);
      this.client.connectTCP(this.connParameter.ip, { port: parseInt(this.connParameter.port) }, (error) => resolve(error));
      this.client.setID(parseInt(this.connParameter.id));
    });
    await this.onConnected(error);
  }

  async onConnected(error) {
    if (typeof (error) !== "undefined") {
      
      this.data = { "ip" : this.connParameter.ip, "id" : parseInt(this.connParameter.id), "error" : "no response from device!"};
      this.connected = false;
      console.log(error);

      if(error !== null || error !== undefined){
       this.erroCom = true;
      }

      return;
    }

    this.data = {}
    this.connected = true;
    //verifica no body se vai ser comando de escrita ou leitura na modbus
    var j = parseInt(this.connParameter.write);
      switch(j) {
        case 0:
          await this.read();
          break;
        case 6:
          await this.writeSingle();
          break;
        case 16:
          await this.writeMultiple();
          break;
        default:
          this.erroCom = true;
          this.data = {"error" : "write parameter is invalid!"};
      } 
  }

  async read() {
    const values = await new Promise((resolve) => {
        this.client.readHoldingRegisters(parseInt(this.connParameter.start), parseInt(this.connParameter.size), (error, values) => {
            if (error) {
                console.log("Read registers error", error);
                this.data = { "ip" : this.connParameter.ip, "id" : parseInt(this.connParameter.id), "error": "on read registers, verify the addresses!" };
            } else {
                this.data = Object.assign({}, values.data);
                console.log({readData: this.data, status: "Read registers done!" });
            }

            resolve(values);
            this.client.close();
        });
    });

    return values;
}

async writeMultiple() {
  const values = await new Promise((resolve) => {
      var valueWrite = JSON.parse("[" + this.connParameter.writevalues + "]");
      this.data = valueWrite;
      this.client.writeRegisters(parseInt(this.connParameter.start), valueWrite, (error, values) => {
          if (error) {
              this.erroCom = true;
              console.log("Write registers error!", error);
              this.data = { "ip" : this.connParameter.ip, "id" : parseInt(this.connParameter.id), "error": "on write multiple registers (FC16), verify the addresses!" };
          }else{
              resolve(values);
              console.log({ writeData: this.data, status: "Write registers done!" });
          }
          this.client.close();
      });
  });
}

async writeSingle() {
  const values = await new Promise((resolve) => {
    var valueWrite = this.connParameter.writevalue;
    this.data = valueWrite;
    this.client.writeRegister(parseInt(this.connParameter.start), valueWrite, (error, values) => {
        if (error) {
            this.erroCom = true;
            console.log("Write registers error!", error);
            this.data = { "ip" : this.connParameter.ip, "id" : parseInt(this.connParameter.id), "error": "on write multiple registers (FC16), verify the addresses!" };
        }else{
            resolve(values);
            console.log({ writeData: this.data, status: "Write register done!" });
        }
        this.client.close();
    });   


  });
}

// GET de leitura de holding register exemplo: http://localhost:8080/api/modbus/readHoldingRegFC3?query&ip=10.0.40.65&port=502&id=1&start=1&size=2&write=0
async readHoldingRegFC3( req, res) {

  const schema = Joi.object({
    ip : Joi.string().ip().required(),
    port : Joi.number().port() .required(),
    id : Joi.number().required(),
    start : Joi.number().required(),
    size : Joi.number().required(),
    write : Joi.number().min(0).max(0).required(), 
  });

  const options = {
    abortEarly: false, 
    allowUnknown: false, 
    stripUnknown: false 
  };
  const body = req.query;
  delete body["query"];

  const { error, value } = schema.validate(body, options);
  if (error) {
      // mostra os erros de validação separados por vírgula 
      const msgError = (`Validation error: ${error.details.map(x => x.message).join(', ')}`);

      console.error(msgError)
      return res.status(500).send(msgError);
  } else {
    try {
      this.connParameter = req.query;
      const readReg = await this.connect();
          if(this.erroCom){
            res.status(500).json({ status: "Read error, verify the parameters!"})
          }else {
            res.status(200).json({readData: this.data, status: "Read registers done!" })
          }  
      this.erroCom = false;
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }
  }
}

/*POST de escrita de holding register FC16
http://localhost:8080/api/modbus/writeHoldingRegFC16
BODY
 {
  "ip" : "10.0.7.65",
  "port" : 512,
  "id" : 2,
  "start": 501,
  "write": 16,
  "writevalues": "1,23,44,12"
} */
async writeHoldingRegFC16( req, res) {

  const schema = Joi.object({
    ip : Joi.string().ip().required(),
    port : Joi.number().port() .required(),
    id : Joi.number().required(),
    start : Joi.number().required(),
    write : Joi.number().min(16).max(16).required(), 
    writevalues : Joi.string().required()
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
    try {
      this.connParameter = req.body;
      const writeReg = await this.connect();
          if(this.erroCom){
            res.status(500).json({ status: "Write error, verify the parameters and value!"})
          }else {
            res.status(200).json({ writeData: this.data, status: "Write registers done!" })
          }  
      this.erroCom = false;
      } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }
  }
}

/*POST de escrita de holding register FC6
http://localhost:8080/api/modbus/writeHoldingRegFC6
BODY
 {
  "ip" : "10.0.7.65",
  "port" : 512,
  "id" : 2,
  "start": 501,
  "write": 6,
  "writevalue": 1
} */

async writeHoldingRegFC6( req, res) {

  const schema = Joi.object({
    ip : Joi.string().ip().required(),
    port : Joi.number().port() .required(),
    id : Joi.number().required(),
    start : Joi.number().required(),
    write : Joi.number().min(6).max(6).required(), 
    writevalue : Joi.number().required()
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

  this.connParameter = req.body;
    try {
      const write = await this.connect();
        if(this.erroCom){
          res.status(500).json({ status: "Write error, verify the parameters and value!"})
        }else {
          res.status(200).json({ writeData: this.data, status: "Write register done!" })
        } 
      this.erroCom = false;
        
    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }
  }
}

}
module.exports = new ModbusController()