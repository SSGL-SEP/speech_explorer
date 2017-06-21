Feature: Help
  As a user
  I want to be able to see instructions

  Scenario: Help can be shown and closed
    Given I navigate to the homepage
    And Page is finished loading
	When I click show help button
	Then I should see help
	When I click close help button
	Then I should not see help
