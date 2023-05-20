Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Ana Luísa')
    cy.get('#lastName').type('Floriano')
    cy.get('#email').type('ana@exemplo.com')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

})
