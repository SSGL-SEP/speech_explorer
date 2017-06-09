Feature: Simple website test
  As a user
  I want to be able to load SSGL-SEP website
  
  Scenario: Site is up
    Given I navigate to the homepage
    Then I should see "SSGL-SEP" in title

