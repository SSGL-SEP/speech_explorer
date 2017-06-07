Feature: Filter
  As a user
  I want to be able to filter sound samples

  Scenario: On start-up I want to see all points active
    Given I navigate to the homepage
    Given Page is finished loading
    Then I should see all samples being active

  Scenario: FilterAll and ShowAll buttons
    Given I navigate to the homepage
    Given Page is finished loading
    When I press "ClearAll" button
    Then I should see "0" active samples
    When I press "SelectAll" button
    Then I should see all samples being active

  Scenario: Deactivate filter checkbox for phoneme s
    Given I navigate to the homepage
    Given Page is finished loading
    When I open folder "phoneme"
    And I click on checkbox of phoneme s
    Then I should see "184" active samples

