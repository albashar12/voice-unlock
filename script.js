let mediaRecorder;
let audioChunks = [];
let startTime;
let timerInterval;

const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('status');
const timerDisplay = document.getElementById('timer');
const recordingsList = document.getElementById('recordingsList');

// ১. মাইক্রোফোন এক্সেস ও রেকর্ডিং শুরু
recordBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = saveRecording;

    mediaRecorder.start();
    startTimer();

    recordBtn.classList.add('recording');
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.innerText = "রেকর্ডিং চলছে...";
  } catch (err) {
    alert("মাইক্রোফোনের অনুমতি দেওয়া হয়নি বা পাওয়া যায়নি!");
  }
});

// ২. রেকর্ডিং বন্ধ করা
stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    // স্ট্রীমের ট্র্যাক বন্ধ করা
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    stopTimer();

    recordBtn.classList.remove('recording');
    recordBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.innerText = "রেকর্ড সফলভাবে সম্পন্ন হয়েছে!";
  }
});

// ৩. টাইম কাউন্টার
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    timerDisplay.innerText = `${minutes}:${seconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerDisplay.innerText = "00:00";
}

// ৪. ভয়েস ফাইল সেভ করা ও লিস্টে দেখানো
function saveRecording() {
  const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
  const audioUrl = URL.createObjectURL(audioBlob);
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const li = document.createElement('li');
  li.className = 'recording-item';

  li.innerHTML = `
    <div class="recording-info">
      <span><i class="fa-solid fa-file-audio"></i> ভয়েস নোট (${timeString})</span>
      <button class="delete-btn" onclick="this.parentElement.parentElement.remove()">ডিলিট</button>
    </div>
    <audio controls src="${audioUrl}"></audio>
  `;

  recordingsList.prepend(li);
}