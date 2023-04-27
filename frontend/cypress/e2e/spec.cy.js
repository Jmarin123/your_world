let email = ""
let password = ""

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

before(() => {
  email = makeid(10) + "@domain.com";
  password = makeid(20);
})

describe('Test if guest button results in home screen', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('[data-cy="guestButton"]').click()
    cy.location('pathname').should('eq', '/public')
  })
})


describe('Goto register and type information', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('[data-cy="registerButton"]').click()
    cy.location('pathname').should('eq', '/register')
    cy.get("#username").type("Water")
    cy.get('#firstName').type("John")
    cy.get('#lastName').type("Smith")
    cy.get('#email').type("check@gmail.com")
    cy.get('#password').type("password")
    cy.get('#repassword').type("password")
  })
})

describe('Register and login', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('[data-cy="registerButton"]').click();
    cy.location('pathname').should('eq', '/register');
    cy.get("#username").type("Water");
    cy.get('#firstName').type("John");
    cy.get('#lastName').type("Smith");
    cy.get('#email').type(`${email}`);
    cy.get('#password').type(`${password}`);
    cy.get('#repassword').type(`${password}`);
    cy.get('[data-cy="registerButton"]').click();
    cy.location('pathname').should('eq', '/login')
  })
})

describe('Try to login', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('[data-cy="loginButton"]').click();
    cy.location('pathname').should('eq', '/login');
    cy.get('#loginInput').type(`${email}`);
    cy.get('#loginPassword').type(`${password}`);
    cy.get('#loginButton').click();
    cy.location('pathname').should('eq', '/home')
  })
})

describe('Traverse around while logged in', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="loginButton"]').click();
    cy.location('pathname').should('eq', '/login');
    cy.get('#loginInput').type(`${email}`);
    cy.get('#loginPassword').type(`${password}`);
    cy.get('#loginButton').click();
    cy.location('pathname').should('eq', '/home')
  })

  it('Try to upload geofile', () => {
    cy.get('[data-cy="upload-menu-btn"]').click();
    cy.get('[data-cy="upload-geojson-btn"]').should('be.visible').click();
    cy.get('[data-cy="upload-geojson"]').selectFile('cypress/fixtures/custom.geo_4.json');
    cy.get('[data-cy="upload-confirm"]').click();
    cy.url().should('include', '/map/');
  })

  it('Try to upload shp and dbf', () => {
    cy.get('[data-cy="upload-menu-btn"]').click();
    cy.get('[data-cy="upload-shp-dbf-btn"]').should('be.visible').click();
    cy.get('[data-cy="upload-shp"]').selectFile('cypress/fixtures/ARG_adm0.shp');
    cy.get('[data-cy="upload-dbf"]').selectFile('cypress/fixtures/ARG_adm0.dbf');
    cy.get('[data-cy="upload-confirm"]').click();
    cy.url().should('include', 'map/');
  })

  it('Copy a map', () => {
    cy.get('[data-cy="dup-btn"]').first().click();
    cy.get('[data-cy="list-of-cards"]').children().should('have.lengthOf', 3);
  })

  it('Rename a map', () => {
    cy.get('[data-cy="title-of-map-card"]').first().contains('Untitled');
    cy.get('[data-cy="rename-btn"]').first().click();
    cy.get('[data-cy="rename-map-text"]').type("Test!");
    cy.get('[data-cy="rename-map-confirm"]').click();
  })

  it('Enter a map', () => {
    cy.get('[data-cy="list-of-cards"]').children().first().dblclick();
    cy.url().should('include', '/map/');
  })

  it('Enter a map and publish', () => {
    cy.get('[data-cy="list-of-cards"]').children().first().dblclick();
    cy.url().should('include', '/map/');
    cy.get('#publishButton').click();
    cy.location('pathname').should('eq', '/home')
  })



  it('Delete all maps', () => {
    cy.get('[data-cy="del-btn"]').first().click();
    cy.get('[data-cy="delete-map-confirm"]').click();
    cy.get('[data-cy="list-of-cards"]').children().should('have.lengthOf', 2);
    cy.get('[data-cy="del-btn"]').first().click();
    cy.get('[data-cy="delete-map-confirm"]').click();
    cy.get('[data-cy="list-of-cards"]').children().should('have.lengthOf', 1);
    cy.get('[data-cy="del-btn"]').first().click();
    cy.get('[data-cy="delete-map-confirm"]').click();
    cy.get('[data-cy="list-of-cards"]').children().should('have.lengthOf', 0);
  })


  it('Logout', () => {
    cy.get('[data-cy="login-or-logout-value"]').click();
    cy.get('[data-cy="logout-menu"]').should('be.visible').click();
    cy.get('[data-cy="logout-menu-btn"]').click()
    cy.location('pathname').should('eq', '/')
  })

})


describe('Navigate while guest', () => {
  it('Different Feature in banner', () => {
    cy.visit('/');
    cy.get('[data-cy="guestButton"]').click()
    cy.location('pathname').should('eq', '/public')
    cy.get('[data-cy="upload-menu-btn"]').parent().should('be.disabled');
    cy.get('[data-cy="login-or-logout-value"]').click();
    cy.get('[data-cy="guest-login-register-btn"]').should('be.visible');
    cy.get('[data-cy="home-icon"]').should('be.disabled');
  })

})