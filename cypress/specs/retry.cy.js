describe('Retry', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
  })

  it('should retry until comparison passes or limit is reached', () => {
    cy.visit('../../retry-example.html')
    cy.compareSnapshot({
      name: 'retry', 
      testThreshold: 0, 
      retryOptions: { limit: 6, delay: 1000 }
    })
  })
})
