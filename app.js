var inquirer = require("inquirer");
const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");

const team =[];
const POS_MANAGER = "Manager";
const POS_ENGINEER = "Engineer";
const POS_INTERN = "Intern";

const questions = [{
    type: "input",
    message: "What´s the team member´s name?",
    name: "name" 
  },
  {
    type: "number",
    message: "What´s team member id?",
    name: "id",
    validate: function(value) {
      const exist = team.filter(t =>{ if (t.id === value) return true });
      
      if (!exist) {
        return true;
      }

      return `${value} already in use! Please select another ID.`;
    } 
  }
];

var  positionQuestion = [
  {
    type: "list",
    message: "Who do you want to add?",
    name: "position",
    choices: [POS_MANAGER, POS_ENGINEER, POS_INTERN, "My team is complete!"]  
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
      case POS_MANAGER :
        callManagerQuestion();
        break;
      case POS_ENGINEER :
        callEngineerQuestion();
        break;
      case POS_INTERN :
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
  positionQuestion.choices.splice(0, 1);
  setupQuestions({type: "number", message: "What´s the office number?", name: "office"});
  callQuestions(POS_MANAGER);
}

function callEngineerQuestion() {
  setupQuestions({type: "input", message: "What´s his/her GitHub username?", name: "github"});
  callQuestions(POS_ENGINEER);
}

function callInternQuestion() {
  setupQuestions({type: "input", message: "What´s his/her school name?", name: "school"});
  callQuestions(POS_INTERN);
}

function callQuestions(position) {
  inquirer.prompt(questions).then(function(answers) { 
    createTeamMember(position, answers);
    callPositionQuestion();
  }).catch(function (err) {
    console.log(err);
  });
}

function createTeamMember(position, ans) {
  const member = {};
  
  switch (position) {
    case POS_MANAGER :
      member = new Manager(ans.name, ans.id, ans.email, ans.office);
      break;
    case POS_ENGINEER :
      member = new Engineer(ans.name, ans.id, ans.email, ans.github);
      break;
    case POS_INTERN :
      member = new Intern(ans.name, ans.id, ans.email, ans.school);
      break;
  }
  team.push(member);

}

function createPage() {

}

function init() {
  callPositionQuestion();
}

init();