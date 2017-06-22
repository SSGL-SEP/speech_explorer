Feature: ColorBy
  As a user I want to change the tag which the points are colored by
  
  Scenario: Default coloring is chosen when dataset is loaded
    Given I navigate to the homepage
    And Page is finished loading
    When I open folder "phoneme"
    Then border of "a" should be colored with "rgb(255, 229, 0)" and border width "10"

  Scenario: Changing color by tag works
    Given I navigate to the homepage
    And Page is finished loading
    When I open folder "stress"
    Then border of "unstressed" should be colored with "blue" and border width "3"
    When I change ColorBy to "stress"
    And I open folder "stress"
    Then border of "unstressed" should be colored with "rgb(0, 0, 255)" and border width "10"

