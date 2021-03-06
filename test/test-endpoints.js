const chai = require('chai');
const chaiHttp = require('chai-http');

const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');
const {Vet} = require('../vets');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Vet endpoints', () => {

	before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  afterEach(function() {
    return Vet.remove({});
  });

  describe('POST endpoint', () => {
  	it('should post vet listing', () => {
	  	return chai.request(app)
	  	.post('/api/vets/vetlist')
	  	.send({googleDataId: '1254234623', vetName: 'Petsmart'})
	  	.then(res => {
          expect(res).to.have.status(201);
				})
	  	.catch(err => {
				if (err) console.log('Something went wrong: ' + err)
			});
	  });	
  });

  describe('POST/PUT endpoint', () => {
    let serviceId = ""
  	it('should post service', () => {
	  	return chai.request(app)
	  	.post('/api/vets/123456789012345678901234/services')
	  	.send({service: 'Shampoo', price: '40.00'})
	  	.then(res => {
        serviceId = res.body._id
        expect(res).to.have.status(201);
        expect(res.body.service).to.be.equal('Shampoo')
				})
	  	.catch(err => {
				if (err) console.log('Something went wrong: ' + err)
			});
	  });	
    it('should edit service', () => {
      let editService = {service:'x',price:'99.00'}
      return chai.request(app)
        .put('/api/vets/' + serviceId +'/services')
        .send(editService)
        .then(function(res) {
          const resJson = res.body;
          expect(resJson.service).to.be.equal('x')
          expect(resJson.price).to.be.equal('99.00')     
        })
        .catch(err => {
        if (err) console.log('Something went wrong: ' + err)
        });
      })
    });
});



