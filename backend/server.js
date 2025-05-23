import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import Cookies from "js-cookie";
import axios from "axios";

import { User } from "./models/user.js";
import { Subject } from "./models/subject.js";
import { SubTopic } from "./models/subtopic.js";
import { SuggestedTopic } from "./models/sugTopic.js";
import { SmallTopic } from "./models/smallTopic.js";
import { boardSubjects } from "./models/boardsubject.js";
import { Coursechallenge } from "./models/coursechallenge.js";

import dotenv from "dotenv";
dotenv.config();

// Gemini Api endpoint
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//Mongoose cnnect funtion
let connection = await mongoose.connect(process.env.MONGO_URL);

//Cors prefrences
// const corsOptions = {
//   origin: "", // Allow requests from this origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Allow co  okies to be sent
//   optionsSuccessStatus: 204,
// };

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === "http://localhost:5173" || origin === "https://ai-learn-mate.onrender.com") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Initializing sessions
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 86400000, secure: false },
  })
);

app.get("/auth/check-session", (req, res) => {
  if (req.session.userData) {
    res.status(200).json({ user: req.session.userData });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;

  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });

  if (!user) {
    return res.status(400).json({ message: "Email not registered" });
    console.log("failed");
  } else if (user.password != password) {
    return res.status(400).json({ message: "wrong password" });
    console.log("failed");
  } else if (user.password == password) {
    req.session.userData = user;
    Cookies.set("userCookie", "user", { expires: 29 });
    return res.status(200).json({ user });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function () {});
  res.status(200).json("success");
});

app.post("/signup", (req, res) => {
  const user = {
    name: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword,
    age: req.body.userAge,
    education: req.body.userEducation,
    board: req.body.userBoard,
  };
  try {
    const UserData = new User(user);
    UserData.save();
    res.status(200).json({ message: "successfully data entered" });
  } catch (err) {
    res.status(400).json({ message: "error" });
    console.log(err);
  }
});

app.post("/chatbot", (req, res) => {
  const prompt = req.body.input;
  const content = req.body.content;

  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });

    const result1 = await chat.sendMessage(
      'you are a teacher and a student is asking you question related to study only answer if the question is related to study otherwise say "I cant answer that" and if you answer only in paragraph and shortest form possible no * included. and you have to answer in refrence to ' +
        req.body.content +
        " ignore the tags of html. Ouestion : " +
        prompt
    );
    res.send(result1.response.text());
  }
  run();
});

app.post("/explore", async (req, res) => {
  const subject = await Subject.find({}).catch((err) => {
    console.log(err);
  });
  res.send(subject);
});

app.post("/exploreBoard", async (req, res) => {
  const boardsub = await boardSubjects
    .find({ std: req.body.education })
    .catch((err) => {
      console.log(err);
    });
  res.send(boardsub);
});

app.post("/opted", async (req, res) => {
  const subTopic = await User.find({ email: req.body.user }, "subtopic").catch(
    (err) => {
      console.log(err);
    }
  );
  res.send(subTopic);
});

