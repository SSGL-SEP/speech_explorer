Feature: Filter
  As a user
  I want to be able to filter sound samples

  Scenario: On start-up I want to see all points active
    Given I navigate to the homepage
    And Page is finished loading
    Then I should see "168/168" active samples

  Scenario: FilterAll and ShowAll buttons
    Given I navigate to the homepage
    And Page is finished loading
    When I press "ClearAll" button
    Then I should see "0/168" active samples
    When I press "SelectAll" button
    Then I should see "168/168" active samples

  Scenario: Deactivate filter checkbox for stress unstressed and voice voiced
    Given I navigate to the homepage
    And Page is finished loading
    When I open folder "stress"
    And I click on checkbox of "unstressed"
    Then I should see "68/168" active samples
    When I click on checkbox of "unstressed"
    And I open folder "voice"
    And I click on checkbox of "voiced"
    Then I should see "40/168" active samples

  Scenario: Folder toggle works
    Given I navigate to the homepage
    And Page is finished loading
    When I click folder checkbox off for "stress"
    Then I should see "0/168" active samples
    When I open folder "stress"
    And I click on checkbox of "unstressed"
    Then I should see "100/168" active samples
    When I click folder checkbox on for "stress"
    Then I should see "168/168" active samples