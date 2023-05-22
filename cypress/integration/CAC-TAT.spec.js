// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const THREE_SECS_IN_MS = 3000
    beforeEach(function () {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        
        cy.clock()

        cy.get('#firstName').type('Ana Luísa')
        cy.get('#lastName').type('Floriano')
        cy.get('#email').type('ana@exemplo.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECS_IN_MS)
        
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        
        cy.clock()

        cy.get('#firstName').type('Ana Luísa')
        cy.get('#lastName').type('Floriano')
        cy.get('#email').type('anaexemplo.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECS_IN_MS)
    })

    it('se um valor não-númerico for digitado no campo telefone, seu valor continuará vazio', function () {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        cy.get('#phone').type('abcdefgij')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preechido antes do envio do formulário', function () {
        cy.clock()
        
        cy.get('#firstName').type('Ana Luísa')
        cy.get('#lastName').type('Floriano')
        cy.get('#email').type('ana@exemplo.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Ana Luísa')
            .should('have.value', 'Ana Luísa')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Floriano')
            .should('have.value', 'Floriano')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('ana@exemplo.com')
            .should('have.value', 'ana@exemplo.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('12345678')
            .should('have.value', '12345678')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.clock()

        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('envia formulário com sucesso usando um comando customizado', function () {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function () {

        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')       
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {

        cy.get('#product')
            .select('blog')
            .should('have.value', 'blog')
    })

    it('seleciona um produto (Blog) por seu índice', function () {

        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function () {

        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', function () {

        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function () {

        cy.get('input[type="checkbox"]')
            .check()
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Ana Luísa')
        cy.get('#lastName').type('Floriano')
        cy.get('#email').type('ana@exemplo.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('seleciona um arquivo da pasta fixtures', function () {

        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function () {

        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
         cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')

    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing')
            .should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function () {
        cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
        cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function () {
        const longText = Cypress._.repeat('Teste', 20)
            
            cy.clock()
    
            cy.get('#firstName').type('Ana Luísa')
            cy.get('#lastName').type('Floriano')
            cy.get('#email').type('anaexemplo.com')
            cy.get('#open-text-area').type(longText, { delay: 0 })
            cy.get('button[type="submit"]').click()
    
            cy.get('.error').should('be.visible')
    
            cy.tick(THREE_SECS_IN_MS)
     })

     it('faz uma requisição HTTP', function () {

        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response) {
                 const { status, statusText, body } = response
                 expect(status).to.equal(200)
                 expect(statusText).to.equal('OK')
                 expect(body).to.include('CAC TAT')

            })

    })


})
