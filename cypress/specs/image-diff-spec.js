it('should compare screenshot of the entire page', () => {
  cy.visit('../../report-example.html')
  cy.compareSnapshot('wholePage')
})

it('should compare screenshot from a given element', () => {
  cy.visit('../../report-example.html')
  cy.get('#report-header').compareSnapshot('element')
})