app.post("/setoption", async (req, res) => {
  const user = req.body.user;
  let topics = [];

  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });

    const resultSpell = await chat.sendMessage(
      `check the spelling of word ${req.body.option} if its wrong then return the right word in [] and if its correct then return as it is in [] and make first letter capital.`
    );
    const ins = resultSpell.response.text();
    const sIndex = ins.indexOf("[");
    const eIndex = ins.indexOf("]");
    const spelledTopic = ins.substring(sIndex + 1, eIndex);

    const result0 = await chat.sendMessage(
      ` check if ${spelledTopic}} belongs to subject ${req.body.subject} or not. if belongs then give response [1] and if not then [0] `
    );
    const inputString0 = result0.response.text();
    const startIndex0 = inputString0.indexOf("[");
    const endIndex0 = inputString0.indexOf("]");
    const result_zero = inputString0.substring(startIndex0 + 1, endIndex0);

    if (result_zero == 1) {
      const result1 = await chat.sendMessage(
        `give an array of around 10-12 topics related to ${spelledTopic} in subject ${req.body.subject}. the response should be array. no other text should be in the response.response should be without any "\n" or any text. ex : ["example topic"]  `
      );
      const inputString = result1.response.text();
      const startIndex = inputString.indexOf("[");
      const endIndex = inputString.indexOf("]");
      const result = inputString.substring(startIndex, endIndex + 1);
      topics = JSON.parse(result);
      try {
        const response = await User.updateOne(
          { email: user },
          {
            $push: {
              subtopic: {
                name: spelledTopic,
                progress: 0,
                subject: req.body.subject,
                level: "beginner",
                smallTopics: topics,
              },
            },
          },
          { new: true }
        );
        for (let index = 0; index < topics.length; index++) {
          const smallUser = new SmallTopic({
            user: user,
            name: topics[index],
            subject: req.body.subject,
            subtopic: spelledTopic,
            isLoaded: false,
            completed: false,
            htmlContent: null,
            order: index,
          });
          smallUser.save();
        }

        res.send("1");
      } catch (err) {
        res.send("0");
      }
    } else {
      res.send("0");
    }
  }
  run();
});

app.post("/subject", async (req, res) => {
  const response = await SubTopic.find({
    subject: req.body.subject,
    level: req.body.level,
  });
  res.send(response);
});

//Route for fetching Youtube links
app.post("/yt", async (req, res) => {
  const apiKey = process.env.YT_API_KEY; // Replace with your API key
  const query = `teaching ${req.body.opt}`; // Search query
  const maxResults = 5; // Number of results to return

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${maxResults}&key=${apiKey}`;
  const linkArray = [];
  const run = async () => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      const videos = response.data.items;
      videos.forEach((video) => {
        if (video.id.videoId) {
          linkArray.push(`https://www.youtube.com/watch?v=${video.id.videoId}`);
        }
      });
      res.send(linkArray);
    } catch (error) {
      console.log(error);
    }
  };
  run();
});

app.post("/course", async (req, res) => {
  const topic = req.body.topic;
  const level = req.body.level;
  const smallTopic = req.body.smallTopic;

  const response = await SmallTopic.find({
    user: req.body.user,
    subtopic: topic,
    subject: req.body.subject,
    name: smallTopic,
  });

  if (response[0]) {
    if (response[0].isLoaded == false) {
      async function run() {
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({ history: [] });
        const result1 = await chat.sendMessage(
          "teach me in detail with every necessary topic and with example and practice questions regarding the teached topic " +
            smallTopic +
            " " +
            level +
            " level.  in response replace ** with h1 tag gnewive every h1 tag classname `dangH1`give classname like react className and replace evey * with p tag. response must not contain any '*' or '**' characters. each content should be in html div tag nothing should be outside html div tag remove ```html and ``` from the response."
        );
        // res.send(result1.response.text());

        const fuser = await SmallTopic.updateOne(
          {
            user: req.body.user,
            subtopic: topic,
            subject: req.body.subject,
            name: smallTopic,
          },
          { $set: { htmlContent: result1.response.text(), isLoaded: true } }
        );

        const finduser = await SmallTopic.find({
          user: req.body.user,
          subtopic: topic,
          subject: req.body.subject,
          name: smallTopic,
        });
        res.send(finduser[0].htmlContent);
      }
      run();
    } else {
      const finduser = await SmallTopic.find({
        user: req.body.user,
        subtopic: topic,
        subject: req.body.subject,
        name: smallTopic,
      });
      res.send(finduser[0].htmlContent);
    }
  }
});

app.post("/getTopic", async (req, res) => {
  const topic = req.body.topic;
  const subject = req.body.subject;
  const email = req.body.user;
  let topics = [];
  const userData = await User.find({
    email: email,
    subtopic: {
      $elemMatch: { name: topic, subject: subject },
    },
  });
  if (userData[0]) {
    for (let index = 0; index < userData[0].subtopic.length; index++) {
      if (
        userData[0].subtopic[index].name == topic &&
        userData[0].subtopic[index].subject == subject
      ) {
        topics = userData[0].subtopic[index].smallTopics;
      }
    }
  }

  const topicData = await SmallTopic.find({
    user: email,
    subject: subject,
    subtopic: topic,
  });

  const topicArray = [];

  topicData.forEach((data) => {
    const index = data.order;
    topicArray[index] = {
      name: data.name,
      completed: data.completed,
    };
  });
  console.log(topicArray);

  res.send(topicArray);
});

