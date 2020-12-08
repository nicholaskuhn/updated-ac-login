global.window = window
global.$ = require('jquery');
selectedId = "test"
var openEventBtn = document.getElementById('openEventBtn');

const animalModule = require('./animal.js');

test('Checks isValidDate', () => {
  expect(animalModule.isValidDate("02-14-20")).toBe(false);
  expect(animalModule.isValidDate("2020-10-10")).toBe(true);
  expect(animalModule.isValidDate("02-1402-20")).toBe(false);
  expect(animalModule.isValidDate("2020-01-06")).toBe(true);
  expect(animalModule.isValidDate("02-14-2020")).toBe(false);
  expect(animalModule.isValidDate("2020-01-01")).toBe(true);
  expect(animalModule.isValidDate("32-1402-20")).toBe(false);
  expect(animalModule.isValidDate("2020-07-16")).toBe(true);
});

test('Checks toTitleCase', () => {
  expect(animalModule.toTitleCase("dog")).toBe("Dog");
  expect(animalModule.toTitleCase("cat")).toBe("Cat");
  expect(animalModule.toTitleCase("boy")).toBe("Boy");
  expect(animalModule.toTitleCase("girl")).toBe("Girl");
  expect(animalModule.toTitleCase("Item")).toBe("Item");
  expect(animalModule.toTitleCase("Brick")).toBe("Brick");
  expect(animalModule.toTitleCase("Animal")).toBe("Animal");
  expect(animalModule.toTitleCase("Bird")).toBe("Bird");
});

test('Checks checkForImage', () => {
  expect(animalModule.checkForImage("jingle")).toEqual(["images/jingle.png",undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);
  expect(animalModule.checkForImage("nick")).toEqual([undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);

  expect(animalModule.checkForImage("blanca")).toEqual([undefined,"images/blanca.png",undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);

  expect(animalModule.checkForImage("blathers")).toEqual([undefined,"images/blathers.png",undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);

  expect(animalModule.checkForImage("kapp")).toEqual([undefined,"images/kappn.png",undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);

  expect(animalModule.checkForImage("kappn")).toEqual([undefined,"images/kappn.png",undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);

  expect(animalModule.checkForImage("kapp'n")).toEqual([undefined,"images/kappn.png",undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
  undefined,undefined,undefined,undefined
  ]);
});


test('Checks successfullyLoggedOut', () => {
  expect(animalModule.successfullyLoggedOut());
  expect(animalModule.successfullyLoggedOut()).toBeUndefined();
});

test('Checks successfullyLoggedIn', () => {
  expect(animalModule.successfullyLoggedIn()).toBe();
  expect(animalModule.successfullyLoggedIn()).toBeUndefined();
});

test('Checks handleLogin', () => {
  expect(animalModule.handleLogin()).toBe();
  expect(animalModule.handleLogin()).toBeUndefined();
});

test('Checks registerUserLogin', () => {
  expect(animalModule.registerUserLogin("nick","loggedUserIn","2020-10-10")).toBeUndefined();
  expect(animalModule.registerUserLogin("libbie","loggedUserIn","2020-10-10")).toBeUndefined();
});

test('Checks getRadioButtonSelection', () => {
  const mockFn = jest.fn().mockName('getRadioButtonSelection');
  mockFn();
  expect(mockFn).toHaveBeenCalled();
  expect(animalModule.getRadioButtonSelection()).toBe(undefined);
});

test('Checks runAddItem', () => {

});

test('Checks displayArrayData', () => {

});


test('Checks displayEventArrayData', () => {

});

test('Checks reloadCalendar', () => {

});

test('Checks addEventItem', () => {

});

test('Checks checkForEvent', () => {

});

test('Checks pageLoad', () => {

});

test('Checks getFromDatabase', () => {

});

test('Checks postItemToDatabase', () => {

});

test('Checks postToEvent', () => {

});

test('Checks getFromEventLoad', () => {

});

test('Checks getFromEvent', () => {

});
