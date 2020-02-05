const inquirer = require("inquirer");
const fs = require('fs');
const Manager = require("./lib/manager");
const Intern = require("./lib/intern");
const Engineer = require("./lib/engineer");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const team =[];


var  positionQuestion = [
  {
    type: "list",
    message: "Who do you want to add?",
    name: "position",
    choices: [Manager.ROLE, Engineer.ROLE, Intern.ROLE, "My team is complete!"]  
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
      case Manager.ROLE :
        callManagerQuestion();
        break;
      case Engineer.ROLE :
        callEngineerQuestion();
        break;
      case Intern.ROLE :
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
  callQuestions(Manager.ROLE, setupQuestions(Manager.ROLE, managerQstn));
}

function callEngineerQuestion() {
  const engineerQstn = {type: "input", message: "What´s the Engineer GitHub username?", name: "github"};
  callQuestions(Engineer.ROLE, setupQuestions(Engineer.ROLE, engineerQstn));
}

function callInternQuestion() {
  const internQstn = {type: "input", message: "What´s the Intern school name?", name: "school"};
  callQuestions(Intern.ROLE,  setupQuestions(Intern.ROLE, internQstn));
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
    case Manager.ROLE :
      member = new Manager(ans.name, ans.id, ans.email, ans.office);
      break;
    case Engineer.ROLE :
      member = new Engineer(ans.name, ans.id, ans.email, ans.github);
      break;
    case Intern.ROLE :
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
    readFileAsync(Manager.TEMPLATE, "utf8").then(function(managerTemplate) {
      var manager  = filterTeamByPosition(Manager.ROLE);
      var manDiv ='';   
      manager.forEach((man) =>{  manDiv += fillTemplate(managerTemplate, man);} );   
      data = data.replace(Manager.HTML_PLACEHOLDER, manDiv);

      readFileAsync(Engineer.TEMPLATE, "utf8").then(function(engTemplate) {
        var engineers  = filterTeamByPosition(Engineer.ROLE);
        var engDiv ='';
        engineers.forEach((eng) =>{ engDiv += fillTemplate(engTemplate, eng);} );   
        data = data.replace(Engineer.HTML_PLACEHOLDER, engDiv);
  
        readFileAsync(Intern.TEMPLATE, "utf8").then(function(intTemplate) {
          var interns  = filterTeamByPosition(Intern.ROLE);
          var intDiv ='';
          interns.forEach((int) =>{ intDiv += fillTemplate(intTemplate, int);} );   
          data = data.replace(Intern.HTML_PLACEHOLDER, intDiv);
    
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