app.post("/getsugTopic", async (req, res) => {
  const topic = req.body.topic;
  const subject = req.body.subject;
  const email = req.body.user;
  let topics = [];
  const userData = await User.find({
    email: email,
    subtopic: {
      $elemMatch: { name: topic, subject: subject },
    },
  });
  if (userData[0]) {
    for (let index = 0; index < userData[0].subtopic.length; index++) {
      if (
        userData[0].subtopic[index].name == topic &&
        userData[0].subtopic[index].subject == subject
      ) {
        topics = userData[0].subtopic[index].sugTopic;
      }
    }
  }
  res.send(topics);
});

app.post("/exam", (req, res) => {
  const topic = req.body.topic;
  const level = req.body.level;
  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });
    const result1 = await chat.sendMessage(
      `create an mcq test on topic ${topic}. The test should be of 10 questions. the level of exam should be ${level} level. and the response must follow the structure given here and no other text of character should be there in response other that array itself. [{question:"question of mcq",options:[option1,option2,option3,option4],correctAnswer:"correact answer"}]  ` +
        "dont add the ```json and ``` in the response"
    );
    res.send(result1.response.text());
  }
  run();
});

app.post("/coursechallenge", (req, res) => {
  const examData = {
    user: req.body.user,
    subject: req.body.subject,
    subtopic: req.body.subtopic,
    topics: req.body.topics,
  };
  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: [] });
    const result1 = await chat.sendMessage(
      `create an mcq test on subject ${examData.subject}. On topic ${examData.subtopic} and the exam should cover ${examData.topics} all these topics.  The test should be of 15 questions.  and the response must follow the structure given here and no other text of character should be there in response other that array itself. [{question:"question of mcq",options:[option1,option2,option3,option4],correctAnswer:"correact answer"}]  ` +
        "dont add the ```json and ``` in the response"
    );

    res.send(result1.response.text());
  }
  run();
});

