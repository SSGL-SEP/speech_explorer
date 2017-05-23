Feature: As a user I can play the selected sound sample

        Scenario: Clicked sound is played
            Given I navigate to "http://localhost:3000"
            When I click one random point
            Then sound is played

        