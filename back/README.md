<h1 align="center">Home Automation 🏡</h1>
<p align="left"> Projeto de automação residencial, para controle de iluminação via Modbus/TCP, CFTV e integração com equipamentos de uso local.</p>

## Sequelize
Comando para criar o databse
``npx sequelize-cli db:create``

Comando para executar as migrations
``npx sequelize-cli db:migrate``

Comando para criar uma nova migration
``npx sequelize-cli migration:create --name migration-name``

## Database
Link com o modelo do database relacional 
<a href="https://app.dbdesigner.net/designer/schema/0-untitled-290116bb-96a8-4bdb-8230-b2a481e95a19">🔗 Relational model</a>

### Database routes

 Route | Masters | ControlGroups | CircuitTypes | DaysOff   | LevelAccess | Circuits | Users |
 :---  | :-----: | :-----------: | :----------: | :-----:   |   :-----:   |  :-----: |:-----:|
POST   |    ✅   |       ✅      |      ✅      |    ✅    |      ✅    |    ✅   |  ✅   |
PUT    |    ✅   |       ✅      |      ✅      |    ✅    |      ✅    |    ✅   |  ✅   |
DELETE |    ✅   |       ✅      |      ✅      |    ✅    |      ✅    |    ✅   |  ✅   |
GET    |    ✅   |       ✅      |      ✅      |    ✅    |      ✅    |    ✅   |  ✅   |