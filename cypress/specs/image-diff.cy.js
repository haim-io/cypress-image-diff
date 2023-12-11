describe('Visuals', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
  })

  it('should compare screenshot of the entire page', () => {
    cy.visit('../../report-example.html')
    cy.compareSnapshot('wholePage')
  })
  
  it('should compare screenshot of the entire page', () => {
    cy.visit('../../report-example.html')
    cy.compareSnapshot({
      name: 'wholePageThreshold', 
      testThreshold: 0.2
    })
  })
  
  it('should compare screenshot from a given element', () => {
    cy.visit('../../report-example.html')
    cy.get('#report-header').compareSnapshot('element')
  })

  it('should compare hide an element', () => {
    cy.visit('../../report-example.html')
    cy.get('#report-header').hideElement()
    cy.compareSnapshot('hideElement')
  })
})
