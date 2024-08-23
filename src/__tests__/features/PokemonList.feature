Feature: Pokemon List

Scenario: User interacts with Pokemon List
  Given I am a User loading the Pokemon List
  When I load the Pokemon List
  Then I should see a list of Pokemon
  When I search for a specific Pokemon
  Then I should see the search results
  When I select a Pokemon from the list
  Then I should navigate to the Pokemon Detail screen