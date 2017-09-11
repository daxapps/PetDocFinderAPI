const chai = require('chai');
const chaiHttp = require('chai-http');

const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');
const {Vet} = require('../vets');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Vet endpoints', () => {
	// const googleDataId = '1234453668';
 //  const vetName = 'Petsmart';

	before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  // beforeEach(function() {
  //   return Vet.create({
  //       googleDataId,
  //       vetName
  //     })
  //   );
  // });

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

  describe('POST endpoint', () => {
  	it('should post service', () => {
	  	return chai.request(app)
	  	.post('/api/vets/123456789012345678901234/services')
	  	.send({service: 'Shampoo', price: '40.00'})
	  	.then(res => {
          expect(res).to.have.status(201);
				})
	  	.catch(err => {
				if (err) console.log('Something went wrong: ' + err)
			});
	  });	
  });
	  

});



