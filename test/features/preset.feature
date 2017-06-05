Feature: Preset
  As a user I can save filters and load them later
  
  Scenario: I can create a new preset by pressing the new button
    Given I navigate to the homepage
	When I press the new button
    When I give input "preset1"
    Then I should see "preset1" in dropdown menu

  Scenario: I can delete a preset by pressing the delete button
    Given I navigate to the homepage
    When I press the new button
    When I give input "preset1"
    Then I should see "preset1" in dropdown menu
    When I press the delete button
    Then I should not find "preset1" in the dropdown menu
    And The preset should be set to default
