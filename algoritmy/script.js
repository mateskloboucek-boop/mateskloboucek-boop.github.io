const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const answers = {
  q1: "c",
  q2: "b",
  q3: "c",
  q4: "a",
  q5: "a",
  q6: "a",
  q7: "b",
  q8: "c",
  q9: "a"
};

quiz.addEventListener("submit", function (event) {
  event.preventDefault();

  let score = 0;
  let unanswered = 0;

  Object.keys(answers).forEach(function (question) {
    const answer = quiz.querySelector('input[name="' + question + '"]:checked');

    if (!answer) {
      unanswered += 1;
    } else if (answer.value === answers[question]) {
      score += 1;
    }
  });

  if (unanswered > 0) {
    result.textContent = "Odpověz na všechny otázky.";
  } else {
    result.textContent = "Výsledek: " + score + " z " + Object.keys(answers).length;
  }
});
