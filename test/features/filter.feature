Feature: Filter
  As a user
  I want to be able to filter sound samples

  Scenario: On start-up I want to see all points active
    Given I navigate to the homepage
    Then I should see all samples being active

  Scenario: FilterAll and ShowAll buttons
    Given I navigate to the homepage
    When I press "ClearAll" button
    Then I should see "0" active samples
    When I press "SelectAll" button
    Then I should see all samples being active

  Scenario: Deactivate filter checkbox for phonem s
    Given I navigate to the homepage
    When I open folder "phonem"
    And I click on checkbox of phonem s
    Then I should see "184" active samples

