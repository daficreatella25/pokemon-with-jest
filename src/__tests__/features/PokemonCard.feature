Feature: Testing PokemonCard Component

Scenario: Render Pokemon Card
  Given I am on a Pokemon Card
  Then I should see a loading indicator
  When the Pokemon data is loaded
  Then I should see the Pokemon name and sprite
  When I click the Pokemon Card
  Then I should navigate to Details Screen