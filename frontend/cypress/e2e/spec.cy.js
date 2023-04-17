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

describe('Goto register and create user', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('[data-cy="registerButton"]').click();
    cy.location('pathname').should('eq', '/register');
    cy.get("#username").type("Water");
    cy.get('#firstName').type("John");
    cy.get('#lastName').type("Smith");
    cy.get('#email').type("check@gmail.com");
    cy.get('#password').type("password");
    cy.get('#repassword').type("password");
    cy.get('[data-cy="registerButton"]').click();
    cy.location('pathname').should('eq', '/login')
  })
})

describe('Try to login', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('[data-cy="loginButton"]').click();
    cy.location('pathname').should('eq', '/login');
    cy.get('#loginInput').type("check@gmail.com");
    cy.get('#loginPassword').type("password");
    cy.get('[data-cy="registerButton"]').click();
    cy.location('pathname').should('eq', '/home')
  })
})