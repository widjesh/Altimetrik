const router = require("express").Router();
const axios = require("axios");

/** 
 * @swagger
 * /vin/{id}:
 *  get:
 *   parameters:
 *    - name : id
 *      in: path
 *      required: true
 *      type: string
 *   Description: Get CarDetails By VIN
 *   responses:
 *    '200':
 *      description: A successful response 
 */
router.get("/:vin", async(req, res,next) => {
  const vin = req.params.vin;
  let vehicleFilteredData = [];
  var finalObj = {
    details: [],
    makes: [],
    models: []
  };
  await axios.default
    .get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/${vin}?format=json`
    )
    .then(data => {
      const vehicleInformation = data.data.Results;
      for (const key of vehicleInformation) {
        if (key.Value !== "" && key.Value !== null && (key.Variable === 'Make' 
        || key.Variable === 'Model Year') || key.Variable === 'Plant Country'
        || key.Variable === 'Plant State' || key.Variable === 'Vehicle Type'
        || key.Variable === 'Manufacturer Name') {
          finalObj.details.push(key);``
        }
        if (key.Variable === "Vehicle Type" || key.Variable === "Make") {
          vehicleFilteredData.push(key);
        }
      }
    })
    .then(async _ => {
      let vehicleType = "";
      for (const key of vehicleFilteredData) {
        if (key.Variable === "Vehicle Type") {
          vehicleType = key.Value;
        }
      }
      await axios.default
        .get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${vehicleType}?format=json`
        )
        .then(data => {
          vehicleInformationWithType = data.data.Results;
          for (const key of vehicleInformationWithType) {
            finalObj.makes.push(key);
          }
        }).catch(err=>{
            next(err);
        });
    })
    .then(async _ => {
      let vehicleMake = "";
      for (const key of vehicleFilteredData) {
        if (key.Variable === "Make") {
          vehicleMake = key.Value;
        }
      }
      await axios.default
        .get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${vehicleMake}?format=json`
        )
        .then(data => {
          vehicleInformatiWithMake = data.data.Results;
          for (const key of vehicleInformatiWithMake) {
              finalObj.models.push(key);
          }
          res.status(201).json(finalObj);
        }).catch(err=>{
            next(err);
        });
    }).catch(err=>{
        next(err);
    })
});

module.exports = router;
