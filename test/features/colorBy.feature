Feature: ColorBy
  As a user I want to change the tag which the points are colored by
  
  Scenario: Default coloring is chosen when dataset is loaded
    Given I navigate to the homepage
    When I open folder "phoneme"
    Then borders of "a" should be colored

