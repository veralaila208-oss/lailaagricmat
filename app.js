/**
         * ESTADO GLOBAL DE LA APLICACIÓN
         */
        const state = {
            role: 'student', // 'student' | 'teacher'
            activeTab: 'lab',
            isSimRunning: true,
            animTime: 0,

            // Parámetros de Geometría
            shape: 'rectangle', // 'rectangle' | 'trapezoid' | 'triangle' | 'circle' | 'freehand'
            dim1: 100,
            dim2: 100,
            dim3: 60,
            areaM2: 10000,
            perimeterM: 400,

            // Vértices normalizados en metros para polígono libre
            freehandPoints: [
                { x: -60, y: -45 },
                { x: 55, y: -50 },
                { x: 70, y: 40 },
                { x: -45, y: 55 }
            ],

            // Parámetros Agronómicos
            crop: 'cacao',
            rowDist: 3.0,
            plantDist: 3.0,
            angleDeg: 0,
            pattern: 'square', // 'square' | 'tresbolillo'

            // Parámetros del Modelo Lineal (y = mx + b)
            slopeM: 1.5,
            interceptB: 500,

            // Resultados calculados en tiempo real
            plantPositions: [],
            totalPlants: 0,
            densityHa: 0,
            yieldTons: 0,
            linesCount: 0,
            efficiencyPct: 94,

            // Talleres completados
            workshopsCompleted: { 1: false, 2: false, 3: false },

            // Presentación Interactiva
            currentSlide: 0,

            // Video Demostrativo
            videoPlaying: false,
            videoTime: 0,
            videoDuration: 40,

            // Ejercicio Generado para Docente
            currentChallenge: null
        };

        // Base de conocimiento de cultivos agrícolas
        const CROP_PRESETS = {
            cacao: {
                name: 'Cacao Nacional / CCN-51',
                rowDist: 3.0,
                plantDist: 3.0,
                minDist: 2.0,
                maxDist: 4.5,
                yieldPerPlantKg: 1.5,
                color: '#2E6F40',
                canopyRadiusM: 1.1
            },
            banano: {
                name: 'Banano Cavendish',
                rowDist: 2.5,
                plantDist: 2.5,
                minDist: 1.8,
                maxDist: 3.5,
                yieldPerPlantKg: 24.0,
                color: '#4A935D',
                canopyRadiusM: 1.0
            },
            maiz: {
                name: 'Maíz Duro Amarillo',
                rowDist: 0.8,
                plantDist: 0.4,
                minDist: 0.3,
                maxDist: 1.2,
                yieldPerPlantKg: 0.22,
                color: '#D97706',
                canopyRadiusM: 0.25
            },
            arroz: {
                name: 'Arroz Tecnificado',
                rowDist: 0.25,
                plantDist: 0.25,
                minDist: 0.2,
                maxDist: 0.5,
                yieldPerPlantKg: 0.045,
                color: '#65A30D',
                canopyRadiusM: 0.12
            },
            hortalizas: {
                name: 'Hortalizas (Lechuga / Col)',
                rowDist: 0.40,
                plantDist: 0.35,
                minDist: 0.25,
                maxDist: 0.8,
                yieldPerPlantKg: 0.65,
                color: '#059669',
                canopyRadiusM: 0.18
            },
            cafe: {
                name: 'Café Arábigo',
                rowDist: 2.0,
                plantDist: 1.5,
                minDist: 1.0,
                maxDist: 3.0,
                yieldPerPlantKg: 1.2,
                color: '#7C2D12',
                canopyRadiusM: 0.65
            }
        };

        // Diapositivas de la Presentación Interactiva
        const INTRO_SLIDES = [
            {
                title: 'Bienvenido a AgroSim Dual',
                subtitle: 'Ingeniería geométrica, densidad de cultivos y modelación lineal (y = mx + b).',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div class="space-y-4">
                            <h3 class="text-xl font-extrabold text-ugBlue">¿Por qué simular antes de sembrar?</h3>
                            <p class="text-sm text-slate-600 leading-relaxed">
                                En la agricultura moderna, una mala estimación del área del terreno o un marco de plantación inadecuado puede generar pérdidas de hasta un <strong>25% en insumos, semillas y rendimiento</strong>.
                            </p>
                            <div class="p-4 rounded-xl bg-white border-l-4 border-agroGreen shadow-sm text-xs text-slate-700">
                                <strong>AgroSim Dual</strong> te permite modelar parcelas reales, convertir unidades agrarias al instante y analizar cómo la <strong>pendiente (m)</strong> y el <strong>intercepto (b)</strong> determinan los costos de tu cultivo.
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <i class="fa-solid fa-draw-polygon text-3xl text-agroEarth mb-2"></i>
                                <h4 class="font-bold text-sm text-ugBlue">Geometría Flexible</h4>
                                <p class="text-xs text-slate-500 mt-1">Rectángulos, trapecios, círculos y polígonos a mano alzada.</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <i class="fa-solid fa-scale-balanced text-3xl text-ugGold mb-2"></i>
                                <h4 class="font-bold text-sm text-ugBlue">Unidades Reales</h4>
                                <p class="text-xs text-slate-500 mt-1">Conversión instantánea entre m², Hectáreas y Cuadras.</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <i class="fa-solid fa-chart-line text-3xl text-agroGreen mb-2"></i>
                                <h4 class="font-bold text-sm text-ugBlue">Modelo Lineal</h4>
                                <p class="text-xs text-slate-500 mt-1">Análisis en vivo de pendiente (m) e intercepto (b).</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <i class="fa-solid fa-graduation-cap text-3xl text-ugBlue mb-2"></i>
                                <h4 class="font-bold text-sm text-ugBlue">Arquitectura Dual</h4>
                                <p class="text-xs text-slate-500 mt-1">Talleres para estudiantes y rúbricas para docentes.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                title: '1. Dominio de Formas y Unidades de Superficie',
                subtitle: 'Adapta el terreno a medidas topográficas exactas.',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <span class="text-xs font-bold text-agroEarth uppercase">Figuras Estándar y Libres</span>
                            <h4 class="font-bold text-base text-ugBlue mt-1 mb-2">Topografía Adaptable</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Selecciona parcelas rectangulares, trapezoidales, triangulares o circulares. ¿Tu finca tiene linderos irregulares? Usa el modo <strong>Polígono Libre</strong> haciendo clic directamente en el mapa.
                            </p>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <span class="text-xs font-bold text-agroGreen uppercase">Conversión Automática</span>
                            <h4 class="font-bold text-base text-ugBlue mt-1 mb-2">m², Hectáreas y Cuadras</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Escribe el área en cualquiera de las tres unidades y el simulador recalculará las dimensiones geométricas proporcionalmente:
                            </p>
                            <ul class="mt-2 text-xs font-mono bg-agroSand p-2.5 rounded-lg text-slate-700 space-y-1">
                                <li>• 1 Hectárea = 10,000 m²</li>
                                <li>• 1 Cuadra   = 7,056 m²</li>
                            </ul>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <span class="text-xs font-bold text-ugGold uppercase">Cálculo de Cercado</span>
                            <h4 class="font-bold text-base text-ugBlue mt-1 mb-2">Perímetro Real</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Obtén al instante los metros lineales del perímetro para presupuestar postes, alambre, canales de drenaje o cortinas rompevientos.
                            </p>
                        </div>
                    </div>
                `
            },
            {
                title: '2. Marcos de Plantación y Modelación Lineal (y = mx + b)',
                subtitle: 'Conectando la geometría agronómica con el álgebra aplicada.',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <h4 class="font-bold text-base text-ugBlue">Cuadrado vs. Tresbolillo (Quincunce)</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Alterna entre <strong>Marco Real</strong> y <strong>Sistema Tresbolillo</strong>, incrementando la capacidad en un <strong>15.47% más de plantas</strong> por hectárea manteniendo la misma distancia mínima entre ellas.
                            </p>
                            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                                <strong>Cultivos disponibles:</strong> Cacao, Banano, Maíz, Arroz, Hortalizas y Café con parámetros reales.
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                            <h4 class="font-bold text-base text-ugBlue">Pendiente (m) e Intercepto (b) en el Agro</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Modifica <strong>m</strong> (costo variable por planta) y <strong>b</strong> (costo fijo inicial) para observar en vivo cómo cambia la inclinación y el corte con el eje Y de la recta <code>y = mx + b</code>.
                            </p>
                            <div class="flex gap-2 pt-2">
                                <span class="px-3 py-1.5 rounded-lg bg-ugBlue text-white text-xs font-mono">m = Δy / Δx</span>
                                <span class="px-3 py-1.5 rounded-lg bg-ugGold text-ugBlue text-xs font-mono font-bold">b = y(0)</span>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                title: '3. Roles Duales: Estudiante y Docente',
                subtitle: 'Un ecosistema completo para aprender y evaluar.',
                content: `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-2xl border-2 border-agroGreen/40 shadow-sm">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-xl bg-agroGreen text-white flex items-center justify-center">
                                    <i class="fa-solid fa-user-graduate"></i>
                                </div>
                                <h4 class="font-bold text-lg text-agroGreen">Modo Estudiante</h4>
                            </div>
                            <ul class="text-xs text-slate-600 space-y-2 list-disc pl-4">
                                <li><strong>Laboratorio Interactivo:</strong> Manipula variables en vivo y observa la telemetría, producción estimada y gráfica lineal.</li>
                                <li><strong>Talleres Prácticos Guiados:</strong> Resuelve 3 retos reales con verificación automática e inmediata de tu configuración.</li>
                            </ul>
                        </div>
                        <div class="bg-white p-6 rounded-2xl border-2 border-ugBlue/40 shadow-sm">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-xl bg-ugBlue text-white flex items-center justify-center">
                                    <i class="fa-solid fa-chalkboard-user"></i>
                                </div>
                                <h4 class="font-bold text-lg text-ugBlue">Modo Docente</h4>
                            </div>
                            <ul class="text-xs text-slate-600 space-y-2 list-disc pl-4">
                                <li><strong>Guía Metodológica:</strong> Objetivos, competencias y secuencia didáctica lista para clase.</li>
                                <li><strong>Generador y Rúbrica:</strong> Crea ejercicios aleatorios únicos y descarga actas de evaluación en HTML o JSON.</li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ];

        // Variables de Chart.js y Canvas
        let telemetryChart = null;
        let linearChart = null;
        let agroCanvas = null;
        let agroCtx = null;
        let videoCanvas = null;
        let videoCtx = null;

        /**
         * INICIALIZACIÓN AL CARGAR LA VENTANA
         */
        window.onload = function() {
            agroCanvas = document.getElementById('agroCanvas');
            agroCtx = agroCanvas.getContext('2d');

            videoCanvas = document.getElementById('videoDemoCanvas');
            videoCtx = videoCanvas.getContext('2d');

            agroCanvas.addEventListener('click', handleCanvasClick);

            renderSlide(0);
            initTelemetryChart();
            initLinearChart();
            generateDynamicChallenge();
            recalculateModel();

            resizeCanvases();
            window.addEventListener('resize', resizeCanvases);

            requestAnimationFrame(mainLoop);
        };

        /**
         * REDIMENSIONAMIENTO RESPONSIVO DE LIENZOS
         */
        function resizeCanvases() {
            if (agroCanvas && agroCanvas.parentElement) {
                const rect = agroCanvas.parentElement.getBoundingClientRect();
                agroCanvas.width = rect.width;
                agroCanvas.height = rect.height;
            }
            if (videoCanvas && videoCanvas.parentElement) {
                const vRect = videoCanvas.parentElement.getBoundingClientRect();
                videoCanvas.width = vRect.width || 800;
                videoCanvas.height = vRect.height || 450;
            }
        }

        /**
         * GESTIÓN DE ROLES DUALES (ESTUDIANTE / DOCENTE)
         */
        function switchRole(role) {
            state.role = role;
            const btnStudent = document.getElementById('btnRoleStudent');
            const btnTeacher = document.getElementById('btnRoleTeacher');

            const studentTabs = document.querySelectorAll('.role-student-tab');
            const teacherTabs = document.querySelectorAll('.role-teacher-tab');

            if (role === 'student') {
                btnStudent.className = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-agroGreen text-white shadow';
                btnTeacher.className = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-white transition-all';

                studentTabs.forEach(t => t.classList.remove('hidden'));
                teacherTabs.forEach(t => t.classList.add('hidden'));

                if (state.activeTab === 'guide' || state.activeTab === 'evaluation') {
                    switchTab('lab');
                }
                showToast('Modo Estudiante Activo', 'Acceso habilitado al Laboratorio Interactivo y Talleres Guiados.');
            } else {
                btnTeacher.className = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-ugGold text-ugBlue shadow';
                btnStudent.className = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-white transition-all';

                teacherTabs.forEach(t => t.classList.remove('hidden'));
                studentTabs.forEach(t => t.classList.add('hidden'));

                if (state.activeTab === 'lab' || state.activeTab === 'workshops') {
                    switchTab('guide');
                }
                showToast('Modo Docente Activo', 'Herramientas metodológicas, generador de casos y rúbrica habilitados.');
            }
        }

        /**
         * NAVEGACIÓN ENTRE PESTAÑAS
         */
        function switchTab(tabId) {
            state.activeTab = tabId;

            document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
            const target = document.getElementById(`tab-${tabId}`);
            if (target) target.classList.remove('hidden');

            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.tab === tabId) {
                    btn.classList.remove('text-slate-600', 'hover:bg-agroSand');
                    btn.classList.add('bg-agroGreen/10', 'text-agroGreen', 'font-bold', 'border', 'border-agroGreen/30');
                } else {
                    btn.classList.remove('bg-agroGreen/10', 'text-agroGreen', 'font-bold', 'border', 'border-agroGreen/30');
                    btn.classList.add('text-slate-600', 'hover:bg-agroSand');
                }
            });

            setTimeout(resizeCanvases, 50);
        }

        function launchWorkspace() {
            if (state.role === 'student') {
                switchTab('lab');
            } else {
                switchTab('guide');
            }
        }

        /**
         * LÓGICA DE PRESENTACIÓN INTERACTIVA (PESTAÑA 1)
         */
        function renderSlide(index) {
            state.currentSlide = index;
            const slide = INTRO_SLIDES[index];
            document.getElementById('slideCounter').textContent = `${index + 1} / ${INTRO_SLIDES.length}`;
            document.getElementById('slideTitle').textContent = slide.title;
            document.getElementById('slideSubtitle').textContent = slide.subtitle;
            document.getElementById('slideBody').innerHTML = slide.content;

            const dots = document.getElementById('slideDots').children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].className = i === index
                    ? 'w-8 h-2.5 rounded-full bg-agroGreen transition-all'
                    : 'w-3 h-2.5 rounded-full bg-slate-300 transition-all';
            }
        }

        function nextSlide() {
            renderSlide((state.currentSlide + 1) % INTRO_SLIDES.length);
        }

        function prevSlide() {
            renderSlide((state.currentSlide - 1 + INTRO_SLIDES.length) % INTRO_SLIDES.length);
        }

        function goToSlide(idx) {
            renderSlide(idx);
        }

        /**
         * LÓGICA DEL VIDEO DEMOSTRATIVO ANIMADO (PESTAÑA 2)
         */
        function toggleVideoPlayback() {
            state.videoPlaying = !state.videoPlaying;
            const btn = document.getElementById('btnPlayVideo');
            if (state.videoPlaying) {
                btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pausar Video</span>';
            } else {
                btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Reproducir Video</span>';
            }
        }

        function restartVideo() {
            state.videoTime = 0;
            state.videoPlaying = true;
            document.getElementById('btnPlayVideo').innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pausar Video</span>';
        }

        function seekVideo(val) {
            state.videoTime = parseFloat(val);
            updateVideoUI();
        }

        function jumpToVideoScene(seconds) {
            state.videoTime = seconds;
            state.videoPlaying = true;
            document.getElementById('btnPlayVideo').innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pausar Video</span>';
            updateVideoUI();
        }

        function updateVideoUI() {
            const slider = document.getElementById('videoProgressSlider');
            const badge = document.getElementById('videoTimeBadge');
            const sub = document.getElementById('videoSubtitleText');

            if (slider) slider.value = state.videoTime.toFixed(1);
            const curSec = Math.floor(state.videoTime).toString().padStart(2, '0');
            if (badge) badge.textContent = `00:${curSec} / 00:40`;

            if (sub) {
                if (state.videoTime < 10) {
                    sub.textContent = 'Escena 1: Cacao en Parcela Rectangular (100m × 100m = 1 ha). Distancia 3m × 3m = 1,089 plantas.';
                } else if (state.videoTime < 20) {
                    sub.textContent = 'Escena 2: Banano en Terreno Trapezoidal (2.5m × 2.5m). El sistema ajusta automáticamente los surcos a los bordes inclinados.';
                } else if (state.videoTime < 30) {
                    sub.textContent = 'Escena 3: Hortalizas en Lote Circular con riego por pivote (0.4m × 0.35m). Alta densidad por metro cuadrado.';
                } else {
                    sub.textContent = 'Escena 4: Rotación de surcos (Azimut 0° a 90°). Permite alinear hileras con la trayectoria solar y pendiente del terreno.';
                }
            }
        }

        function renderVideoFrame() {
            if (!videoCtx || state.activeTab !== 'video') return;
            const w = videoCanvas.width;
            const h = videoCanvas.height;

            const grad = videoCtx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#0F172A');
            grad.addColorStop(1, '#1E293B');
            videoCtx.fillStyle = grad;
            videoCtx.fillRect(0, 0, w, h);

            videoCtx.strokeStyle = 'rgba(255,255,255,0.06)';
            videoCtx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) {
                videoCtx.beginPath(); videoCtx.moveTo(x, 0); videoCtx.lineTo(x, h); videoCtx.stroke();
            }
            for (let y = 0; y < h; y += 30) {
                videoCtx.beginPath(); videoCtx.moveTo(0, y); videoCtx.lineTo(w, y); videoCtx.stroke();
            }

            const cx = w / 2;
            const cy = h / 2 - 20;
            const t = state.videoTime;

            videoCtx.save();
            videoCtx.translate(cx, cy);

            if (t < 10) {
                // ESCENA 1: Rectángulo Cacao
                const rw = Math.min(w * 0.55, 340);
                const rh = Math.min(h * 0.45, 190);
                videoCtx.fillStyle = 'rgba(139, 90, 43, 0.25)';
                videoCtx.strokeStyle = '#C59B27';
                videoCtx.lineWidth = 3;
                videoCtx.fillRect(-rw / 2, -rh / 2, rw, rh);
                videoCtx.strokeRect(-rw / 2, -rh / 2, rw, rh);

                const progress = Math.min(1, (t % 10) / 6);
                const cols = 12, rows = 7;
                const totalToShow = Math.floor(cols * rows * progress);
                let count = 0;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (count++ > totalToShow) break;
                        const px = -rw / 2 + 20 + c * ((rw - 40) / (cols - 1));
                        const py = -rh / 2 + 20 + r * ((rh - 40) / (rows - 1));
                        videoCtx.fillStyle = '#4ADE80';
                        videoCtx.beginPath();
                        videoCtx.arc(px, py, 5, 0, Math.PI * 2);
                        videoCtx.fill();
                    }
                }
                videoCtx.fillStyle = '#FFFFFF';
                videoCtx.font = 'bold 13px Inter, sans-serif';
                videoCtx.textAlign = 'center';
                videoCtx.fillText('CACAO • Marco Cuadrado 3m × 3m • 1.00 Hectárea', 0, -rh / 2 - 14);
            } else if (t < 20) {
                // ESCENA 2: Trapecio Banano
                const topW = 180, botW = 320, th = 180;
                videoCtx.fillStyle = 'rgba(74, 147, 93, 0.22)';
                videoCtx.strokeStyle = '#4ADE80';
                videoCtx.lineWidth = 3;
                videoCtx.beginPath();
                videoCtx.moveTo(-topW / 2, -th / 2);
                videoCtx.lineTo(topW / 2, -th / 2);
                videoCtx.lineTo(botW / 2, th / 2);
                videoCtx.lineTo(-botW / 2, th / 2);
                videoCtx.closePath();
                videoCtx.fill();
                videoCtx.stroke();

                for (let y = -th / 2 + 18; y <= th / 2 - 18; y += 22) {
                    const ratio = (y + th / 2) / th;
                    const halfSpan = (topW + (botW - topW) * ratio) / 2 - 18;
                    for (let x = -halfSpan; x <= halfSpan; x += 22) {
                        videoCtx.fillStyle = '#FACC15';
                        videoCtx.beginPath();
                        videoCtx.arc(x, y, 4.5, 0, Math.PI * 2);
                        videoCtx.fill();
                    }
                }
                videoCtx.fillStyle = '#FFFFFF';
                videoCtx.font = 'bold 13px Inter, sans-serif';
                videoCtx.textAlign = 'center';
                videoCtx.fillText('BANANO • Parcela Trapezoidal • 2.5m × 2.5m', 0, -th / 2 - 14);
            } else if (t < 30) {
                // ESCENA 3: Círculo Hortalizas
                const rad = Math.min(w, h) * 0.28;
                videoCtx.fillStyle = 'rgba(5, 150, 105, 0.22)';
                videoCtx.strokeStyle = '#38BDF8';
                videoCtx.lineWidth = 3;
                videoCtx.beginPath();
                videoCtx.arc(0, 0, rad, 0, Math.PI * 2);
                videoCtx.fill();
                videoCtx.stroke();

                for (let y = -rad + 12; y <= rad - 12; y += 14) {
                    for (let x = -rad + 12; x <= rad - 12; x += 14) {
                        if (x * x + y * y <= (rad - 10) * (rad - 10)) {
                            videoCtx.fillStyle = '#34D399';
                            videoCtx.beginPath();
                            videoCtx.arc(x, y, 2.8, 0, Math.PI * 2);
                            videoCtx.fill();
                        }
                    }
                }
                // Brazo de pivote giratorio
                const armAngle = (t % 10) * 0.65;
                videoCtx.strokeStyle = '#F8FAFC';
                videoCtx.lineWidth = 2.5;
                videoCtx.beginPath();
                videoCtx.moveTo(0, 0);
                videoCtx.lineTo(Math.cos(armAngle) * rad, Math.sin(armAngle) * rad);
                videoCtx.stroke();

                videoCtx.fillStyle = '#FFFFFF';
                videoCtx.font = 'bold 13px Inter, sans-serif';
                videoCtx.textAlign = 'center';
                videoCtx.fillText('HORTALIZAS • Pivote Circular • 0.40m × 0.35m', 0, -rad - 14);
            } else {
                // ESCENA 4: Rotación Azimut
                const rw = 280, rh = 170;
                videoCtx.strokeStyle = '#C59B27';
                videoCtx.lineWidth = 3;
                videoCtx.strokeRect(-rw / 2, -rh / 2, rw, rh);

                const rot = ((t - 30) / 10) * (Math.PI / 2);
                videoCtx.save();
                videoCtx.beginPath();
                videoCtx.rect(-rw / 2, -rh / 2, rw, rh);
                videoCtx.clip();
                videoCtx.rotate(rot);

                videoCtx.strokeStyle = '#4ADE80';
                videoCtx.lineWidth = 2;
                for (let x = -220; x <= 220; x += 24) {
                    videoCtx.beginPath();
                    videoCtx.moveTo(x, -220);
                    videoCtx.lineTo(x, 220);
                    videoCtx.stroke();
                }
                videoCtx.restore();

                videoCtx.fillStyle = '#FFFFFF';
                videoCtx.font = 'bold 13px Inter, sans-serif';
                videoCtx.textAlign = 'center';
                videoCtx.fillText(`ORIENTACIÓN DE SURCOS (AZIMUT): ${Math.round(rot * 180 / Math.PI)}°`, 0, -rh / 2 - 14);
            }

            videoCtx.restore();
        }

        /**
         * GEOMETRÍA Y CONVERSIÓN DE UNIDADES AGRARIAS
         */
        function setShape(newShape) {
            state.shape = newShape;

            // Actualizar botones activos
            document.querySelectorAll('.shape-btn').forEach(btn => {
                if (btn.dataset.shape === newShape) {
                    btn.className = 'shape-btn p-2 rounded-xl border-2 border-agroGreen bg-agroGreen/10 text-agroGreen text-xs font-bold flex flex-col items-center gap-1 transition';
                    if (newShape === 'freehand') btn.classList.add('col-span-2');
                } else {
                    btn.className = 'shape-btn p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex flex-col items-center gap-1 transition';
                    if (btn.dataset.shape === 'freehand') btn.classList.add('col-span-2');
                }
            });

            // Ajustar etiquetas y visibilidad de controles de dimensiones
            const dimControls = document.getElementById('dimensionControls');
            const grp2 = document.getElementById('groupDim2');
            const grp3 = document.getElementById('groupDim3');
            const lbl1 = document.getElementById('lblDim1');
            const lbl2 = document.getElementById('lblDim2');
            const freeHint = document.getElementById('freehandHint');
            const btnClear = document.getElementById('btnClearPolygon');

            dimControls.classList.remove('hidden');
            grp2.classList.remove('hidden');
            grp3.classList.add('hidden');
            freeHint.classList.add('hidden');
            btnClear.classList.add('hidden');

            if (newShape === 'rectangle') {
                lbl1.textContent = 'Largo (m):';
                lbl2.textContent = 'Ancho (m):';
            } else if (newShape === 'trapezoid') {
                lbl1.textContent = 'Base Mayor (m):';
                lbl2.textContent = 'Altura (m):';
                grp3.classList.remove('hidden');
            } else if (newShape === 'triangle') {
                lbl1.textContent = 'Base (m):';
                lbl2.textContent = 'Altura (m):';
            } else if (newShape === 'circle') {
                lbl1.textContent = 'Diámetro (m):';
                grp2.classList.add('hidden');
            } else if (newShape === 'freehand') {
                dimControls.classList.add('hidden');
                freeHint.classList.remove('hidden');
                btnClear.classList.remove('hidden');
            }

            recalculateModel();
        }

        function updateDimensionsFromSliders() {
            state.dim1 = parseFloat(document.getElementById('inputDim1').value);
            state.dim2 = parseFloat(document.getElementById('inputDim2').value);
            state.dim3 = parseFloat(document.getElementById('inputDim3').value);

            document.getElementById('valDim1').textContent = `${state.dim1} m`;
            document.getElementById('valDim2').textContent = `${state.dim2} m`;
            document.getElementById('valDim3').textContent = `${state.dim3} m`;

            recalculateModel();
        }

        /**
         * CONVERSOR BIDIRECCIONAL: m² <-> Hectáreas <-> Cuadras
         * 1 ha = 10,000 m² | 1 cuadra = 7,056 m²
         */
        function updateAreaFromUnit(unit, rawVal) {
            const val = parseFloat(rawVal);
            if (isNaN(val) || val <= 0) return;

            let targetM2 = val;
            if (unit === 'ha') targetM2 = val * 10000;
            if (unit === 'cd') targetM2 = val * 7056;

            // Escalar dimensiones actuales proporcionalmente para mantener la forma
            if (state.areaM2 > 0) {
                const scaleFactor = Math.sqrt(targetM2 / state.areaM2);
                if (state.shape === 'freehand') {
                    state.freehandPoints = state.freehandPoints.map(p => ({
                        x: p.x * scaleFactor,
                        y: p.y * scaleFactor
                    }));
                } else {
                    state.dim1 = Math.min(350, Math.max(15, Math.round(state.dim1 * scaleFactor)));
                    state.dim2 = Math.min(350, Math.max(15, Math.round(state.dim2 * scaleFactor)));
                    state.dim3 = Math.min(300, Math.max(10, Math.round(state.dim3 * scaleFactor)));

                    document.getElementById('inputDim1').value = Math.min(300, state.dim1);
                    document.getElementById('inputDim2').value = Math.min(300, state.dim2);
                    document.getElementById('inputDim3').value = Math.min(250, state.dim3);
                    document.getElementById('valDim1').textContent = `${state.dim1} m`;
                    document.getElementById('valDim2').textContent = `${state.dim2} m`;
                    document.getElementById('valDim3').textContent = `${state.dim3} m`;
                }
            }

            recalculateModel();
        }

        /**
         * PARÁMETROS AGRONÓMICOS DE SIEMBRA
         */
        function selectCropPreset(cropKey) {
            state.crop = cropKey;
            const preset = CROP_PRESETS[cropKey];
            state.rowDist = preset.rowDist;
            state.plantDist = preset.plantDist;

            document.getElementById('inputRowDist').value = preset.rowDist;
            document.getElementById('inputPlantDist').value = preset.plantDist;
            document.getElementById('valRowDist').textContent = `${preset.rowDist.toFixed(2)} m`;
            document.getElementById('valPlantDist').textContent = `${preset.plantDist.toFixed(2)} m`;

            recalculateModel();
        }

        function updatePlantingParams() {
            state.rowDist = parseFloat(document.getElementById('inputRowDist').value);
            state.plantDist = parseFloat(document.getElementById('inputPlantDist').value);
            state.angleDeg = parseInt(document.getElementById('inputAngle').value, 10);

            document.getElementById('valRowDist').textContent = `${state.rowDist.toFixed(2)} m`;
            document.getElementById('valPlantDist').textContent = `${state.plantDist.toFixed(2)} m`;
            document.getElementById('valAngle').textContent = `${state.angleDeg}° (${getCardinalDirection(state.angleDeg)})`;
            document.getElementById('compassAngleLabel').textContent = `${state.angleDeg}° ${getCardinalDirection(state.angleDeg)}`;

            recalculateModel();
        }

        function getCardinalDirection(deg) {
            if (deg === 0 || deg === 180) return 'Norte - Sur';
            if (deg === 90) return 'Este - Oeste';
            if (deg < 90) return 'NE - SO';
            return 'NO - SE';
        }

        function setPattern(pat) {
            state.pattern = pat;
            const btnSq = document.getElementById('btnPatternSquare');
            const btnTr = document.getElementById('btnPatternQuincunx');

            if (pat === 'square') {
                btnSq.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-ugBlue text-white transition';
                btnTr.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
            } else {
                btnTr.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-ugBlue text-white transition';
                btnSq.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
            }
            recalculateModel();
        }

        /**
         * MODELACIÓN LINEAL: PENDIENTE (m) E INTERCEPTO (b)
         */
        function updateLinearModel() {
            state.interceptB = parseFloat(document.getElementById('inputInterceptB').value);
            state.slopeM = parseFloat(document.getElementById('inputSlopeM').value);

            document.getElementById('valInterceptB').textContent = `$ ${state.interceptB.toLocaleString()}`;
            document.getElementById('valSlopeM').textContent = `$ ${state.slopeM.toFixed(2)} / pl`;

            updateLinearUIAndChart();
        }

        function updateLinearUIAndChart() {
            const m = state.slopeM;
            const b = state.interceptB;
            const x = state.totalPlants;
            const y = m * x + b;

            const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            document.getElementById('algebraicEqText').textContent = `y = ${m.toFixed(2)}x ${signB}`;
            document.getElementById('evalXPlants').textContent = x.toLocaleString();
            document.getElementById('evalYTotal').textContent = `$ ${y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            // Actualizar interpretación en tiempo real
            const badge = document.getElementById('slopeInterpretationBadge');
            const slopeText = document.getElementById('reflectionSlopeText');
            const interceptText = document.getElementById('reflectionInterceptText');

            if (m > 0) {
                badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800';
                badge.textContent = `Creciente (m = +${m.toFixed(2)})`;
                slopeText.innerHTML = `Con <strong>m = +${m.toFixed(2)}</strong>, la recta es creciente: cada planta adicional incrementa el costo total en <strong>$${m.toFixed(2)}</strong>.`;
            } else if (m < 0) {
                badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800';
                badge.textContent = `Decreciente (m = ${m.toFixed(2)})`;
                slopeText.innerHTML = `Con <strong>m = ${m.toFixed(2)}</strong>, la recta es decreciente: representa un subsidio o descuento por volumen de $${Math.abs(m).toFixed(2)} por planta.`;
            } else {
                badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800';
                badge.textContent = 'Constante (m = 0)';
                slopeText.innerHTML = `Con <strong>m = 0</strong>, la recta es completamente horizontal (<code>y = ${b}</code>): el costo no varía sin importar cuántas plantas se siembren.`;
            }

            interceptText.innerHTML = `El punto <strong>(0, ${b})</strong> representa el costo fijo inicial de preparación de tierra y cercado ($${b}) cuando todavía hay <strong>0 plantas</strong> sembradas.`;

            // Actualizar gráfica lineal
            if (linearChart) {
                const maxX = Math.max(2000, Math.ceil(x * 1.3 / 500) * 500);
                const step = maxX / 4;
                const xVals = [0, step, step * 2, step * 3, maxX];
                const yVals = xVals.map(xv => +(m * xv + b).toFixed(2));

                linearChart.data.labels = xVals.map(v => `${Math.round(v)} pl`);
                linearChart.data.datasets[0].data = yVals;
                linearChart.update('none');
            }
        }

        /**
         * INTERACCIÓN DE POLÍGONO LIBRE EN EL CANVAS
         */
        function handleCanvasClick(e) {
            if (state.shape !== 'freehand') return;
            const rect = agroCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Convertir píxeles a metros centrados (escala: 2.2 px por metro)
            const scale = getCanvasMetersScale();
            const meterX = (clickX - agroCanvas.width / 2) / scale;
            const meterY = (clickY - agroCanvas.height / 2) / scale;

            state.freehandPoints.push({ x: Math.round(meterX), y: Math.round(meterY) });
            document.getElementById('vertexCountBadge').textContent = `${state.freehandPoints.length} vértices`;
            recalculateModel();
        }

        function resetFreehandPolygon() {
            state.freehandPoints = [];
            document.getElementById('vertexCountBadge').textContent = '0 vértices (Haz clic en el mapa)';
            recalculateModel();
        }

        function getCanvasMetersScale() {
            const maxDim = Math.max(state.dim1, state.dim2, 120);
            const minCanvas = Math.min(agroCanvas.width || 600, agroCanvas.height || 400);
            return (minCanvas * 0.72) / maxDim;
        }

        /**
         * MOTOR NUMÉRICO PRINCIPAL: CÁLCULO DE ÁREA, PERÍMETRO Y PLANTAS
         */
        function getPolygonVerticesMeters() {
            const d1 = state.dim1;
            const d2 = state.dim2;
            const d3 = state.dim3;

            if (state.shape === 'rectangle') {
                return [
                    { x: -d1 / 2, y: -d2 / 2 },
                    { x: d1 / 2, y: -d2 / 2 },
                    { x: d1 / 2, y: d2 / 2 },
                    { x: -d1 / 2, y: d2 / 2 }
                ];
            } else if (state.shape === 'trapezoid') {
                return [
                    { x: -d3 / 2, y: -d2 / 2 },
                    { x: d3 / 2, y: -d2 / 2 },
                    { x: d1 / 2, y: d2 / 2 },
                    { x: -d1 / 2, y: d2 / 2 }
                ];
            } else if (state.shape === 'triangle') {
                return [
                    { x: 0, y: -d2 / 2 },
                    { x: d1 / 2, y: d2 / 2 },
                    { x: -d1 / 2, y: d2 / 2 }
                ];
            } else if (state.shape === 'circle') {
                const pts = [];
                const r = d1 / 2;
                const segs = 48;
                for (let i = 0; i < segs; i++) {
                    const a = (i / segs) * Math.PI * 2;
                    pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
                }
                return pts;
            } else {
                return state.freehandPoints;
            }
        }

        function calculatePolygonAreaAndPerimeter(verts) {
            if (!verts || verts.length < 3) return { area: 0, perimeter: 0 };
            let area = 0;
            let perim = 0;
            for (let i = 0; i < verts.length; i++) {
                const j = (i + 1) % verts.length;
                area += verts[i].x * verts[j].y;
                area -= verts[j].x * verts[i].y;
                const dx = verts[j].x - verts[i].x;
                const dy = verts[j].y - verts[i].y;
                perim += Math.hypot(dx, dy);
            }
            return { area: Math.abs(area) / 2, perimeter: perim };
        }

        // Algoritmo Ray-Casting para determinar si una planta cae exactamente dentro del polígono
        function isPointInPolygon(pt, vs) {
            if (state.shape === 'circle') {
                const r = state.dim1 / 2;
                return (pt.x * pt.x + pt.y * pt.y) <= r * r;
            }
            let inside = false;
            for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                const xi = vs[i].x, yi = vs[i].y;
                const xj = vs[j].x, yj = vs[j].y;
                const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
                    (pt.x < (xj - xi) * (pt.y - yi) / ((yj - yi) || 1e-9) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

        function recalculateModel() {
            const verts = getPolygonVerticesMeters();
            const metrics = calculatePolygonAreaAndPerimeter(verts);

            if (state.shape === 'circle') {
                const r = state.dim1 / 2;
                state.areaM2 = Math.PI * r * r;
                state.perimeterM = Math.PI * state.dim1;
            } else {
                state.areaM2 = metrics.area;
                state.perimeterM = metrics.perimeter;
            }

            // Actualizar inputs de unidades de superficie
            document.getElementById('unitM2').value = Math.round(state.areaM2);
            document.getElementById('unitHa').value = (state.areaM2 / 10000).toFixed(2);
            document.getElementById('unitCd').value = (state.areaM2 / 7056).toFixed(2);

            // Generar posiciones de plantas respetando distancia entre surcos, plantas y azimut
            const positions = [];
            let linesCount = 0;

            if (state.areaM2 > 10 && verts.length >= 3) {
                // Calcular bounding box rotado
                let maxR = 0;
                verts.forEach(v => {
                    const d = Math.hypot(v.x, v.y);
                    if (d > maxR) maxR = d;
                });

                const rad = (state.angleDeg * Math.PI) / 180;
                const cosA = Math.cos(rad);
                const sinA = Math.sin(rad);

                const rowStep = state.pattern === 'tresbolillo'
                    ? state.rowDist * 0.8660254
                    : state.rowDist;
                const plantStep = state.plantDist;

                // Limitar puntos visuales si el área es gigantesca con densidad extrema (ej. arroz) para mantener 60 FPS
                const theoreticalTotal = (state.areaM2 / (rowStep * plantStep));
                const visualScaleStep = theoreticalTotal > 4500 ? Math.ceil(Math.sqrt(theoreticalTotal / 3500)) : 1;

                const effRowStep = rowStep * visualScaleStep;
                const effPlantStep = plantStep * visualScaleStep;

                let rowIdx = 0;
                for (let u = -maxR; u <= maxR; u += effRowStep) {
                    let rowHasPlant = false;
                    const xOffset = (state.pattern === 'tresbolillo' && rowIdx % 2 === 1) ? effPlantStep / 2 : 0;

                    for (let v = -maxR + xOffset; v <= maxR; v += effPlantStep) {
                        // Rotar punto (u, v) al sistema de coordenadas del terreno
                        const wx = u * cosA - v * sinA;
                        const wy = u * sinA + v * cosA;

                        if (isPointInPolygon({ x: wx, y: wy }, verts)) {
                            positions.push({ x: wx, y: wy, weight: visualScaleStep * visualScaleStep });
                            rowHasPlant = true;
                        }
                    }
                    if (rowHasPlant) linesCount += visualScaleStep;
                    rowIdx++;
                }

                // Población total exacta
                state.totalPlants = positions.reduce((acc, p) => acc + p.weight, 0);
            } else {
                state.totalPlants = 0;
            }

            state.plantPositions = positions;
            state.linesCount = Math.round(linesCount);

            // Densidad real (plantas/ha) y rendimiento
            const ha = state.areaM2 / 10000;
            state.densityHa = ha > 0 ? Math.round(state.totalPlants / ha) : 0;

            const preset = CROP_PRESETS[state.crop];
            state.yieldTons = (state.totalPlants * preset.yieldPerPlantKg) / 1000;

            // Actualizar KPIs y Gráficas
            updateDashboardKPIs(preset);
            updateAgronomicAlerts(preset);
            updateLinearUIAndChart();
        }

        function updateDashboardKPIs(preset) {
            document.getElementById('kpiTotalPlants').textContent = state.totalPlants.toLocaleString();
            document.getElementById('kpiDensityHa').textContent = state.densityHa.toLocaleString();

            const optimalDensity = Math.round(10000 / (preset.rowDist * preset.plantDist));
            document.getElementById('kpiRecommendedDensity').textContent = `Óptimo: ${optimalDensity.toLocaleString()} pl/ha`;

            document.getElementById('kpiYield').textContent = state.yieldTons.toFixed(2);
            document.getElementById('kpiYieldUnit').textContent = `${preset.yieldPerPlantKg} kg/planta promedio`;

            document.getElementById('kpiPerimeter').textContent = Math.round(state.perimeterM).toLocaleString();
            document.getElementById('kpiLinesCount').textContent = `${state.linesCount} surcos trazados`;

            // Actualizar Gráfica de Densidad
            if (telemetryChart) {
                telemetryChart.data.datasets[0].data = [state.densityHa, optimalDensity];
                telemetryChart.update('none');
            }
        }

        function updateAgronomicAlerts(preset) {
            const bar = document.getElementById('agronomicAlertBar');
            const icon = document.getElementById('alertBarIcon');
            const text = document.getElementById('alertBarText');
            const badge = document.getElementById('efficiencyBadge');

            const minSpacing = Math.min(state.rowDist, state.plantDist);
            const maxSpacing = Math.max(state.rowDist, state.plantDist);

            if (state.areaM2 < 10) {
                bar.className = 'mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 shadow-sm';
                icon.className = 'fa-solid fa-triangle-exclamation text-amber-600 text-lg';
                text.textContent = 'Parcela incompleta: Dibuja al menos 3 vértices en el plano para calcular el área y distribuir plantas.';
                badge.className = 'px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold whitespace-nowrap';
                badge.textContent = 'Eficiencia: 0%';
            } else if (minSpacing < preset.minDist) {
                bar.className = 'mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between gap-3 shadow-sm';
                icon.className = 'fa-solid fa-circle-xmark text-red-600 text-lg';
                text.textContent = `Alerta de Hacinamiento Crítico: La distancia (${minSpacing.toFixed(2)}m) es menor al mínimo recomendado para ${preset.name} (${preset.minDist}m). Riesgo de competencia radicular y hongos.`;
                badge.className = 'px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold whitespace-nowrap';
                badge.textContent = 'Riesgo Alto';
            } else if (maxSpacing > preset.maxDist) {
                bar.className = 'mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 shadow-sm';
                icon.className = 'fa-solid fa-triangle-exclamation text-amber-600 text-lg';
                text.textContent = `Subutilización del Suelo: Espaciamiento amplio (${maxSpacing.toFixed(2)}m) para ${preset.name}. Existen espacios ociosos que reducen la rentabilidad por hectárea.`;
                badge.className = 'px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold whitespace-nowrap';
                badge.textContent = 'Eficiencia: 68%';
            } else {
                const eff = Math.min(99, Math.round(92 + (state.pattern === 'tresbolillo' ? 5 : 2)));
                bar.className = 'mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-sm';
                icon.className = 'fa-solid fa-circle-check text-emerald-600 text-lg';
                text.textContent = `Estado Óptimo: La densidad de siembra (${state.densityHa.toLocaleString()} pl/ha) y geometría cumplen los parámetros técnicos para ${preset.name}.`;
                badge.className = 'px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold whitespace-nowrap';
                badge.textContent = `Eficiencia: ${eff}%`;
            }
        }

        /**
         * GRÁFICAS EN TIEMPO REAL (CHART.JS)
         */
        function initTelemetryChart() {
            const ctx = document.getElementById('telemetryChart').getContext('2d');
            telemetryChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Densidad Simulada', 'Óptimo Cultivo'],
                    datasets: [{
                        label: 'Plantas / Hectárea',
                        data: [1089, 1111],
                        backgroundColor: ['#2E6F40', '#002855'],
                        borderRadius: 8,
                        barThickness: 36
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } }
                    }
                }
            });
        }

        function initLinearChart() {
            const ctx = document.getElementById('linearChart').getContext('2d');
            linearChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['0 pl', '500 pl', '1000 pl', '1500 pl', '2000 pl'],
                    datasets: [{
                        label: 'y = mx + b ($)',
                        data: [500, 1250, 2000, 2750, 3500],
                        borderColor: '#C59B27',
                        backgroundColor: 'rgba(197, 155, 39, 0.15)',
                        borderWidth: 3,
                        pointBackgroundColor: '#002855',
                        pointRadius: 4,
                        fill: true,
                        tension: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                    }
                }
            });
        }

        /**
         * RENDERIZADO DEL LIENZO TOPOGRÁFICO EN TIEMPO REAL
         */
        function renderAgroCanvas() {
            if (!agroCtx || state.activeTab !== 'lab') return;
            const w = agroCanvas.width;
            const h = agroCanvas.height;
            agroCtx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const scale = getCanvasMetersScale();
            const verts = getPolygonVerticesMeters();
            const preset = CROP_PRESETS[state.crop];

            agroCtx.save();
            agroCtx.translate(cx, cy);

            // 1. Dibujar Parcela (Suelo agrícola cálido)
            if (verts.length >= 2) {
                agroCtx.fillStyle = 'rgba(139, 90, 43, 0.14)';
                agroCtx.strokeStyle = '#8B5A2B';
                agroCtx.lineWidth = 3;
                agroCtx.beginPath();
                agroCtx.moveTo(verts[0].x * scale, verts[0].y * scale);
                for (let i = 1; i < verts.length; i++) {
                    agroCtx.lineTo(verts[i].x * scale, verts[i].y * scale);
                }
                if (verts.length >= 3) agroCtx.closePath();
                agroCtx.fill();
                agroCtx.stroke();
            }

            // 2. Dibujar Plantas con animación suave de crecimiento
            const pulse = state.isSimRunning ? 1 + Math.sin(state.animTime * 3) * 0.08 : 1;
            const dotRadius = Math.max(2.2, Math.min(7, preset.canopyRadiusM * scale * 0.65)) * pulse;

            agroCtx.fillStyle = preset.color;
            for (let i = 0; i < state.plantPositions.length; i++) {
                const p = state.plantPositions[i];
                agroCtx.beginPath();
                agroCtx.arc(p.x * scale, p.y * scale, dotRadius, 0, Math.PI * 2);
                agroCtx.fill();
            }

            // 3. Dibujar Vértices interactivos si es polígono libre
            if (state.shape === 'freehand') {
                verts.forEach((v, idx) => {
                    agroCtx.fillStyle = '#002855';
                    agroCtx.strokeStyle = '#C59B27';
                    agroCtx.lineWidth = 2;
                    agroCtx.beginPath();
                    agroCtx.arc(v.x * scale, v.y * scale, 5, 0, Math.PI * 2);
                    agroCtx.fill();
                    agroCtx.stroke();

                    agroCtx.fillStyle = '#002855';
                    agroCtx.font = 'bold 10px Inter, sans-serif';
                    agroCtx.fillText(`V${idx + 1}`, v.x * scale + 7, v.y * scale - 5);
                });
            }

            // 4. Etiqueta de área central
            if (state.areaM2 > 0) {
                agroCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                agroCtx.fillRect(-72, -14, 144, 24);
                agroCtx.fillStyle = '#002855';
                agroCtx.font = 'bold 11px Inter, sans-serif';
                agroCtx.textAlign = 'center';
                agroCtx.fillText(`${(state.areaM2 / 10000).toFixed(2)} ha (${Math.round(state.areaM2)} m²)`, 0, 2);
            }

            agroCtx.restore();
        }

        /**
         * CONTROLES DE SIMULACIÓN (PAUSAR, INICIAR, REINICIAR)
         */
        function toggleSimulation() {
            state.isSimRunning = !state.isSimRunning;
            const btn = document.getElementById('btnSimToggle');
            const dot = document.getElementById('simStatusDot');

            if (state.isSimRunning) {
                btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pausar</span>';
                dot.classList.add('animate-pulse', 'bg-agroGreen');
                dot.classList.remove('bg-amber-500');
            } else {
                btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Iniciar</span>';
                dot.classList.remove('animate-pulse', 'bg-agroGreen');
                dot.classList.add('bg-amber-500');
            }
        }

        function resetSimulation() {
            state.shape = 'rectangle';
            state.dim1 = 100;
            state.dim2 = 100;
            state.dim3 = 60;
            state.crop = 'cacao';
            state.rowDist = 3.0;
            state.plantDist = 3.0;
            state.angleDeg = 0;
            state.pattern = 'square';
            state.slopeM = 1.5;
            state.interceptB = 500;

            document.getElementById('inputDim1').value = 100;
            document.getElementById('inputDim2').value = 100;
            document.getElementById('valDim1').textContent = '100 m';
            document.getElementById('valDim2').textContent = '100 m';
            document.getElementById('cropSelect').value = 'cacao';
            document.getElementById('inputRowDist').value = 3.0;
            document.getElementById('inputPlantDist').value = 3.0;
            document.getElementById('valRowDist').textContent = '3.00 m';
            document.getElementById('valPlantDist').textContent = '3.00 m';
            document.getElementById('inputAngle').value = 0;
            document.getElementById('valAngle').textContent = '0° (Norte - Sur)';
            document.getElementById('inputSlopeM').value = 1.5;
            document.getElementById('inputInterceptB').value = 500;
            document.getElementById('valSlopeM').textContent = '$ 1.50 / pl';
            document.getElementById('valInterceptB').textContent = '$ 500';

            setShape('rectangle');
            setPattern('square');
            showToast('Simulador Reiniciado', 'Todos los parámetros geométricos, agronómicos y lineales volvieron a sus valores base.');
        }

        /**
         * BUCLE PRINCIPAL DE ANIMACIÓN (requestAnimationFrame)
         */
        let lastFrameTime = performance.now();
        function mainLoop(now) {
            const dt = (now - lastFrameTime) / 1000;
            lastFrameTime = now;

            if (state.isSimRunning) {
                state.animTime += dt;
            }

            if (state.videoPlaying && state.activeTab === 'video') {
                state.videoTime += dt;
                if (state.videoTime >= state.videoDuration) {
                    state.videoTime = 0;
                }
                updateVideoUI();
            }

            renderAgroCanvas();
            renderVideoFrame();

            requestAnimationFrame(mainLoop);
        }

        /**
         * VERIFICACIÓN DE TALLERES PRÁCTICOS (MODO ESTUDIANTE)
         */
        function verifyWorkshop(id) {
            let passed = false;
            let feedback = '';

            if (id === 1) {
                const okShape = state.shape === 'rectangle' && Math.abs(state.areaM2 - 15000) <= 500;
                const okCrop = state.crop === 'cacao' && Math.abs(state.rowDist - 3.0) < 0.1 && Math.abs(state.plantDist - 3.0) < 0.1;
                passed = okShape && okCrop;
                feedback = passed
                    ? '¡Excelente! Configuraste 1.5 ha (150m × 100m) con Cacao a 3m × 3m correctamente.'
                    : 'Revisa los datos: necesitas un Rectángulo de 150m × 100m (1.5 ha) y Cacao a 3.0m × 3.0m.';
            } else if (id === 2) {
                const okShape = state.shape === 'trapezoid' && Math.abs(state.areaM2 - 14100) <= 800;
                const okCrop = state.crop === 'banano' && state.pattern === 'tresbolillo';
                passed = okShape && okCrop;
                feedback = passed
                    ? '¡Correcto! Has optimizado las 2 cuadras trapezoidales con Banano en sistema Tresbolillo.'
                    : 'Verifica que la forma sea Trapecio (aprox. 2 cuadras = 14,112 m²), cultivo Banano y marco Tresbolillo.';
            } else if (id === 3) {
                const okShape = state.shape === 'circle' && Math.abs(state.dim1 - 60) <= 2;
                const okLinear = Math.abs(state.interceptB - 800) <= 50 && Math.abs(state.slopeM - 0.4) <= 0.05;
                passed = okShape && okLinear;
                feedback = passed
                    ? '¡Logrado! Dominaste la parcela circular de 60m y el modelo lineal y = 0.40x + 800.'
                    : 'Asegúrate de elegir Círculo (Diámetro 60m), Hortalizas y ajustar la recta con m = 0.40 y b = 800.';
            }

            if (passed) {
                state.workshopsCompleted[id] = true;
                const badge = document.getElementById(`badgeWorkshop${id}`);
                badge.className = 'text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300';
                badge.textContent = '✓ Completado';

                const completedCount = Object.values(state.workshopsCompleted).filter(Boolean).length;
                document.getElementById('workshopScoreText').textContent = `${completedCount} / 3 Completados`;
                showToast(`Taller #${id} Aprobado`, feedback);
            } else {
                showToast(`Taller #${id} Incompleto`, feedback);
            }
        }

        /**
         * HERRAMIENTAS DOCENTE: GENERADOR ALEATORIO, RÚBRICA Y EXPORTACIÓN
         */
        function generateDynamicChallenge() {
            const crops = Object.keys(CROP_PRESETS);
            const shapes = ['rectangle', 'trapezoid', 'triangle', 'circle'];
            const cKey = crops[Math.floor(Math.random() * crops.length)];
            const sKey = shapes[Math.floor(Math.random() * shapes.length)];
            const preset = CROP_PRESETS[cKey];

            const d1 = Math.floor(Math.random() * 12 + 6) * 10; // 60 a 170m
            const d2 = Math.floor(Math.random() * 10 + 5) * 10; // 50 a 140m
            const d3 = Math.max(30, d1 - 40);
            const pat = Math.random() > 0.5 ? 'square' : 'tresbolillo';
            const m = +(Math.random() * 2.5 + 0.5).toFixed(2);
            const b = Math.floor(Math.random() * 10 + 2) * 100;

            let area = d1 * d2;
            let shapeDesc = `Rectángulo (${d1}m × ${d2}m)`;
            if (sKey === 'trapezoid') {
                area = ((d1 + d3) / 2) * d2;
                shapeDesc = `Trapecio (B:${d1}m, b:${d3}m, h:${d2}m)`;
            } else if (sKey === 'triangle') {
                area = (d1 * d2) / 2;
                shapeDesc = `Triángulo (Base:${d1}m, Alt:${d2}m)`;
            } else if (sKey === 'circle') {
                area = Math.PI * Math.pow(d1 / 2, 2);
                shapeDesc = `Círculo (Diámetro:${d1}m)`;
            }

            const mult = pat === 'tresbolillo' ? 1.1547 : 1;
            const estPlants = Math.round((area / (preset.rowDist * preset.plantDist)) * mult * 0.96);

            state.currentChallenge = {
                code: `#AGRO-${Math.floor(1000 + Math.random() * 9000)}`,
                cropKey: cKey,
                cropName: preset.name,
                shape: sKey,
                dim1: d1,
                dim2: d2,
                dim3: d3,
                pattern: pat,
                m: m,
                b: b,
                area: Math.round(area),
                estPlants: estPlants
            };

            document.getElementById('genCaseId').textContent = state.currentChallenge.code;
            document.getElementById('genCrop').textContent = preset.name;
            document.getElementById('genShape').textContent = shapeDesc;
            document.getElementById('genArea').textContent = `${Math.round(area).toLocaleString()} m² (${(area / 10000).toFixed(2)} ha / ${(area / 7056).toFixed(2)} cd)`;
            document.getElementById('genSpacing').textContent = `${preset.rowDist}m × ${preset.plantDist}m (${pat === 'tresbolillo' ? 'Tresbolillo' : 'Cuadrado'})`;
            document.getElementById('genLinearEq').textContent = `y = ${m.toFixed(2)}x + ${b}`;
            document.getElementById('genExpectedPlants').textContent = `~${estPlants.toLocaleString()} plantas`;
        }

        function applyChallengeToSimulator() {
            if (!state.currentChallenge) return;
            const ch = state.currentChallenge;

            state.dim1 = ch.dim1;
            state.dim2 = ch.dim2;
            state.dim3 = ch.dim3;
            document.getElementById('inputDim1').value = ch.dim1;
            document.getElementById('inputDim2').value = ch.dim2;
            document.getElementById('inputDim3').value = ch.dim3;
            document.getElementById('valDim1').textContent = `${ch.dim1} m`;
            document.getElementById('valDim2').textContent = `${ch.dim2} m`;
            document.getElementById('valDim3').textContent = `${ch.dim3} m`;

            document.getElementById('cropSelect').value = ch.cropKey;
            selectCropPreset(ch.cropKey);
            setShape(ch.shape);
            setPattern(ch.pattern);

            state.slopeM = ch.m;
            state.interceptB = ch.b;
            document.getElementById('inputSlopeM').value = ch.m;
            document.getElementById('inputInterceptB').value = ch.b;
            document.getElementById('valSlopeM').textContent = `$ ${ch.m.toFixed(2)} / pl`;
            document.getElementById('valInterceptB').textContent = `$ ${ch.b}`;
            updateLinearUIAndChart();

            switchTab('lab');
            showToast(`Caso ${ch.code} Cargado`, 'Los parámetros del ejercicio aleatorio se aplicaron al simulador.');
        }

        function calculateRubricTotal() {
            const selects = document.querySelectorAll('.rubric-score');
            let sum = 0;
            selects.forEach(s => sum += parseInt(s.value, 10));
            const max = selects.length * 3;
            const over10 = ((sum / max) * 10).toFixed(1);
            document.getElementById('rubricTotalBadge').textContent = `${sum} / ${max} pts (${over10} / 10)`;
            return { sum, max, over10 };
        }

        function exportReport(format) {
            const studentName = document.getElementById('studentNameInput').value.trim() || 'Estudiante Evaluado';
            const score = calculateRubricTotal();
            const reportData = {
                sistema: 'AgroSim Dual - Ciencias Agrarias',
                fecha: new Date().toLocaleString(),
                estudiante: studentName,
                calificacion: `${score.sum}/${score.max} (${score.over10}/10)`,
                simulacionActual: {
                    cultivo: CROP_PRESETS[state.crop].name,
                    formaTerreno: state.shape,
                    areaM2: Math.round(state.areaM2),
                    hectareas: +(state.areaM2 / 10000).toFixed(2),
                    cuadras: +(state.areaM2 / 7056).toFixed(2),
                    poblacionPlantas: state.totalPlants,
                    densidadHa: state.densityHa,
                    ecuacionLineal: `y = ${state.slopeM.toFixed(2)}x + ${state.interceptB}`
                }
            };

            let content = '';
            let mime = 'application/json';
            let filename = `Informe_AgroSim_${studentName.replace(/\s+/g, '_')}.json`;

            if (format === 'json') {
                content = JSON.stringify(reportData, null, 2);
            } else {
                mime = 'text/html';
                filename = `Acta_Evaluacion_AgroSim_${studentName.replace(/\s+/g, '_')}.html`;
                content = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Acta AgroSim Dual</title>
                <style>body{font-family:sans-serif;padding:30px;color:#1e293b}h1{color:#002855;border-bottom:3px solid #C59B27;padding-bottom:8px}.card{background:#f8fafc;border:1px solid #cbd5e1;padding:16px;border-radius:8px;margin-top:16px}</style>
                </head><body><h1>Acta Oficial de Simulación Agronómica - AgroSim Dual</h1>
                <p><strong>Estudiante:</strong> ${studentName} | <strong>Fecha:</strong> ${reportData.fecha}</p>
                <p><strong>Calificación Rúbrica:</strong> ${reportData.calificacion}</p>
                <div class="card"><h3>Resultados Técnicos del Simulador</h3>
                <ul><li><strong>Cultivo:</strong> ${reportData.simulacionActual.cultivo}</li>
                <li><strong>Superficie:</strong> ${reportData.simulacionActual.areaM2} m² (${reportData.simulacionActual.hectareas} ha / ${reportData.simulacionActual.cuadras} cuadras)</li>
                <li><strong>Población Calculada:</strong> ${reportData.simulacionActual.poblacionPlantas} plantas (${reportData.simulacionActual.densidadHa} pl/ha)</li>
                <li><strong>Modelo Lineal Evaluado:</strong> ${reportData.simulacionActual.ecuacionLineal}</li></ul></div></body></html>`;
            }

            const blob = new Blob([content], { type: mime });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('Informe Exportado', `Se descargó el archivo ${filename} correctamente.`);
        }

        /**
         * SISTEMA DE NOTIFICACIONES FLOTANTES (SIN alert())
         */
        let toastTimeout = null;
        function showToast(title, msg) {
            const banner = document.getElementById('toastBanner');
            document.getElementById('toastTitle').textContent = title;
            document.getElementById('toastMessage').textContent = msg;
            banner.classList.remove('hidden');

            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(hideToast, 4500);
        }

        function hideToast() {
            document.getElementById('toastBanner').classList.add('hidden');
        }

        /**
         * EMPAQUETADO Y DESCARGA DE CARPETA DE PROYECTO SEPARADA (HTML + CSS + JS)
         */
        async function downloadProjectFolder() {
            showToast('Preparando Descarga...', 'Empaquetando index.html, styles.css y app.js.');

            try {
                // 1. Extraer CSS personalizado
                const styleTag = document.querySelector('head style');
                const cssContent = styleTag ? styleTag.textContent.trim() : '';

                // 2. Extraer JavaScript principal (el último bloque <script>)
                const scripts = Array.from(document.querySelectorAll('body script'));
                const mainScriptTag = scripts[scripts.length - 1];
                const jsContent = mainScriptTag ? mainScriptTag.textContent.trim() : '';

                // 3. Reconstruir HTML limpio enlazando styles.css y app.js externos
                const docClone = document.documentElement.cloneNode(true);
                
                const cloneStyle = docClone.querySelector('head style');
                if (cloneStyle) {
                    const linkCss = document.createElement('link');
                    linkCss.rel = 'stylesheet';
                    linkCss.href = 'styles.css';
                    cloneStyle.replaceWith(linkCss);
                }

                const cloneBodyScripts = Array.from(docClone.querySelectorAll('body script'));
                const cloneMainScript = cloneBodyScripts[cloneBodyScripts.length - 1];
                if (cloneMainScript) {
                    const extScript = document.createElement('script');
                    extScript.src = 'app.js';
                    cloneMainScript.replaceWith(extScript);
                }

                const toastClone = docClone.querySelector('#toastBanner');
                if (toastClone) toastClone.classList.add('hidden');

                const htmlContent = '<!DOCTYPE html>\n' + docClone.outerHTML;

                const readmeContent = `# AgroSim Dual - Simulador Educativo Agrícola\n\n` +
                    `Estructura de archivos del proyecto:\n` +
                    `- index.html : Estructura semántica y componentes visuales (Tailwind CSS).\n` +
                    `- styles.css : Reglas de estilo personalizadas y animaciones.\n` +
                    `- app.js     : Motor numérico, Canvas 2D interactivo, gráficas y gestión dual (Estudiante/Docente).\n\n` +
                    `Para ejecutar: Abre 'index.html' directamente en cualquier navegador web moderno.`;

                // Si JSZip está disponible, empaquetar en .ZIP; de lo contrario, descargar los 3 archivos individuales
                if (typeof JSZip !== 'undefined') {
                    const zip = new JSZip();
                    const folder = zip.folder('AgroSim_Dual_Proyecto');
                    folder.file('index.html', htmlContent);
                    folder.file('styles.css', cssContent);
                    folder.file('app.js', jsContent);
                    folder.file('README.md', readmeContent);

                    const blob = await zip.generateAsync({ type: 'blob' });
                    triggerBrowserDownload(blob, 'AgroSim_Dual_Proyecto.zip');
                    showToast('¡Carpeta ZIP Descargada!', 'Se descargó AgroSim_Dual_Proyecto.zip con index.html, styles.css y app.js.');
                } else {
                    triggerBrowserDownload(new Blob([htmlContent], { type: 'text/html' }), 'index.html');
                    setTimeout(() => triggerBrowserDownload(new Blob([cssContent], { type: 'text/css' }), 'styles.css'), 300);
                    setTimeout(() => triggerBrowserDownload(new Blob([jsContent], { type: 'application/javascript' }), 'app.js'), 600);
                    showToast('¡Archivos Descargados!', 'Se descargaron index.html, styles.css y app.js en tu carpeta de Descargas.');
                }
            } catch (err) {
                console.error(err);
                showToast('Error al Descargar', 'Usa el botón de descarga superior del editor para guardar el archivo HTML completo.');
            }
        }

        function triggerBrowserDownload(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }