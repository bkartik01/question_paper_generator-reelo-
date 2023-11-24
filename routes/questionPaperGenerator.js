const express = require('express');
const router = express.Router();
const Question = require('../models/question');

router.post('/generate', async (req, res) => {
  const totalMarks = parseInt(req.body.totalMarks);
  const easyMarks = parseInt((req.body.easyMarks/100)*totalMarks);
  const mediumMarks = parseInt((req.body.mediumMarks/100)*totalMarks);
  const hardMarks = parseInt((req.body.hardMarks/100)*totalMarks);

  let elements=parseInt((req.body.elements/100)*totalMarks);
  let history=parseInt((req.body.history/100)*totalMarks);
  let cell=parseInt((req.body.cell/100)*totalMarks);
  let topography=parseInt((req.body.topography/100)*totalMarks);
  let mechanics=parseInt((req.body.mechanics/100)*totalMarks);
  let algebra=parseInt((req.body.algebra/100)*totalMarks);
  
  
  //check if any percentage out of bound 
  if(totalMarks<0 || easyMarks<0 || mediumMarks<0 || hardMarks<0 || elements<0 ||history<0 ||cell<0 ||topography<0 ||mechanics<0|| algebra<0)
  {
    return res.status(400).send("Error: Percentages cannot be negetive." );
  }
  
  
  // Check if total percentage is 100 
  if ((parseInt(req.body.easyMarks) + parseInt(req.body.mediumMarks) + parseInt(req.body.hardMarks))!==100) {
   
    return res.status(400).send("Error: The sum of Easy, Medium, and Hard percentages should be 100. ");
  }
  const adder=elements+algebra+cell+history+topography+mechanics;

  //check if we want a topic wise distribution ,if yes if the distribution correct
  if(adder>0 && adder!==totalMarks)
  {
    return res.status(400).send("Topic distribution invalid, Please fill all the inputs for topic wise ditribution correctly.");
  }

  //Question difficulty and topic distribution mismatch
  if(adder && (easyMarks>elements+history || mediumMarks>cell+topography ||hardMarks >algebra+mechanics))
  {
    return res.status(400).send("Error: Mismatch between difficulty distribution and topic distribution");
  }
  
  //how many questions from each difficulty we want?
  
  let num_easy=easyMarks/5;
  let num_medium=mediumMarks/10;
  let num_hard=hardMarks/15;
  
  //check is split is possible
  if (easyMarks % 5 !== 0 || mediumMarks % 10 !== 0 || hardMarks % 15 !== 0) {
    return res.status(400).send("Error: Distribution not possible; the numbers from each section cannot be a decimal.");
  }
  if(elements % 5!==0 ||history % 5!==0 ||cell %10!==0 || topography %10 !==0 || algebra%15 !==0 ||mechanics%15 !==0)
  {
    return res.status(400).send("Error: Distribution not possible; the numbers from each topic cannot be a decimal.");
  }

 
  
  //Fetch questions from MongoDB
  const questions = await Question.find();
  
  // Validate if there are enough questions in the question bank
  let easyQuestionsCount = questions.filter(q => q.difficulty === "Easy").length;
  let mediumQuestionsCount = questions.filter(q => q.difficulty === "Medium").length;
  let hardQuestionsCount = questions.filter(q => q.difficulty === "Hard").length;

  if (num_easy > easyQuestionsCount || num_medium > mediumQuestionsCount || num_hard > hardQuestionsCount) {
    return res.status(400).send("Error: Not enough questions in the question bank for the specified distribution.");
  }

  //calculate how many questions from each topic you require
  let elereq=elements/5;
  let hisreq=history/5;
  let cellreq=cell/10;
  let toporeq=topography/10;
  let algebreq=algebra/15;
  let mechreq=mechanics/15;
 

  //caculate how many question of each topic you have
  let elemnum=0;
  let hisnum=0;
  let cellnum=0;
  let toponum=0;
  let mechnum=0;
  let algebnum=0;

  
  questions.forEach(e=>{
       if(e.topic==="Elements")
       {
          elemnum++;
       }
       else if(e.topic==="World History")
       {
        hisnum++;
       }
       else if(e.topic==="Cell Biology")
       {
        cellnum++;
       }
       else if(e.topic==="topography")
       {
        toponum++;
       }
       else if(e.topic==="Mechanics")
       {
        mechnum++;
       }
       else{
        algebnum++;
       }
  });

  //return if questions required from a topic are more than what is available
  if(elements>elemnum*5 || history>hisnum*5 || cell>cellnum*10 || topography>toponum*10 || algebra>algebnum*15 || mechanics>mechnum*15 )
  {
    return res.status(400).send("Not enough questions for the requiered subject questions");
  }

 
  
  let questionPaper=[];
  
  //if no topic wise distribution given make the question paper from random topic distribution
  if(adder===0){
  // Generate question paper
  const additionalQuestions= generateQuestionPaper(num_easy,num_medium,num_hard, questions);
  questionPaper=questionPaper.concat(additionalQuestions);
  }
  //else pick questions according to topic distribution given
  else{
  
    const additionalQuestions=generatetopicwisePaper(elereq,hisreq,cellreq,toporeq,algebreq,mechreq ,questions);
    questionPaper=questionPaper.concat(additionalQuestions);
  }
  // Render the result
  res.render('result', { questionPaper });
});

function generateQuestionPaper(num_easy,num_medium,num_hard, questions) {
  const questionPaper = [];
  const difficultyDistribution = [
    { difficulty: "Easy", count: num_easy },
    { difficulty: "Medium", count: num_medium },
    { difficulty: "Hard", count: num_hard }
  ];

  difficultyDistribution.forEach(({ difficulty, count }) => {
    const filteredQuestions = questions.filter(q => q.difficulty === difficulty);

    for (let i = 0; i < count && i < filteredQuestions.length; i++) {
      questionPaper.push(filteredQuestions[i]);
    }
  });

  return questionPaper;
}

function generatetopicwisePaper(elereq,hisreq,cellreq,toporeq,algebreq,mechreq ,questions)
{
  const questionPaper=[];
  questions.forEach(e=>{
    if(e.topic==="Elements" && elereq>0)
    {
      elereq--;
      questionPaper.push(e);
    }
    else if(e.topic==="World History" && hisreq>0)
    {
      hisreq--;
      questionPaper.push(e);
    }
    else if(e.topic==="Cell Biology" && cellreq>0)
    {
      cellreq--;
      questionPaper.push(e);
    }
    else if(e.topic==="topography" && toporeq>0)
    {
      toporeq--;
      questionPaper.push(e);
    }
    else if(e.topic ==="Algebra" && algebreq>0)
    {
      algebreq--;
      questionPaper.push(e);
    }
    else if(e.topic ==="Mechanics" && mechreq>0)
    {
      mechreq--;
      questionPaper.push(e);
    }
  })
  return questionPaper;

}


module.exports = router;
