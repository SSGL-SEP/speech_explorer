Feature: ColorBy
  As a user I want to change the tag which the points are colored by
  
  Scenario: Default coloring is chosen when dataset is loaded
    Given I navigate to the homepage
    And Page is finished loading
    When I open folder "phoneme"
    Then border of "a" should be colored with RGB "255, 229, 0"

