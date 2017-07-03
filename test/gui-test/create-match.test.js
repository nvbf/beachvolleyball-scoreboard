const DOMAIN = "http://localhost:3000";

function testFrontpage(browser) {
  browser
    .url(DOMAIN)
    .waitForElementVisible("h2", 7000)
    .assert.containsText("h2", "Beachvolleyball Scoreboard")
    .end();
}

function testMatch(browser) {
  const match = startMatchAndTestDefault(browser)
    .click("section div[role = 'alert'] button")
    .waitForElementVisible("div[class='panel panel-primary'", 1000)
    .click("button") // team A starts service
    .pause(50)
    .click("button") // player 1 on team A starts service
    .pause(50)
    .click("button") // player 1 on team b is first on their team
    .waitForElementVisible("h4", 100)
    .assert.containsText("h4", "Name of player1 (team A)")
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player1 (team A)")
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player1 (team B)")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Technical Timeout - 0")
    .click("button")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player2 (team A)")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Set finished")
    .click("button")
    .pause(10)
    .click("section div[role = 'alert'] button")
    .waitForElementVisible("div[class='panel panel-primary'", 1000)
    .click("button") // team a starts service
    .pause(50)
    .click("button") // player 1 on team a starts service
    .pause(50)
    .click("button") // player 1 on team b is first on their team
    .pause(50)
    .assert.containsText("h4", "Name of player1 (team A)")
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player1 (team B)")
    .assert.containsText(getPointsFromHomeTeamForSet1(), 21)
    .assert.containsText(getPointsFromAwayteamForSet1(), 2)
    .assert.containsText(getPointsFromHomeTeamForSet2(), 0)
    .assert.containsText(getPointsFromAwayteamForSet2(), 1)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player2 (team A)")
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player2 (team B)")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player1 (team A)")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(getPointsFromHomeTeamForSet2(), 3)
    .assert.containsText(getPointsFromAwayteamForSet2(), 2)
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Technical Timeout - 0")
    .click("button")
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Set finished")
    .click("button")
    .assert.containsText(getPointsFromHomeTeamForSet2(), 3)
    .assert.containsText(getPointsFromAwayteamForSet2(), 21)
    .click(setServiceOrder())
    .pause(10)
    .click(awayTeamStartsToServe())
    .pause(10)
    .click(playerBStartToServe())
    .pause(10)
    .click(playerBStartToServe())
    .pause(10)
    .assert.containsText("h4", "Name of player2 (team B)")
    .click(addPointAwayTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player2 (team A)")
    .click(addPointAwayTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player1 (team B)")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText("h4", "Name of player1 (team A)")
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Switch")
    .click("button")
    .click(addPointHomeTeam())
    .pause(10)
    .click(addPointHomeTeam())
    .pause(10)
    .assert.containsText(".panel-body", "Match Finished")
    .click("button")
    .end();
}

function setServiceOrder() {
  return "section div[role = 'alert'] button";
}

function awayTeamStartsToServe() {
  return chooseSecondButtonFromList();
}

function playerBStartToServe() {
  return chooseSecondButtonFromList();
}

function chooseSecondButtonFromList() {
  return ".list-group :nth-child(2)";
}

function addPointHomeTeam() {
  return "tbody tr:nth-of-type(1) button";
}

function addPointAwayTeam() {
  return "tbody tr:nth-of-type(2) button";
}

function getPointsFromSet2() {
  return "td:nth-of-type(3)";
}

function getPointsFromSet1() {
  return "td:nth-of-type(2)";
}

function getPointsFromAwayTeam() {
  return "tbody tr:nth-of-type(2) ";
}

function getPointsFromHomeTeam() {
  return "tbody tr:nth-of-type(1) ";
}

function getPointsFromHomeTeamForSet1() {
  return getPointsFromHomeTeam() + getPointsFromSet1();
}

function getPointsFromAwayteamForSet1() {
  return getPointsFromAwayTeam() + getPointsFromSet1();
}

function getPointsFromHomeTeamForSet2() {
  return getPointsFromHomeTeam() + getPointsFromSet2();
}

function getPointsFromAwayteamForSet2() {
  return getPointsFromAwayTeam() + getPointsFromSet2();
}

function runASetWithScore(browser, pointsA, pointsB) {
  for (var i = 0; i < pointsA; i++) {
    console.log(i);
    browser = browser.click(".points").pause(10);
    if (pointsA % 7 === 0) {
      browser.click("button").pause(10);
    }
  }
  return browser;
}

function startMatchAndTestDefault(browser) {
  return browser
    .url(`${DOMAIN}/match`)
    .waitForElementVisible("body", 1000)
    .setValue("#player1", "Name of player1 (team A)")
    .setValue("#player2", "Name of player2 (team A)")
    .click("button")
    .click("div[title = '#FFDC00'")
    .click("button[type = 'button']")
    .pause(100)
    .assert.containsText("h2", "Away team")
    .setValue("#player1", "Name of player1 (team B)")
    .setValue("#player2", "Name of player2 (team B)")
    .click("button")
    .click("div[title = '#2ECC40'")
    .click("button[type = 'button']")
    .pause(100)
    .assert.containsText("tbody div[color='#FFDC00']", "")
    .assert.containsText("tbody div[color='#2ECC40']", "")
    .assert.containsText(
      "tbody span[name = 'team-ffdc00']",
      "Name of player1 (team A) - Name of player2 (team A)"
    )
    .assert.containsText(
      "tbody span[name = 'team-2ecc40']",
      "Name of player1 (team B) - Name of player2 (team B)"
    )
    .assert.containsText(
      ".panel-footer div[role='toolbar'] :first-child",
      "Name of player1 (team A) - Name of player2 (team A)"
    )
    .assert.containsText(
      ".panel-footer div[role='toolbar'] :nth-child(2)",
      "Name of player1 (team B) - Name of player2 (team B)"
    );
}

function testTournaments(browser) {
  browser
    .url(`${DOMAIN}/tournaments`)
    .waitForElementVisible("h1", 1000)
    .assert.containsText("h1", "Tournaments")
    .end();
}

function testTournament(browser) {
  browser
    .url(`${DOMAIN}/tournament/NT%20Oslo%20Master`)
    .waitForElementVisible("h1", 19000)
    .assert.containsText("h1", "NT Oslo Master")
    .end();
}
module.exports = {
  match: testMatch
};

//  frontpage: testFrontpage,
//  tournaments: testTournaments,
//  tournament: testTournament
