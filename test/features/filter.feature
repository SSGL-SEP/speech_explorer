Feature: Filter
  As a user
  I want to be able to filter sound samples


  Scenario: Deactivate filter checkbox for phonem s
    Given I navigate to the homepage
    When I open folder "voice"
    And I click on checkbox of phonem s
    Then I should see "5" active samples

  Scenario: On start-up I want to see all points active
    Given I navigate to the homepage
    Then I should see all points being active