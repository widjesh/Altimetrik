const { expect } = require("chai");
const request = require("supertest");
const should = require('should');

const app = require("../../../app");

before(done => {
  console.log("Starting the test");
  done();
});

describe("GET /vin/{id}", _ => {
  it("OK, fetching Attributes which contains only values works", done => {
    request(app)
      .get("/vin/1FAHP2H88EG142105")
      .then(res => {
        const details = res.body.details;
        let testData = [];
        for (const key of details) {
            if(key.Value === '' || key.Value === null){
                testData.push(key);
            }
        }
        expect(testData).to.be.empty;
        done();
      });
  });
  it("OK, VIN Vehicle Type returns MAKE for same Vehicle type ONLY", done => {
    request(app)
      .get("/vin/1FAHP2H88EG142105")
      .then(res => {
        const details = res.body.details;
        const makes = res.body.makes;
        let type = '';
        let matched = true;
        for (const key of details) {
            if(key.Variable === 'Vehicle Type'){
                type=key.Value;
            }
        }
        for (const key of makes) {
            if((key.VehicleTypeName).toLowerCase() !== type.toLowerCase()){
                matched = false;
            }
        }
        expect(matched).to.be.true;
        done();
      });
  });
  
});