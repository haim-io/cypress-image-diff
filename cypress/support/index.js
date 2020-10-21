require('./commands')

after(() => {
  cy.task('generateReport')
})
