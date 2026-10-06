document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE MENU ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // --- 2. PROGRESS SYSTEM & LOCALSTORAGE ---
    let userProgress = {
        score: 0,
        gameDone: false,
        quizDone: false,
        tasksCompleted: []
    };

    function loadProgress() {
        const saved = localStorage.getItem('paintLessonProgress');
        if (saved) {
            userProgress = JSON.parse(saved);
        }
        updateProgressUI();
    }

    function saveProgress() {
        localStorage.setItem('paintLessonProgress', JSON.stringify(userProgress));
        updateProgressUI();
    }

    function updateProgressUI() {
        let totalPoints = 0;
        if (userProgress.gameDone) totalPoints += 30;
        if (userProgress.quizDone) totalPoints += 40;
        totalPoints += userProgress.tasksCompleted.length * 6; // max 30 for 5 tasks
        if (totalPoints > 100) totalPoints = 100;

        document.getElementById('progressText').innerText = totalPoints + '%';
        document.getElementById('progressFill').style.width = totalPoints + '%';
    }

    loadProgress();

    // --- 3. TOOLS DATA & MODAL ---
    const toolsData = [
        { icon: 'fa-pencil', name: 'Карандаш', desc: 'Жка жана жука сызыктарды тартуу үчүн.', guide: '1. Карандашты тандаңыз.\n2. Түстү белгилеңиз.\n3. Сүрөт тартуу аймагында чычканды басып тартыңыз.' },
        { icon: 'fa-paintbrush', name: 'Кисть', desc: 'Ар кандай калыңдыктагы щеткалар менен сырдоо.', guide: '1. Кисть куралын тандаңыз.\n2. Өлчөмүн жөндөңүз.\n3. Эркин кыймыл менен боёңуз.' },
        { icon: 'fa-fill-drip', name: 'Заливка', desc: 'Контурдун ичин бир түс менен толук боёо.', guide: '1. Куканы тандаңыз.\n2. Палитрадан түс тандаңыз.\n3. Боёлчу аймакты бир жолу басыңыз.' },
        { icon: 'fa-font', name: 'Текст', desc: 'Сүрөткө ар кандай шрифтте жазуу киргизүү.', guide: '1. Текст куралын тандаңыз.\n2. Аянтка чыкылдатып рама түзүңүз.\n3. Клавиатурадан текст жазыңыз.' },
        { icon: 'fa-shapes', name: 'Фигуралар', desc: 'Даяр геометриялык фигураларды тез салуу.', guide: '1. Фигураны тандаңыз.\n2. Canvas үстүндө басып чоңойтуңуз.\n3. Керектүү жерге жайгаштырыңыз.' },
        { icon: 'fa-square', name: 'Тик бурчтук', desc: 'Тез арада тик бурчтук же квадрат сызуу.', guide: '1. Тик бурчтукту тандаңыз.\n2. Чычканды сүйрөп калыбын түзүңүз.' },
        { icon: 'fa-circle', name: 'Эллипс', desc: 'Тегерек жана сүйрү формаларды тартуу.', guide: '1. Эллипсти тандаңыз.\n2. Тартуу аймагында созуп тегерек жасаңыз.' },
        { icon: 'fa-scissors', name: 'Выделение', desc: 'Сүрөттүн бир бөлүгүн бөлүп алуу жана жылдыруу.', guide: '1. Выделение куралын тандаңыз.\n2. Керектүү бөлүктү белгилеп жылдырыңыз.' },
        { icon: 'fa-eraser', name: 'Ластик', desc: 'Каалабаган жерлерди өчүрүү куралы.', guide: '1. Ластикти тандаңыз.\n2. Өчүрүлүүчү жерди сүртүңүз.' },
        { icon: 'fa-magnifying-glass', name: 'Масштаб', desc: 'Сүрөттү чоңойтуп же кичирейтип көрүү.', guide: '1. Лупаны тандаңыз.\n2. Чоңойтуу үчүн басыңыз.' },
        { icon: 'fa-palette', name: 'Түстөр', desc: 'Негизги жана кошумча түстөр палитрасы.', guide: '1. Түстү тандаңыз же Редактордон түзүңүз.' },
        { icon: 'fa-rotate-left', name: 'Артка кайтаруу', desc: 'Акыркы жасалган ишти жокко чыгаруу (Ctrl+Z).', guide: '1. Баскычты басыңыз же Ctrl+Z колдонуңуз.' }
    ];

    const toolsGrid = document.getElementById('toolsGrid');
    toolsData.forEach(tool => {
        const div = document.createElement('div');
        div.className = 'tool-card';
        div.innerHTML = `
            <i class="fa-solid ${tool.icon}"></i>
            <h4>${tool.name}</h4>
            <p>${tool.desc}</p>
            <button class="btn btn-sm btn-outline open-modal-btn" data-name="${tool.name}" data-guide="${encodeURIComponent(tool.guide)}">Канткенде колдонуу?</button>
        `;
        toolsGrid.appendChild(div);
    });

    // Modal logic
    const toolModal = document.getElementById('toolModal');
    const closeModal = document.getElementById('closeModal');
    const modalBodyContent = document.getElementById('modalBodyContent');

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const guide = decodeURIComponent(e.target.getAttribute('data-guide'));
            modalBodyContent.innerHTML = `
                <h3>🛠️ ${name} инструменти</h3>
                <p style="margin: 15px 0; white-space: pre-line;">${guide}</p>
                <button class="btn btn-primary" onclick="document.getElementById('toolModal').classList.remove('active')">Түшүнүктүү</button>
            `;
            toolModal.classList.add('active');
        });
    });

    closeModal.addEventListener('click', () => toolModal.classList.remove('active'));

    // Lightbox modal
    const lightboxTrigger = document.getElementById('lightboxTrigger');
    const lightboxModal = document.getElementById('lightboxModal');
    const closeLightbox = document.getElementById('closeLightbox');

    lightboxTrigger.addEventListener('click', () => lightboxModal.classList.add('active'));
    closeLightbox.addEventListener('click', () => lightboxModal.classList.remove('active'));

    window.addEventListener('click', (e) => {
        if (e.target === toolModal) toolModal.classList.remove('active');
        if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });

    // --- 4. INTERACTIVE CANVAS LAB ---
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let painting = false;
    let currentTool = 'pencil';
    let startX, startY;
    let snapshot;

    // Background white setup
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
            // find parent button if icon clicked
            const bTarget = e.target.closest('button');
            bTarget.classList.add('active');
            currentTool = bTarget.getAttribute('data-tool');
        });
    });

    canvas.addEventListener('mousedown', (e) => {
        painting = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        ctx.beginPath();
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!painting) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const color = document.getElementById('colorPicker').value;
        const size = document.getElementById('brushSize').value;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';

        if (currentTool === 'pencil' || currentTool === 'brush') {
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        } else if (currentTool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        } else if (currentTool === 'line') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        } else if (currentTool === 'rect') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
        } else if (currentTool === 'circle') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            let radius = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        painting = false;
        ctx.beginPath();
    });

    document.getElementById('clearCanvas').addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('saveCanvas').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'paint-surat.png';
        link.href = canvas.toDataURL();
        link.link.click();
        link.click();
    });

    // --- 5. STEP BY STEP LESSON ---
    let currentStep = 1;
    const totalSteps = 6;

    function showStep(step) {
        document.querySelectorAll('.step-card').forEach(card => {
            card.classList.remove('active-step');
            if (card.getAttribute('data-step') == step) {
                card.classList.add('active-step');
            }
        });
    }

    document.getElementById('nextStep').addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        } else {
            currentStep = 1;
            showStep(currentStep);
        }
    });

    document.getElementById('prevStep').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        } else {
            currentStep = totalSteps;
            showStep(currentStep);
        }
    });

    // --- 6. GAME LOGIC (10 Questions) ---
    const gameQuestions = [
        { q: "Кайсы инструмент менен сүрөттү түс менен боёсо болот?", options: ["Карандаш", "Заливка", "Ластик", "Масштаб"], correct: 1 },
        { q: "Paint программасында өчүргүч кадимки кандай максатта колдонулат?", options: ["Музыка коюу", "Ката жерди өчүрүү", "Сүрөттү сактоо", "Жазуу жазуу"], correct: 1 },
        { q: "Сүрөттү компьютерге сактоо үчүн кайсы меню колдонулат?", options: ["Файл -> Сохранить", "Правка", "Вид", "Выход"], correct: 0 },
        { q: "Карандаш инструментинин негизги милдети эмне?", options: ["Сүрөттү боёо", "Жука сызыктарды тартуу", "Видеону кесүү", "Текст жазуу"], correct: 1 },
        { q: "Текст (Text) куралы эмне үчүн керек?", options: ["Сүрөткө жазуу киргизүү", "Түс тандоо", "Чоңойтуу", "Өчүрүү"], correct: 0 },
        { q: "Пейзаж тартууда булут тартуу үчүн кайсы фигура ыңгайлуу?", options: ["Тик бурчтук", "Эллипс (тегерек)", "Сызык", "Үч бурчтук"], correct: 1 },
        { q: "Акыркы жасалган ишти жокко чыгаруу үчүн клавиатурадан кайсы баскычтар басылат?", options: ["Ctrl + C", "Ctrl + V", "Ctrl + Z", "Ctrl + S"], correct: 2 },
        { q: "Paint кандай редактор болуп саналат?", options: ["Растрдык графикалык редактор", "Тексттик редактор", "Таблицалык редактор", "Музыкалык редактор"], correct: 0 },
        { q: "Инструменттер панели кайсы жерде жайгашкан?", options: ["Терезенин жогорку бөлүгүндө", "Терезенин түбүндө", "Монитордун сыртында", "Клавиатурада"], correct: 0 },
        { q: "Сүрөттү чоңойтуп көрүү үчүн кайсы инструмент колдонулат?", options: ["Лупа (Масштаб)", "Кисть", "Заливка", "Карандаш"], correct: 0 }
    ];

    let currentGameQ = 0;
    let currentGameScore = 0;

    const gameStartScreen = document.getElementById('gameStartScreen');
    const gamePlayScreen = document.getElementById('gamePlayScreen');
    const gameEndScreen = document.getElementById('gameEndScreen');

    document.getElementById('startGameBtn').addEventListener('click', () => {
        gameStartScreen.classList.add('hidden');
        gamePlayScreen.classList.remove('hidden');
        currentGameQ = 0;
        currentGameScore = 0;
        loadGameQuestion();
    });

    function loadGameQuestion() {
        if (currentGameQ >= gameQuestions.length) {
            endGame();
            return;
        }
        const qObj = gameQuestions[currentGameQ];
        document.getElementById('gameQuestionNum').innerText = currentGameQ + 1;
        document.getElementById('gameScore').innerText = currentGameScore;
        document.getElementById('gameQuestionText').innerText = qObj.q;
        document.getElementById('gameFeedback').innerText = '';

        const optionsGrid = document.getElementById('gameOptionsGrid');
        optionsGrid.innerHTML = '';

        qObj.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = String.fromCharCode(65 + idx) + ') ' + opt;
            btn.addEventListener('click', () => checkGameAnswer(idx, qObj.correct));
            optionsGrid.appendChild(btn);
        });
    }

    function checkGameAnswer(selected, correct) {
        const optionBtns = document.querySelectorAll('#gameOptionsGrid .option-btn');
        optionBtns.forEach((b, i) => {
            b.disabled = true;
            if (i === correct) b.classList.add('correct');
            if (i === selected && selected !== correct) b.classList.add('incorrect');
        });

        if (selected === correct) {
            currentGameScore += 10;
            document.getElementById('gameFeedback').innerHTML = '<span style="color:var(--accent-green)">🎉 Азаматсың! +10 упай</span>';
        } else {
            document.getElementById('gameFeedback').innerHTML = '<span style="color:#dc3545">💡 Туура эмес! Туура жообу белгиленди.</span>';
        }

        setTimeout(() => {
            currentGameQ++;
            loadGameQuestion();
        }, 1300);
    }

    function endGame() {
        gamePlayScreen.classList.add('hidden');
        gameEndScreen.classList.remove('hidden');
        document.getElementById('finalGameScore').innerText = currentGameScore;

        let rank = "Башталгыч";
        if (currentGameScore >= 100) rank = "🏆 Paint Master!";
        else if (currentGameScore >= 80) rank = "Paint адиси";
        else if (currentGameScore >= 40) rank = "Paint үйрөнчүк";

        document.getElementById('gameRankLevel').innerText = rank;

        userProgress.gameDone = true;
        saveProgress();
    }

    document.getElementById('restartGameBtn').addEventListener('click', () => {
        gameEndScreen.classList.add('hidden');
        gameStartScreen.classList.remove('hidden');
    });

    // --- 7. QUIZ LOGIC (10 Questions) ---
    const quizQuestions = [
        { q: "Microsoft Paint программасы эмне үчүн колдонулат?", options: ["Музыка угуу", "Сүрөт түзүү жана редакциялоо", "Видео көрүү", "Интернетке кирүү"], correct: 1 },
        { q: "Paint программасын ачуу үчүн кайсы программадан издейбиз?", options: ["Paint", "Word", "Excel", "Calculator"], correct: 0 },
        { q: "Карандаш инструменти менен эмне жасоого болот?", options: ["Сүрөт тартуу", "Музыка ойнотуу", "Текст басып чыгаруу", "Файл өчүрүү"], correct: 0 },
        { q: "Заливка куралынын сүрөтчөсү эмнеге окшош?", options: ["Чакага (ведро)", "Карандашка", "Кайчыга", "Лупага"], correct: 0 },
        { q: "Өчүргүч куралынын милдети кандай?", options: ["Сүрөттү кооздоо", "Ашыкча сызыктарды өчүрүү", "Түс алмаштыруу", "Сүрөттү сактоо"], correct: 1 },
        { q: "Paint программасында сакталган файлдын кеңейтилиши (форматы) кандай болушу мүмкүн?", options: [".png же .jpg", ".mp3", ".mp4", ".docx"], correct: 0 },
        { q: "Сүрөт тартуу аймагы (Canvas) кандай аталат?", options: ["Жумушчу аймак", "Меню тилкеси", "Палитра", "Заглавие"], correct: 0 },
        { q: "Түстөр палитрасынан жаңы түс тандоо үчүн эмне кылабыз?", options: ["Түстү басып тандоо", "Компьютерди өчүрүү", "Клавиатураны тазалоо", "Эч нерсе кылбоо"], correct: 0 },
        { q: "Интерактивдүү сүрөт тартууда кайсы фигуралар колдонулат?", options: ["Тик бурчтук жана тегерек", "Музыкалык ноталар", "Видео файлдар", "Ариптер"], correct: 0 },
        { q: "Бул ачык сабактын негизги темасы кайсы?", options: ["Microsoft Paint графикалык редактору", "Интернет коопсуздугу", "Робототехника", "Таблицалар"], correct: 0 }
    ];

    let currentQuizQ = 0;
    let quizScore = 0;

    const quizStartScreen = document.getElementById('quizStartScreen');
    const quizPlayScreen = document.getElementById('quizPlayScreen');
    const quizResultScreen = document.getElementById('quizResultScreen');

    document.getElementById('startQuizBtn').addEventListener('click', () => {
        quizStartScreen.classList.add('hidden');
        quizPlayScreen.classList.remove('hidden');
        currentQuizQ = 0;
        quizScore = 0;
        loadQuizQuestion();
    });

    function loadQuizQuestion() {
        if (currentQuizQ >= quizQuestions.length) {
            endQuiz();
            return;
        }
        const qObj = quizQuestions[currentQuizQ];
        document.getElementById('quizQNum').innerText = `Суроо ${currentQuizQ + 1} / ${quizQuestions.length}`;
        document.getElementById('quizProgressBarFill').style.width = ((currentQuizQ + 1) / quizQuestions.length) * 100 + '%';
        document.getElementById('quizQuestionText').innerText = qObj.q;

        const optionsDiv = document.getElementById('quizOptions');
        optionsDiv.innerHTML = '';

        qObj.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = String.fromCharCode(65 + idx) + ') ' + opt;
            btn.addEventListener('click', () => checkQuizAnswer(idx, qObj.correct));
            optionsDiv.appendChild(btn);
        });
    }

    function checkQuizAnswer(selected, correct) {
        const optionBtns = document.querySelectorAll('#quizOptions .option-btn');
        optionBtns.forEach((b, i) => {
            b.disabled = true;
            if (i === correct) b.classList.add('correct');
            if (i === selected && selected !== correct) b.classList.add('incorrect');
        });

        if (selected === correct) {
            quizScore++;
        }

        setTimeout(() => {
            currentQuizQ++;
            loadQuizQuestion();
        }, 1200);
    }

    function endQuiz() {
        quizPlayScreen.classList.add('hidden');
        quizResultScreen.classList.remove('hidden');
        
        const percent = (quizScore / quizQuestions.length) * 100;
        document.getElementById('quizScoreText').innerText = `${quizScore} / ${quizQuestions.length}`;
        document.getElementById('quizPercentText').innerText = `${percent}%`;

        let msg = "";
        if (percent >= 90) msg = "🏆 Мыкты! Сен Paint программасын жакшы өздөштүрдүң!";
        else if (percent >= 70) msg = "👏 Жакшы! Дагы бир аз машыксаң мыкты болосуң!";
        else if (percent >= 50) msg = "📚 Жакшы аракет! Теманы дагы бир жолу кайталап көр.";
        else msg = "💪 Капа болбо! Сабакты кайра карап, дагы аракет кыл!";

        document.getElementById('quizMessage').innerText = msg;

        userProgress.quizDone = true;
        saveProgress();
    }

    document.getElementById('restartQuizBtn').addEventListener('click', () => {
        quizResultScreen.classList.add('hidden');
        quizStartScreen.classList.remove('hidden');
    });

    // --- 8. TASKS COMPLETION ---
    document.querySelectorAll('.complete-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskNum = e.target.getAttribute('data-task');
            if (!userProgress.tasksCompleted.includes(taskNum)) {
                userProgress.tasksCompleted.push(taskNum);
                e.target.innerText = "✅ Аткарылды!";
                e.target.classList.remove('btn-outline');
                e.target.classList.add('btn-primary');
                e.target.disabled = true;
                saveProgress();
            }
        });
    });

});