const inquirer = require("inquirer");
const fs = require('fs');
const Manager = require("./lib/manager");
const Intern = require("./lib/intern");
const Engineer = require("./lib/engineer");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const team =[];
const POS_MANAGER = "Manager";
const POS_ENGINEER = "Engineer";
const POS_INTERN = "Intern";

var  positionQuestion = [
  {
    type: "list",
    message: "Who do you want to add?",
    name: "position",
    choices: [POS_MANAGER, POS_ENGINEER, POS_INTERN, "My team is complete!"]  
  }
];

const fillTemplate = function(templateString, variables){
  return new Function("return `"+templateString +"`;").call(variables);
}

function setupQuestions(position, specificQuestion) {
  return [{
      type: "input",
      message: `What´s the ${position}´s name?`,
      name: "name" 
    },
    {
      type: "number",
      message: `What´s the ${position}´s id?`,
      name: "id",
      validate: validateId 
    },
    {
      type: "input",
      message: "What´s his/her email address?",
      name: "email" 
    },
    specificQuestion
  ];      
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
        createHTML();
        break;   
    }
  }).catch(function (err) {
    console.log(err);
  });
}

function callManagerQuestion() {
  positionQuestion[0].choices.splice(0, 1);
  const managerQstn = {type: "number", message: "What´s the Manager office number?", name: "office"};
  callQuestions(POS_MANAGER, setupQuestions(POS_MANAGER, managerQstn));
}

function callEngineerQuestion() {
  const engineerQstn = {type: "input", message: "What´s the Engineer GitHub username?", name: "github"};
  callQuestions(POS_ENGINEER, setupQuestions(POS_ENGINEER, engineerQstn));
}

function callInternQuestion() {
  const internQstn = {type: "input", message: "What´s the Intern school name?", name: "school"};
  callQuestions(POS_INTERN,  setupQuestions(POS_INTERN, internQstn));
}

function callQuestions(position, questions) {
  inquirer.prompt(questions).then(function(answers) { 
    createTeamMember(position, answers);
    callPositionQuestion();
  }).catch(function (err) {
    console.log(err);
  });
}

function createTeamMember(position, ans) {
  var member = {};
  
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

function validateId(value) {
  const exist = team.filter(t =>{ if (t.id === value) return true });
  
  if( isNaN(parseInt(value))) {
    return  'Please enter a Integer number';
  } else if (exist.length === 0) {
    return true;
  } else {
    return `${value} already in use! Please select another ID.`;
  }
}

function createHTML() {
  readFileAsync("./templates/main.html", "utf8").then(function(data) {
    readFileAsync("./templates/manager.html", "utf8").then(function(managerDiv) {
      var manager  = filterTeamByPosition(POS_MANAGER);
      data = data.replace("MANAGER_DATA", fillTemplate(managerDiv, manager[0]));

      readFileAsync("./templates/engineer.html", "utf8").then(function(engTemplate) {
        var engineers  = filterTeamByPosition(POS_ENGINEER);
        var engDiv ='';
        engineers.forEach((eng) =>{ engDiv += fillTemplate(engTemplate, eng);} );   
        data = data.replace("ENGINEER_DATA",engDiv);
  
        readFileAsync("./templates/intern.html", "utf8").then(function(intTemplate) {
          var interns  = filterTeamByPosition(POS_INTERN);
          var intDiv ='';
          interns.forEach((int) =>{ intDiv += fillTemplate(intTemplate, int);} );   
          data = data.replace("INTERN_DATA",intDiv);
    
          writeHTML(data);
        });
      });
    });
  });
}

function filterTeamByPosition(position) {
  return team.filter((t) => {
    if (t.getRole() === position) {
      return t;
    }
  });     
}

function writeHTML(data) {
  fs.writeFile("./output/index.html", data, function(err) {
    if (err) {
      return console.log(err);
    }
    
  });
}

function init() {
  callPositionQuestion();
}

init();