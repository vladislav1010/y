Feature: Edit automation

  Scenario: Edit automation description
    Given base
    # TODO: The same as in the next scenario?
    And user with Owner, Creator permissions to the base
    And automation in the base
    When the user is on page of the automation
    And the user edits automation description
    Then the automation description is updated

  Scenario: Add automation trigger by clicking on button
    Given automation environment
    And user is capable of editing automation
    And blank automation
    When the user clicks button of adding trigger on the flow diagram
    # `And` signals multiple sequental user actions on the system
    And chooses a trigger type
    Then the trigger with empty configuration is added
    And trigger properties pane is opened
    And on the flow diagram is suggested adding actions and conditional actions
    And automation is saved within 3s on Fast 3G in 99.9% cases