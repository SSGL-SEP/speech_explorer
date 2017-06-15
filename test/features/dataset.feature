Feature: Dataset
  As a user
  I want to be able to switch the dataset used for visualization

  Scenario: Switching between sets works and filtering works
    Given I navigate to the homepage
    And Page is finished loading
    When I open folder "Dataset"
    When I change dataset to "testdata 13"
    And Page is finished loading
    Then I should see "13/13" active samples
    When I open folder "Filter"
    And I open folder "stress"
    And I click on checkbox of "stressed"
    Then I should see "8/13" active samples
