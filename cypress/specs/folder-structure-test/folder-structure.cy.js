describe('Visuals', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
  })

  it('should compare screenshot within a test in any folder structure', () => {
    cy.visit('../../../report-example.html')
    cy.compareSnapshot('wholePage')
  })
})
