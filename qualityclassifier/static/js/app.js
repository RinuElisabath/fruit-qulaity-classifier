const SERVER_IP = 'http://localhost:5000';
``
const webcamElement = document.getElementById('webcam');
const resultElement = document.getElementById('result');
const resultMessageElement = document.getElementById('result-msg');

resultElement.style.display = 'none';
webcamElement.style.display = 'block';

function classify(e, id) {
  e.preventDefault();
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');
  formData.append('file', fileField.files[0]);
  if (id == 1) {
    classifyFromCam(formData);
  } else if (id == 2) {
    extractTextFromCam(formData);
  }
}

async function extractTextFromCam(shot) {
  const response = await fetch(SERVER_IP + "/ocr", {
    method: 'POST',
    body: shot
  });
  const result = await response.json();
  if (response.status === 400)
    alert(result.message);
  else
    outputTextResult(result);
}


function outputTextResult(result) {
  resultElement.style.display = 'block';
  resultMessageElement.innerHTML = `The text is <b>${result.label}</b>`;
  speak(`The text is ${result.label}`);
}


async function classifyFromCam(shot) {
  const response = await fetch(SERVER_IP, {
    method: 'POST',
    body: shot
  });
  const result = await response.json();
  if (response.status === 400)
    alert(result.message);
  else
    outputResult(result);
}

function outputResult(result) {
  resultElement.style.display = 'block';
  resultMessageElement.innerHTML = `I think it\'s a <b>${result.label}</b> with `;
  resultMessageElement.innerHTML += `<b>${result.percentage}%</b> confidence.`;
  speak(`I think it\'s a ${result.label} with ${result.percentage}% confidence.`);
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synthesis.speak(utterance);
  } else {
    console.log('Text-to-speech not supported.');
  }
}
