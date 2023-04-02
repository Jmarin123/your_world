describe('test if guest button results in home screen', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('[data-cy="guestButton"]').click()
    cy.location('pathname').should('eq', '/home')
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