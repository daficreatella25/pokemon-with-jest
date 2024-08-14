Feature: Pokemon Card

Scenario: Render Pokemon Card
  Given I am on a Pokemon Card
  Then I should see the Pokemon name and sprite
  When I click the Pokemon Card
  Then I should navigate to Details Screen