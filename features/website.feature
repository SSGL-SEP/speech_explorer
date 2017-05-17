Feature: Simple website test
  As a user
  I want to be able to load SSGL-SEP website
  
  Scenario: Site is up
    When I navigate to "http://localhost:3000"
    Then I should see "SSGL-SEP" in title
