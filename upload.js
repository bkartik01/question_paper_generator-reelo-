const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL
const mongoURL = 'my_mongo_url';

// Database and collection names
const dbName = 'questionPaperDB';
const collectionName = 'questions';
// elements ,algebra, cell biology, world history , topography,mechanics 
// Sample questions
//easy=elemeents,world historty
//medium=cell,topograhy
//hard=algebra,mech
const sampleQuestions = [
  { question: 'What is the chemical symbol for gold?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Solve the equation: 2x + 5 = 15', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Explain the process of photosynthesis', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'Who was the first President of the United States?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
  { question: 'Name the largest river in the world', subject: 'Geography', topic: 'topography', difficulty: 'Medium', marks: 10 },
  { question: 'State the laws of motion', subject: 'Physics', topic: 'Mechanics', difficulty: 'Hard', marks: 15 },
  { question: 'What is Avogadro\'s number?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Find the derivative of y = 3x^2 + 2x - 1', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Describe the structure of DNA', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'When did World War II end?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
  { question: 'Identify the capital of Australia', subject: 'Geography', topic: 'topography', difficulty: 'Medium', marks: 10 },
  { question: 'Explain the concept of momentum', subject: 'Physics', topic: 'Mechanics', difficulty: 'Hard', marks: 15 },
  { question: 'What is the pH of a neutral solution?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Evaluate the integral: ∫(2x + 3) dx', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15},
  { question: 'Define natural selection', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'Who wrote "Romeo and Juliet"?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5},
  { question: 'Name the longest mountain range in the world', subject: 'Geography', topic: 'topography', difficulty: 'Medium', marks: 10 },
  { question: 'Explain the concept of gravity', subject: 'Physics', topic: 'Mechanics', difficulty: 'Hard', marks: 15 },
  { question: 'What is the atomic number of oxygen?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Find the value of π (pi) correct to three decimal places', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Name the process by which plants make their own food', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'Who was the first female Prime Minister of India?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
  { question: 'Which country is known as the Land of the Rising Sun?', subject: 'Geography', topic: 'topography', difficulty: 'Medium', marks: 10 },
  { question: 'Explain the concept of acceleration', subject: 'Physics', topic: 'Mechanics', difficulty: 'Hard', marks: 15 },
  { question: 'What is the common name for sodium bicarbonate?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Simplify the expression: (2x + 3)(x - 4)', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Name the largest mammal on Earth', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'What is the atomic number of carbon?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Find the value of √25', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Name the largest organ in the human body', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'Who discovered penicillin?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
  { question: 'Identify the longest river in South America', subject: 'Geography', topic: 'topography', difficulty: 'Medium', marks: 10 },
  { question: 'What is the formula for calculating work in physics?', subject: 'Physics', topic: 'Mechanics', difficulty: 'Hard', marks: 15 },
  { question: 'Which gas is responsible for the smell of rotten eggs?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Simplify the expression: 3(x + 2) - 2(x - 1)', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Explain the concept of natural selection in evolution', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'Who wrote "The Iliad"?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
  { question: 'What is the chemical formula for water?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Solve the quadratic equation: x^2 - 4x + 4 = 0', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Explain the process of mitosis', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10},
  { question: 'Who was the first Emperor of China?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
  { question: 'Name the driest desert in the world', subject: 'Geography', topic: 'topography', difficulty: 'Medium', marks: 10 },
  { question: 'What is the SI unit of force?', subject: 'Physics', topic: 'Mechanics', difficulty: 'Hard', marks: 15 },
  { question: 'What is the common name for ascorbic acid?', subject: 'Chemistry', topic: 'Elements', difficulty: 'Easy', marks: 5 },
  { question: 'Calculate the area of a triangle with base 8 units and height 10 units', subject: 'Mathematics', topic: 'Algebra', difficulty: 'Hard', marks: 15 },
  { question: 'Describe the process of DNA replication', subject: 'Biology', topic: 'Cell Biology', difficulty: 'Medium', marks: 10 },
  { question: 'In which year did the Apollo 11 mission land on the moon?', subject: 'History', topic: 'World History', difficulty: 'Easy', marks: 5 },
];
// Connect to MongoDB and seed the database

async function seedDatabase() {
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const questionsCollection = db.collection(collectionName);

    // Insert sample questions
    await questionsCollection.insertMany(sampleQuestions);

    console.log(`${sampleQuestions.length} questions inserted successfully`);

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Call the function to seed the database
seedDatabase();
