import { test, expect } from '@playwright/test';



test('Ping - HealthCheck', async({request})=>{
  // HOMEWORK
})


test.describe('booker API', ()=>{

  test('Auth - CreateToken', async({request})=>{
      const response = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: {'Content-Type': 'application/json'},
        data: { "username" : "admin", "password" : "password123"}
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();  
      expect(data).toHaveProperty('token');
  });

  test('Booking - GetBookingIds', async({request})=>{
    const response = await request.get('https://restful-booker.herokuapp.com/booking');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(data);
    
    for(let elem of data){
      expect(elem).toHaveProperty('bookingid');
    }
  
  });


  test('Booking - GetBooking', async({request})=>{
    
    const id = 1;

    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${id}`);


    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
   

    expect(data).toHaveProperty('firstname');
    expect(data).toHaveProperty('lastname');
    expect(data).toHaveProperty('totalprice');
    expect(data).toHaveProperty('depositpaid');
  
    expect(data.bookingdates).toHaveProperty('checkin');
    expect(data.bookingdates).toHaveProperty('checkout');
  


  });


  test('Booking - GetBookingIds Filter by checkin/checkout date', async({request})=>{

    const checkin = '2014-03-13';
    const checkout = '2014-05-21';

    const response = await request.get(`https://restful-booker.herokuapp.com/booking?checkin=${checkin}&checkout=${checkout}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(data);

    for(let elem of data){
      expect(elem).toHaveProperty('bookingid');
    }

  });


  test('Booking - GetBookingIds Filter by name', async({request})=>{

      const firstname = 'sally';
      const lastname = 'brown';

      const response = await request.get(`https://restful-booker.herokuapp.com/booking?firstname=${firstname}&lastname=${lastname}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      console.log(data);

      for(let elem of data){
        expect(elem).toHaveProperty('bookingid');
      }

  });


  test('Booking - CreateBooking', async({request})=>{
    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      headers: {'Content-Type': 'application/json'},
      data: {
          "firstname" : "Jim",
          "lastname" : "Brown",
          "totalprice" : 111,
          "depositpaid" : true,
          "bookingdates" : {
              "checkin" : "2018-01-01",
              "checkout" : "2019-01-01"
          },
          "additionalneeds" : "Breakfast"
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('bookingid');
    expect(data).toHaveProperty('booking');

    expect(data.booking).toHaveProperty('firstname', 'Jim');
    expect(data.booking).toHaveProperty('lastname', 'Brown');
    expect(data.booking).toHaveProperty('totalprice', 111);
    expect(data.booking).toHaveProperty('depositpaid', true);
    
    expect(data.booking).toHaveProperty('bookingdates');
    expect(data.booking.bookingdates).toHaveProperty('checkin', '2018-01-01');
    expect(data.booking.bookingdates).toHaveProperty('checkout', '2019-01-01');

    expect(data.booking).toHaveProperty('additionalneeds');

  });

})



test.describe('With Auth Tests: ', ()=>{


    let token: string;


    test.beforeEach( async({request})=>{
      const response = await request.post('https://restful-booker.herokuapp.com/auth', {
          headers: {'Content-Type': 'application/json'},
          data: { "username" : "admin", "password" : "password123"}
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();  
      expect(data).toHaveProperty('token');

      token = data.token;
    });



    test('Booking - UpdateBooking', async({request})=>{

      const updateData = {
        "firstname" : "James",
        "lastname" : "Brown",
        "totalprice" : 111,
        "depositpaid" : true,
        "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
        },
        "additionalneeds" : "Breakfast"
      };
      const id = 1;

      const response = await request.put(`https://restful-booker.herokuapp.com/booking/${id}`, {
        headers: {'Content-Type': 'application/json', 'Accept' : 'application/json', 'Cookie': `token=${token}`},
        data:  updateData 
      }
      );

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json(); 

      expect(data).toHaveProperty('firstname', updateData.firstname);
      expect(data).toHaveProperty('lastname', updateData.lastname);
      expect(data).toHaveProperty('totalprice', updateData.totalprice);
      expect(data).toHaveProperty('depositpaid', updateData.depositpaid);
      
      expect(data).toHaveProperty('bookingdates');
      expect(data.bookingdates).toHaveProperty('checkin', updateData.bookingdates.checkin);
      expect(data.bookingdates).toHaveProperty('checkout', updateData.bookingdates.checkout);
      expect(data).toHaveProperty('additionalneeds', updateData.additionalneeds);
    
});

test('Booking - PartialUpdateBooking', async({request})=>{
  // HOMEWORK
  const bookingid = 1;
  const partialData = { firstname: "James", lastname: "Brown" };
  const patchRes = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `token=${token}`
      },
      data: partialData
  });

  expect(patchRes.ok()).toBeTruthy();
  expect(patchRes.status()).toBe(200);

  const updatedData = await patchRes.json();

  expect(updatedData).toHaveProperty('firstname', partialData.firstname);
  expect(updatedData).toHaveProperty('lastname', partialData.lastname);

  expect(updatedData).toHaveProperty('totalprice');
  expect(updatedData).toHaveProperty('depositpaid');
  expect(updatedData).toHaveProperty('bookingdates');
  expect(updatedData.bookingdates).toHaveProperty('checkin');
  expect(updatedData.bookingdates).toHaveProperty('checkout');
  expect(updatedData).toHaveProperty('additionalneeds');
});
    test('Booking - DeleteBooking', async({request}) => {

    const createRes = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: {'Content-Type': 'application/json'},
        data: {
            firstname: "Temp",
            lastname: "Delete",
            totalprice: 50,
            depositpaid: true,
            bookingdates: {
                checkin: "2026-01-01",
                checkout: "2026-01-02"
            }
        }
    });

    const { bookingid } = await createRes.json();
    const deleteRes = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
        headers: { 'Cookie': `token=${token}` }
    });

    expect(deleteRes.status()).toBe(201);

  });
});