app.post("/submitExam", async (req, res) => {
  const examData = {
    user: req.body.user,
    subject: req.body.subject,
    topic: req.body.topic,
    level: req.body.level,
    test: req.body.test,
    userAnswers: req.body.userAnswers,
    score: req.body.score,
    smallTopic: req.body.smallTopic,
  };

  if (examData.score >= 8) {
    try {
      const examUser = await SmallTopic.updateOne(
        {
          user: examData.user,
          name: examData.smallTopic,
          subject: examData.subject,
          subtopic: examData.topic,
        },
        { $set: { completed: true } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  if (examData.level == "beginner" && examData.score >= 8) {
    try {
      const userFound = await User.find({
        email: examData.user,
        subtopic: {
          $elemMatch: { name: examData.topic, subject: examData.subject },
        },
      });
      userFound[0].subtopic.map((text, index) => {
        if (text.name == examData.topic && text.subject == examData.subject) {
          text.level = "intermidiate";
        }
      });
      userFound[0].save();
      res.send(userFound);
    } catch (err) {
      console.log(err);
    }
  } else if (examData.level == "intermidiate" && examData.score >= 8) {
    try {
      const userFound = await User.find({
        email: examData.user,
        subtopic: {
          $elemMatch: { name: examData.topic, subject: examData.subject },
        },
      });
      userFound[0].subtopic.map((text, index) => {
        if (text.name == examData.topic && text.subject == examData.subject) {
          text.level = "pro";
        }
      });
      userFound[0].save();
      res.send(userFound);
    } catch (err) {
      console.log(err);
    }
  } else if (examData.level == "pro" && examData.score >= 8) {
    try {
      const userFound = await User.find({
        email: examData.user,
        subtopic: {
          $elemMatch: { name: examData.topic, subject: examData.subject },
        },
      });
      userFound[0].subtopic.map((text, index) => {
        if (text.name == examData.topic && text.subject == examData.subject) {
          text.level = "complete";
        }
      });
      userFound[0].save();
      res.send(userFound);
    } catch (err) {
      console.log(err);
    }
  }

  try {
    const response = await User.updateOne(
      { email: examData.user },
      {
        $push: {
          exam: {
            subject: examData.subject,
            topic: examData.topic,
            level: examData.level,
            test: examData.test,
            score: examData.score,
            userAnswers: examData.userAnswers,
            smallTopic: examData.smallTopic,
          },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }

  if (examData.score < 8) {
    async function run() {
      // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({ history: [] });
      const result1 = await chat.sendMessage(
        `you are a exam evaluater this is the exam data from user subject: ${examData.subject}, topic: ${examData.topic}, testData: ${examData.test}, users answers in order of questions; ${examData.userAnswers}, score: ${examData.score}  if user scores low marks then return a array of suggested topic user lacs in. in response only provide the array of suggested topic nothing else and if user scores good then return null array.`
      );
      // const sugTopic = result1.response.text();
      const inputString0 = result1.response.text();
      const startIndex0 = inputString0.indexOf("[");
      const endIndex0 = inputString0.indexOf("]");
      const sugTopic = JSON.parse(
        inputString0.substring(startIndex0, endIndex0 + 1)
      );
      try {
        const response = await User.find({ email: examData.user });
        for (let index = 0; index < response[0].subtopic.length; index++) {
          if (
            response[0].subtopic[index].name == examData.topic &&
            response[0].subtopic[index].subject == examData.subject
          ) {
            response[0].subtopic[index].sugTopic = sugTopic;
            response[0].save();
          }
        }

        for (let i = 0; i < sugTopic.length; i++) {
          const sugresponse = new SuggestedTopic({
            name: sugTopic[i],
            smallTopic: examData.smallTopic,
            subtopic: examData.topic,
            subject: examData.subject,
            user: examData.user,
            complete: false,
          });
          sugresponse.save();

          const smallUser = new SmallTopic({
            user: examData.user,
            name: sugTopic[i],
            subject: examData.subject,
            subtopic: examData.topic,
            isLoaded: false,
            completed: false,
            htmlContent: null,
          });
          smallUser.save();
        }
      } catch (err) {
        console.log(err);
      }
    }
    run();
  }
});

app.post("/submitcourseChallenge", async (req, res) => {
  const examData = {
    user: req.body.user,
    subject: req.body.subject,
    topic: req.body.topic,
    test: req.body.test,
    userAnswers: req.body.userAnswers,
    score: req.body.score,
  };
  try {
    const response = new Coursechallenge({
      email: examData.user,
      subject: examData.subject,
      topic: examData.topic,
      test: examData.test,
      score: examData.score,
      userAnswers: examData.userAnswers,
    });
    response.save();
  } catch (err) {
    console.log(err);
  }
});

app.post("/getExamData", async (req, res) => {
  try {
    const data = await User.findOne({
      email: req.body.user,
    });

    res.send(data.exam);
  } catch (err) {
    console.log(err);
  }
});

app.post("/getStepper", async (req, res) => {
  const userData = {
    user: req.body.user,
    subtopic: req.body.subtopic,
    smallTopic: req.body.smallTopic,
    subject: req.body.subject,
  };

  try {
    const data = await SuggestedTopic.find({
      user: req.body.user,
      subtopic: req.body.subtopic,
      smallTopic: req.body.smallTopic,
      subject: req.body.subject,
    });

    const suggtopic = [];
    for (let index = 0; index < data.length; index++) {
      suggtopic.push(data[index].name);
    }
    res.send(suggtopic);
  } catch (err) {
    console.log(err);
  }
});

app.post("/getExamAnalysis", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.user,
    });
    x;
    res.send(user.exam);
  } catch (err) {
    console.log(err);
  }
});

app.post("/getAnalysisTopic", async (req, res) => {
  try {
    const topics = await User.find({
      email: req.body.user,
    });
    res.send(topics[0].exam);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log(`server running on port 3000`);
});
