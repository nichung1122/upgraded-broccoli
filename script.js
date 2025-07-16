let answer = generateAnswer();
let attempts = [];
let maxTries = 10;

document.getElementById("guessForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("guessInput");
  const guess = input.value.trim();

  if (!isValidInput(guess)) {
    alert("올바른 3자리 숫자를 입력하세요. (서로 다른 숫자, 1~9)");
    return;
  }

  if (attempts.length >= maxTries) {
    return; // 이미 게임 종료됨
  }

  const result = checkGuess(guess, answer);
  attempts.push({ guess, result });
  updateHistory();
  updateRemaining();

  input.value = "";

  if (result.strikes === 3) {
    document.getElementById("result").textContent = `🎉 정답입니다! (${guess})`;
    disableInput();
  } else if (attempts.length >= maxTries) {
    document.getElementById("result").textContent = `😢 실패! 정답은 ${answer}입니다.`;
    disableInput();
  } else {
    document.getElementById("result").textContent = `${result.strikes} 스트라이크, ${result.balls} 볼`;
  }
});

document.getElementById("resetBtn").addEventListener("click", function () {
  answer = generateAnswer();
  attempts = [];
  document.getElementById("history").innerHTML = "";
  document.getElementById("result").textContent = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("remaining").textContent = maxTries;
  document.getElementById("guessInput").disabled = false;
  document.querySelector("#guessForm button").disabled = false;
});

function generateAnswer() {
  const digits = [];
  while (digits.length < 3) {
    const num = Math.floor(Math.random() * 9) + 1;
    if (!digits.includes(num)) {
      digits.push(num);
    }
  }
  return digits.join('');
}

function isValidInput(input) {
  if (input.length !== 3) return false;
  if (!/^[1-9]{3}$/.test(input)) return false;
  return new Set(input).size === 3;
}

function checkGuess(guess, answer) {
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === answer[i]) {
      strikes++;
    } else if (answer.includes(guess[i])) {
      balls++;
    }
  }

  return { strikes, balls };
}

function updateHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  attempts.forEach(({ guess, result }, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}회: ${guess} - ${result.strikes}S ${result.balls}B`;
    list.appendChild(li);
  });
}

function updateRemaining() {
  const remaining = maxTries - attempts.length;
  document.getElementById("remaining").textContent = remaining;
}

function disableInput() {
  document.getElementById("guessInput").disabled = true;
  document.querySelector("#guessForm button").disabled = true;
}