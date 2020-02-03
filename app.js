var rxjs = require("rxjs");
var inquirer = require("inquirer");

var prompts = new rxjs.Subject();

const questions = [{
    type: "input",
    message: "What´s the team member´s name?",
    name: "name" 
  },
  {
    type: "number",
    message: "What´s team member id?",
    name: "id" 
  }
];
const manQuestion =  {
  type: "number",
  message: "What´s the office number?",
  name: "office" 
};

const engQuestion = {
  type: "input",
  message: "What´s his/her GitHub username?",
  name: "github" 
};

const intQuestion =  {
  type: "input",
  message: "What´s his/her school name?",
  name: "school" 
};

const  positionQuestion = [
  {
    type: "list",
    message: "Who do you want to add?",
    name: "position",
    choices: ["Manager","Engineer", "Intern", "My team is complete!"]  
  }
];

function setupQuestions(teamMbrQst) {
  if(questions.length > 2 ){
    questions[2] = teamMbrQst;
  } else {
    questions.push(teamMbrQst);
  }
}

function callPositionQuestion() {
  inquirer.prompt(positionQuestion).then(function(answer) {     
    
    switch (answer.position) {
      case "Manager" :
        callManagerQuestion();
        break;
      case "Engineer" :
        callEngineerQuestion();
        break;
      case "Intern" :
        callInternQuestion();
        break;
      default :
        createPage();
        break;   
    }
  }).catch(function (err) {
    console.log(err);
  });
}

function callManagerQuestion() {
  setupQuestions(manQuestion);
  callQuestions();
}

function callEngineerQuestion() {
  setupQuestions(engQuestion);
  callQuestions();
}

function callInternQuestion() {
  setupQuestions(intQuestion);
  callQuestions();
}

function callQuestions() {
  inquirer.prompt(questions).then(function(answers) { 
    callPositionQuestion();
  }).catch(function (err) {
    console.log(err);
  });
}

function createPage() {

}

function init() {
  callPositionQuestion();
}

init();