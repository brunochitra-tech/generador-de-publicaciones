/* ============================================
   GENERADOR ML DELHI v4.0 — SCRIPT
   Sistema Dinámico Multiproducto
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Category → context mapping for prompt generation
const CATEGORY_CONTEXTS = {
    calefaccion: {
        setting: 'elegant outdoor patio at dusk, cozy warm atmosphere',
        environment: 'terraza / living acogedor',
        lighting: 'warm golden hour lighting',
        mood: 'cálido y acogedor',
        useContext: 'keeping warm in cold weather',
        commercialScene: 'upscale restaurant patio with ambient heating'
    },
    cocina: {
        setting: 'modern minimalist kitchen, marble countertops, natural light',
        environment: 'cocina moderna',
        lighting: 'bright natural daylight from large windows',
        mood: 'funcional y moderno',
        useContext: 'preparing gourmet meals',
        commercialScene: 'professional restaurant kitchen in action'
    },
    electronica: {
        setting: 'modern living room, clean desk setup, soft ambient light',
        environment: 'living / oficina moderna',
        lighting: 'soft diffused LED lighting',
        mood: 'tecnológico y elegante',
        useContext: 'enhancing daily digital life',
        commercialScene: 'modern coworking space with premium tech'
    },
    herramientas: {
        setting: 'professional workshop, organized tool wall, concrete floor',
        environment: 'taller profesional',
        lighting: 'bright overhead industrial lighting',
        mood: 'profesional y robusto',
        useContext: 'professional construction or DIY project',
        commercialScene: 'busy professional construction site'
    },
    jardin: {
        setting: 'beautiful landscaped garden, sunny day, green lawn',
        environment: 'jardín / espacio exterior',
        lighting: 'bright natural sunlight, blue sky',
        mood: 'fresco y natural',
        useContext: 'maintaining a beautiful outdoor space',
        commercialScene: 'luxury landscape maintenance service'
    },
    hogar: {
        setting: 'stylish contemporary interior, tasteful decoration',
        environment: 'hogar moderno',
        lighting: 'warm interior ambient lighting',
        mood: 'elegante y confortable',
        useContext: 'elevating home comfort and style',
        commercialScene: 'premium furniture showroom'
    },
    deportes: {
        setting: 'outdoor athletic environment, dynamic action scene',
        environment: 'espacio deportivo',
        lighting: 'dynamic natural outdoor lighting',
        mood: 'activo y energético',
        useContext: 'peak athletic performance',
        commercialScene: 'professional sports facility'
    },
    default: {
        setting: 'premium lifestyle setting, clean modern background',
        environment: 'ambiente premium',
        lighting: 'professional studio lighting, soft shadows',
        mood: 'premium y profesional',
        useContext: 'everyday premium experience',
        commercialScene: 'upscale retail environment'
    }
};

// Category-based form templates for manual entry
const CATEGORY_TEMPLATES = {
    calefaccion: [
        { key: 'Potencia', placeholder: 'Ej: 15 kW' },
        { key: 'Combustible', placeholder: 'Ej: Gas propano/butano' },
        { key: 'Tipo de gas', placeholder: 'Ej: GLP, Gas natural' },
        { key: 'Superficie de cobertura', placeholder: 'Ej: 20 m²' },
        { key: 'Consumo', placeholder: 'Ej: 1.1 kg/h' },
        { key: 'Altura', placeholder: 'Ej: 210 cm' },
        { key: 'Material', placeholder: 'Ej: Acero inoxidable 304' },
        { key: 'Peso', placeholder: 'Ej: 35 kg' },
        { key: 'Certificación', placeholder: 'Ej: CE, IRAM' },
        { key: 'Garantía', placeholder: 'Ej: 12 meses' },
    ],
    cocina: [
        { key: 'Material', placeholder: 'Ej: Acero inoxidable, Hierro fundido' },
        { key: 'Capacidad', placeholder: 'Ej: 5 litros, 30 cm diámetro' },
        { key: 'Tipo de fuego', placeholder: 'Ej: Gas, Eléctrico, Inducción' },
        { key: 'Potencia', placeholder: 'Ej: 3000W, 4 hornallas' },
        { key: 'Temperatura máxima', placeholder: 'Ej: 300°C' },
        { key: 'Dimensiones', placeholder: 'Ej: 60 x 50 x 85 cm' },
        { key: 'Peso', placeholder: 'Ej: 40 kg' },
        { key: 'Color', placeholder: 'Ej: Negro, Acero inoxidable' },
        { key: 'Certificación', placeholder: 'Ej: CE, IRAM' },
        { key: 'Garantía', placeholder: 'Ej: 12 meses' },
    ],
    electronica: [
        { key: 'Voltaje', placeholder: 'Ej: 220V / 50Hz' },
        { key: 'Potencia/Consumo', placeholder: 'Ej: 65W, 1500W' },
        { key: 'Conectividad', placeholder: 'Ej: WiFi, Bluetooth 5.0, USB-C' },
        { key: 'Pantalla', placeholder: 'Ej: LCD 15", LED 4K' },
        { key: 'Procesador/Motor', placeholder: 'Ej: Quad-core, Motor DC' },
        { key: 'Dimensiones', placeholder: 'Ej: 35 x 20 x 5 cm' },
        { key: 'Peso', placeholder: 'Ej: 2.5 kg' },
        { key: 'Color', placeholder: 'Ej: Negro, Blanco' },
        { key: 'Certificación', placeholder: 'Ej: CE, FCC, RoHS' },
        { key: 'Garantía', placeholder: 'Ej: 12 meses' },
    ],
    herramientas: [
        { key: 'Potencia', placeholder: 'Ej: 1500W, 20V' },
        { key: 'Velocidad', placeholder: 'Ej: 3000 RPM, variable' },
        { key: 'Tipo de motor', placeholder: 'Ej: Brushless, Inducción' },
        { key: 'Capacidad', placeholder: 'Ej: Mandril 13mm, Disco 230mm' },
        { key: 'Voltaje/Batería', placeholder: 'Ej: 220V, Batería 20V 4Ah' },
        { key: 'Material', placeholder: 'Ej: Carcasa de aluminio' },
        { key: 'Peso', placeholder: 'Ej: 3.5 kg' },
        { key: 'Accesorios incluidos', placeholder: 'Ej: 2 baterías, cargador, maletín' },
        { key: 'Certificación', placeholder: 'Ej: CE, GS' },
        { key: 'Garantía', placeholder: 'Ej: 24 meses' },
    ],
    jardin: [
        { key: 'Potencia/Motor', placeholder: 'Ej: 1000W, Motor 2T' },
        { key: 'Tipo de corte', placeholder: 'Ej: Hilo, Cuchilla, Cadena' },
        { key: 'Alcance/Largo', placeholder: 'Ej: Corte 42cm, Barra 18"' },
        { key: 'Capacidad', placeholder: 'Ej: Tanque 500ml, Bolsa 50L' },
        { key: 'Material', placeholder: 'Ej: Plástico ABS, Acero' },
        { key: 'Peso', placeholder: 'Ej: 5 kg' },
        { key: 'Alimentación', placeholder: 'Ej: Eléctrico 220V, Nafta, Batería' },
        { key: 'Garantía', placeholder: 'Ej: 12 meses' },
    ],
    hogar: [
        { key: 'Material', placeholder: 'Ej: MDF, Melamina, Madera maciza' },
        { key: 'Dimensiones', placeholder: 'Ej: 120 x 60 x 75 cm' },
        { key: 'Capacidad/Peso soportado', placeholder: 'Ej: 50 kg por estante' },
        { key: 'Color', placeholder: 'Ej: Roble claro, Blanco, Wengue' },
        { key: 'Peso', placeholder: 'Ej: 25 kg' },
        { key: 'Requiere armado', placeholder: 'Ej: Sí, incluye instrucciones' },
        { key: 'Garantía', placeholder: 'Ej: 6 meses' },
    ],
    deportes: [
        { key: 'Material', placeholder: 'Ej: Nylon, Neoprene, Acero' },
        { key: 'Peso/Carga', placeholder: 'Ej: 2 kg, Soporta hasta 120 kg' },
        { key: 'Dimensiones', placeholder: 'Ej: 180 x 60 cm (plegado: 60 x 15 cm)' },
        { key: 'Uso recomendado', placeholder: 'Ej: Gimnasio, Outdoor, Yoga' },
        { key: 'Color', placeholder: 'Ej: Negro, Rojo' },
        { key: 'Garantía', placeholder: 'Ej: 6 meses' },
    ],
    default: [
        { key: 'Modelo', placeholder: 'Número de modelo' },
        { key: 'Potencia/Consumo', placeholder: 'Ej: 1500W' },
        { key: 'Material', placeholder: 'Ej: Acero inoxidable' },
        { key: 'Dimensiones', placeholder: 'Ej: 50 x 30 x 20 cm' },
        { key: 'Peso', placeholder: 'Ej: 10 kg' },
        { key: 'Color', placeholder: 'Ej: Negro' },
        { key: 'Certificación', placeholder: 'Ej: CE, IRAM' },
        { key: 'Garantía', placeholder: 'Ej: 12 meses' },
    ]
};

// ============================================
// STATE
// ============================================

let productData = {
    id: null,
    name: '',
    category: '',
    price: '',
    specs: {},
    placas: [],
    imageCount: 0
};

let allProducts = JSON.parse(localStorage.getItem('mlProducts')) || [];
let uploadedImages = [];         // Full-size data URLs (session only)
let uploadedThumbnails = [];     // Small data URLs (for localStorage)
let pdfFile = null;
let extractedText = '';
let extractionMethod = '';  // 'ia', 'regex', 'manual'

// ============================================
// API KEY MANAGEMENT
// ============================================

function getApiKey() {
    return localStorage.getItem('openai_api_key') || '';
}

function saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
        showApiStatus('Ingresá una API key válida', 'error');
        return;
    }
    if (!key.startsWith('sk-')) {
        showApiStatus('La key debe empezar con "sk-"', 'error');
        return;
    }
    localStorage.setItem('openai_api_key', key);
    showApiStatus('✅ API key guardada correctamente', 'success');
}

function removeApiKey() {
    localStorage.removeItem('openai_api_key');
    document.getElementById('apiKeyInput').value = '';
    showApiStatus('🗑 API key eliminada', 'info');
}

async function testApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim() || getApiKey();
    if (!key) {
        showApiStatus('No hay API key configurada', 'error');
        return;
    }
    showApiStatus('⏳ Probando conexión...', 'info');
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
        });
        if (response.ok) {
            showApiStatus('✅ Conexión exitosa — la API key funciona correctamente', 'success');
        } else if (response.status === 401) {
            showApiStatus('❌ API key inválida o expirada', 'error');
        } else if (response.status === 429) {
            showApiStatus('⚠️ Key válida pero sin crédito. Cargá saldo en platform.openai.com', 'error');
        } else {
            showApiStatus(`⚠️ Error ${response.status}. Verificá tu cuenta en platform.openai.com`, 'error');
        }
    } catch (err) {
        showApiStatus('❌ Error de conexión. Verificá tu internet.', 'error');
    }
}

function showApiStatus(message, type) {
    const el = document.getElementById('apiKeyStatus');
    el.innerHTML = `<div class="api-status ${type}">${message}</div>`;
}

function showSettings() {
    const modal = document.getElementById('settingsModal');
    const input = document.getElementById('apiKeyInput');
    const key = getApiKey();
    if (key) {
        input.value = key;
        showApiStatus('✅ API key configurada', 'success');
    } else {
        input.value = '';
        showApiStatus('💡 Sin API key — las specs se cargan con formulario manual', 'info');
    }
    modal.style.display = 'flex';
}

function closeSettings(event) {
    if (event.target === document.getElementById('settingsModal')) {
        document.getElementById('settingsModal').style.display = 'none';
    }
}

function closeSettingsDirect() {
    document.getElementById('settingsModal').style.display = 'none';
}

// ============================================
// OPENAI INTEGRATION
// ============================================

async function openAIExtractSpecs(pdfText, productName, category) {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    // Limit text length to avoid token limits (GPT-4o-mini has 128k context)
    const truncatedText = pdfText.substring(0, 15000);

    const systemPrompt = `Sos un experto en análisis de productos para Mercado Libre Argentina.
Tu trabajo es extraer SOLO las especificaciones técnicas reales de un producto desde su manual de instrucciones.

REGLAS ESTRICTAS:
- SOLO extraé datos técnicos del PRODUCTO (potencia, peso, dimensiones, material, modelo, certificaciones, garantía, etc.)
- IGNORÁ completamente: instrucciones de armado, pasos de instalación, advertencias de seguridad, procedimientos de encendido/apagado
- IGNORÁ textos sobre mantenimiento, limpieza, almacenamiento, herramientas necesarias
- Los valores deben ser CORTOS y precisos (ej: "15 kW", no "la potencia del equipo es de 15 kW según las condiciones")
- Respondé SOLO con JSON válido, sin texto adicional`;

    const userPrompt = `Producto: "${productName}"
Categoría: "${category}"

Extraé las especificaciones técnicas del siguiente manual y devolvelas en este formato JSON exacto:
{
  "specs": {
    "Nombre_spec": "valor_corto",
    ...
  },
  "resumen": "Descripción breve del producto en 1-2 líneas para Mercado Libre",
  "puntos_venta": ["Punto clave 1", "Punto clave 2", "Punto clave 3"]
}

TEXTO DEL MANUAL:
${truncatedText}`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                temperature: 0.1,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error('OpenAI API error:', response.status, errData);
            if (response.status === 401) {
                alert('API key de OpenAI inválida. Verificá en ⚙️ Configuración.');
            } else if (response.status === 429) {
                alert('Sin crédito en OpenAI. Cargá saldo en platform.openai.com');
            }
            return null;
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);

        // Store extra data from AI
        if (parsed.resumen) productData.resumen = parsed.resumen;
        if (parsed.puntos_venta) productData.puntosVenta = parsed.puntos_venta;

        return parsed.specs || null;
    } catch (err) {
        console.error('Error calling OpenAI:', err);
        return null;
    }
}

// ============================================
// CATEGORY TEMPLATE HELPERS
// ============================================

function getTemplateForCategory(category) {
    const cat = category.toLowerCase();
    if (cat.includes('calef') || cat.includes('estufa') || cat.includes('hongo') || cat.includes('calor')) return CATEGORY_TEMPLATES.calefaccion;
    if (cat.includes('cocina') || cat.includes('horno') || cat.includes('parrilla') || cat.includes('anafe')) return CATEGORY_TEMPLATES.cocina;
    if (cat.includes('electr') || cat.includes('comput') || cat.includes('audio') || cat.includes('video') || cat.includes('celular')) return CATEGORY_TEMPLATES.electronica;
    if (cat.includes('herram') || cat.includes('taladro') || cat.includes('sierra') || cat.includes('soldad')) return CATEGORY_TEMPLATES.herramientas;
    if (cat.includes('jardín') || cat.includes('jardin') || cat.includes('riego') || cat.includes('exterior')) return CATEGORY_TEMPLATES.jardin;
    if (cat.includes('hogar') || cat.includes('mueble') || cat.includes('decoración') || cat.includes('decoracion')) return CATEGORY_TEMPLATES.hogar;
    if (cat.includes('deporte') || cat.includes('fitness') || cat.includes('gym') || cat.includes('bici')) return CATEGORY_TEMPLATES.deportes;
    return CATEGORY_TEMPLATES.default;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    setupDragAndDrop();
});

function setupDragAndDrop() {
    // PDF Drop Zone
    const pdfZone = document.getElementById('pdfDropZone');
    const pdfInput = document.getElementById('pdfInput');

    pdfZone.addEventListener('click', () => pdfInput.click());
    pdfZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        pdfZone.classList.add('dragover');
    });
    pdfZone.addEventListener('dragleave', () => {
        pdfZone.classList.remove('dragover');
    });
    pdfZone.addEventListener('drop', (e) => {
        e.preventDefault();
        pdfZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length && files[0].type === 'application/pdf') {
            pdfInput.files = files;
            handlePDFSelect(files[0]);
        }
    });
    pdfInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handlePDFSelect(e.target.files[0]);
        }
    });

    // Image Drop Zone
    const imageZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');

    imageZone.addEventListener('click', () => imageInput.click());
    imageZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageZone.classList.add('dragover');
    });
    imageZone.addEventListener('dragleave', () => {
        imageZone.classList.remove('dragover');
    });
    imageZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageZone.classList.remove('dragover');
        handleImageFiles(e.dataTransfer.files);
    });
    imageInput.addEventListener('change', (e) => {
        handleImageFiles(e.target.files);
    });
}

// ============================================
// PDF HANDLING
// ============================================

function handlePDFSelect(file) {
    pdfFile = file;
    const pdfZone = document.getElementById('pdfDropZone');
    pdfZone.classList.add('has-file');

    document.getElementById('pdfUploadContent').innerHTML = `
        <div class="upload-icon">✅</div>
        <strong>PDF cargado correctamente</strong>
        <p>${file.name} (${(file.size / 1024).toFixed(0)} KB)</p>
    `;

    document.getElementById('pdfFileInfo').style.display = 'inline-flex';
    document.getElementById('pdfFileName').textContent = '📄 ' + file.name;
}

function removePDF() {
    pdfFile = null;
    extractedText = '';
    const pdfZone = document.getElementById('pdfDropZone');
    pdfZone.classList.remove('has-file');

    document.getElementById('pdfUploadContent').innerHTML = `
        <div class="upload-icon">📄</div>
        <strong>Arrastrá o hacé click para cargar el PDF</strong>
        <p>Se extraerán las especificaciones automáticamente</p>
    `;

    document.getElementById('pdfFileInfo').style.display = 'none';
    document.getElementById('pdfInput').value = '';
}

async function extractPDFText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }

    return fullText.trim();
}

function parseSpecsFromText(text) {
    const specs = {};
    const normalizedText = text.replace(/\r\n/g, '\n');

    // ── BLACKLIST: palabras que indican secciones de instrucciones/armado ──
    const NOISE_KEYS = [
        'paso', 'pasos', 'advertencia', 'precaución', 'precaucion', 'cuidado',
        'nota', 'importante', 'atención', 'atencion', 'peligro', 'aviso',
        'instrucciones', 'instrucción', 'operación', 'operacion', 'instalación',
        'instalacion', 'armado', 'montaje', 'ensamble', 'ensamblaje',
        'mantenimiento', 'limpieza', 'almacenamiento', 'desecho',
        'herramientas', 'herramienta', 'necesarias', 'necesarios',
        'situaciones', 'situación', 'descripción', 'descripcion',
        'contenido', 'embalaje', 'desembalaje', 'introducción', 'introduccion',
        'fugas', 'fuga', 'prueba', 'pruebas', 'verificar', 'verificación',
        'encender', 'apagar', 'encendido', 'apagado', 'arranque',
        'seguridad', 'regulaciones', 'normativas', 'índice', 'indice',
        'garantía', 'servicio', 'contacto', 'teléfono', 'telefono',
        'los pasos', 'las siguientes', 'continuación', 'continuacion',
        'siguiente', 'anterior', 'diagrama', 'figura', 'fig',
        'solución', 'solucion', 'problema', 'causa', 'remedio'
    ];

    const NOISE_VALUES = [
        'se fijan', 'se coloca', 'se instala', 'se conecta', 'se ajusta',
        'para encender', 'para apagar', 'desatornille', 'atornille',
        'nunca realice', 'no utilice', 'no use', 'asegúrese', 'asegurese',
        'verifique', 'compruebe', 'si no se', 'en caso de', 'cuando el',
        'llave de boca', 'destornillador', 'pinza'
    ];

    function isNoiseKey(key) {
        const k = key.toLowerCase().trim();
        return NOISE_KEYS.some(noise => k.includes(noise));
    }

    function isNoiseValue(value) {
        const v = value.toLowerCase().trim();
        // Reject if starts with instruction-like text
        if (NOISE_VALUES.some(noise => v.includes(noise))) return true;
        // Reject if it's a sentence (too many words without units)
        const words = v.split(/\s+/);
        if (words.length > 8) return true;
        // Reject if it looks like a paragraph (has verbs/articles patterns)
        if (/\b(el|la|los|las|un|una|que|para|con|por|del|al)\b.*\b(el|la|los|las|un|una|que|para|con|por)\b/i.test(v)) return true;
        return false;
    }

    function isValidSpecValue(value) {
        const v = value.trim();
        // Must be short enough to be a spec
        if (v.length > 50) return false;
        if (v.length < 2) return false;
        // Should contain a number OR a known material/color word
        const hasNumber = /\d/.test(v);
        const hasUnit = /(?:mm|cm|m\b|kg|g\b|w\b|kw|kva|v\b|a\b|hz|°|ºc|ºf|litros?|lts?|btu|bar|psi|rpm|cfm|db|dba|mpa|cal|kcal|joule|watt)/i.test(v);
        const hasMaterial = /(?:acero|aluminio|hierro|cobre|inoxidable|galvanizado|plástico|plastico|vidrio|cerámica|ceramica|madera|cromado|pintado|esmaltado|negro|blanco|gris|rojo|azul)/i.test(v);
        const hasCert = /(?:ce\b|iso|iram|ul\b|etl|csa|rohs|fcc|iec|en\s*\d)/i.test(v);
        return hasNumber || hasUnit || hasMaterial || hasCert;
    }

    // ── STEP 1: Try to find a "Specifications" section and extract from there ──
    const specSectionRegex = /(?:especificaciones|datos\s*t[ée]cnicos|caracter[ií]sticas\s*t[ée]cnicas|ficha\s*t[ée]cnica|technical\s*data|specifications)\s*[:\n]/i;
    const specSectionMatch = normalizedText.match(specSectionRegex);
    
    // If we find a spec section, prioritize text near it (next ~800 chars)
    let specSectionText = '';
    if (specSectionMatch) {
        const startIdx = specSectionMatch.index;
        specSectionText = normalizedText.substring(startIdx, startIdx + 800);
    }

    // Text to search: prioritize spec section, fallback to full text
    const searchTexts = specSectionText ? [specSectionText, normalizedText] : [normalizedText];

    // ── STEP 2: Specific patterns for known specs ──
    const specificPatterns = [
        { key: 'Modelo', regex: /modelo\s*[:\-]\s*([A-Za-z0-9\-\.\/\s]{2,30})/i },
        { key: 'Referencia', regex: /referencia\s*[:\-]\s*([A-Za-z0-9\-\.\/\s]{2,30})/i },
        { key: 'Código', regex: /c[óo]digo\s*[:\-]\s*([A-Za-z0-9\-\.\/\s]{2,30})/i },
        { key: 'Potencia', regex: /potencia\s*[:\-]?\s*(\d[\d\.,]*\s*(?:w|kw|hp|cv|watts?|kilowatts?))/i },
        { key: 'Entrada de calor', regex: /entrada\s*de\s*calor(?:\s*nominal)?\s*[:\-]?\s*(\d[\d\.,]*\s*(?:w|kw|btu|kcal)[^\n,;]{0,20})/i },
        { key: 'Voltaje', regex: /voltaje\s*[:\-]?\s*(\d[\d\.,\s\/]*\s*v(?:olts?)?)/i },
        { key: 'Tensión', regex: /tensi[óo]n\s*[:\-]?\s*(\d[\d\.,\s\/]*\s*v(?:olts?)?)/i },
        { key: 'Consumo', regex: /consumo\s*[:\-]?\s*(\d[\d\.,]*\s*(?:w|kw|kva|a|kwh)[^\n,;]{0,15})/i },
        { key: 'Frecuencia', regex: /frecuencia\s*[:\-]?\s*(\d[\d\.,\s\/]*\s*hz)/i },
        { key: 'Peso', regex: /peso(?:\s*neto)?\s*[:\-]?\s*(\d[\d\.,]*\s*(?:kg|g|lbs?|libras?))/i },
        { key: 'Peso bruto', regex: /peso\s*bruto\s*[:\-]?\s*(\d[\d\.,]*\s*(?:kg|g|lbs?))/i },
        { key: 'Dimensiones', regex: /dimensiones\s*[:\-]?\s*([\d\.,]+\s*[x×X]\s*[\d\.,]+(?:\s*[x×X]\s*[\d\.,]+)?\s*(?:mm|cm|m|pulgadas?|")?)/i },
        { key: 'Altura', regex: /altura\s*[:\-]?\s*(\d[\d\.,]*\s*(?:mm|cm|m))/i },
        { key: 'Ancho', regex: /ancho\s*[:\-]?\s*(\d[\d\.,]*\s*(?:mm|cm|m))/i },
        { key: 'Largo', regex: /largo\s*[:\-]?\s*(\d[\d\.,]*\s*(?:mm|cm|m))/i },
        { key: 'Profundidad', regex: /profundidad\s*[:\-]?\s*(\d[\d\.,]*\s*(?:mm|cm|m))/i },
        { key: 'Diámetro', regex: /di[áa]metro\s*[:\-]?\s*(\d[\d\.,]*\s*(?:mm|cm|m|pulgadas?|"))/i },
        { key: 'Material', regex: /material(?:es)?\s*[:\-]\s*([^\n,;]{2,40})/i },
        { key: 'Capacidad', regex: /capacidad\s*[:\-]?\s*(\d[\d\.,]*\s*(?:litros?|lts?|ml|kg|g|m3|m³)?[^\n,;]{0,15})/i },
        { key: 'Garantía', regex: /garant[íi]a\s*[:\-]?\s*(\d[\d\.,]*\s*(?:meses?|años?|días?|a[ñn]os?))/i },
        { key: 'Certificación', regex: /(?:certificaci[óo]n|aprobado\s*por|norma)\s*[:\-]?\s*([^\n,;]{2,30})/i },
        { key: 'Color', regex: /color(?:es)?\s*[:\-]\s*([^\n,;]{2,25})/i },
        { key: 'Presión', regex: /presi[óo]n\s*[:\-]?\s*(\d[\d\.,]*\s*(?:bar|psi|mpa|kpa|atm)[^\n,;]{0,15})/i },
        { key: 'Velocidad', regex: /velocidad\s*[:\-]?\s*(\d[\d\.,]*\s*(?:rpm|km\/h|m\/s)[^\n,;]{0,15})/i },
        { key: 'Rendimiento', regex: /rendimiento\s*[:\-]?\s*(\d[\d\.,]*\s*%?[^\n,;]{0,15})/i },
        { key: 'Combustible', regex: /combustible\s*[:\-]\s*([^\n,;]{2,30})/i },
        { key: 'Tipo de gas', regex: /tipo\s*de\s*gas\s*[:\-]\s*([^\n,;]{2,30})/i },
        { key: 'Caudal', regex: /caudal\s*[:\-]?\s*(\d[\d\.,]*\s*(?:l\/h|m3\/h|lpm|gpm)[^\n,;]{0,15})/i },
        { key: 'Ruido', regex: /(?:ruido|nivel\s*sonoro|dba?)\s*[:\-]?\s*(\d[\d\.,]*\s*(?:db|dba?))/i },
        { key: 'Superficie', regex: /superficie(?:\s*de\s*calefacci[óo]n)?\s*[:\-]?\s*(\d[\d\.,]*\s*(?:m2|m²|m\s*cuadrados?)[^\n,;]{0,15})/i },
        { key: 'Marca', regex: /marca\s*[:\-]\s*([^\n,;]{2,25})/i },
        { key: 'Origen', regex: /(?:pa[íi]s\s*de\s*)?origen\s*[:\-]\s*([^\n,;]{2,25})/i },
    ];

    // Search in spec section first, then full text
    for (const pattern of specificPatterns) {
        if (specs[pattern.key]) continue; // Already found

        for (const searchText of searchTexts) {
            const match = searchText.match(pattern.regex);
            if (match && match[1].trim().length > 1) {
                const value = match[1].trim();
                // Validate it's not noise
                if (!isNoiseKey(pattern.key) && !isNoiseValue(value)) {
                    specs[pattern.key] = value;
                    break;
                }
            }
        }
    }

    // ── STEP 3: Generic "key: value" extraction (only in spec section if found) ──
    const genericSearchText = specSectionText || normalizedText;
    const genericPattern = /([A-Za-záéíóúñÁÉÍÓÚÑüÜ\s]{3,25})\s*[:]\s*([^\n]{2,40})/g;
    let genericMatch;
    
    while ((genericMatch = genericPattern.exec(genericSearchText)) !== null) {
        const key = genericMatch[1].trim();
        const value = genericMatch[2].trim();

        // Skip if already found
        const existingKeys = Object.keys(specs).map(k => k.toLowerCase());
        if (existingKeys.includes(key.toLowerCase())) continue;

        // Apply all filters
        if (isNoiseKey(key)) continue;
        if (isNoiseValue(value)) continue;
        if (!isValidSpecValue(value)) continue;

        specs[key.charAt(0).toUpperCase() + key.slice(1)] = value;
    }

    // ── STEP 4: Look for "15 kW" style inline specs (common in product PDFs) ──
    if (!specs['Potencia'] && !specs['Entrada de calor']) {
        const inlinePower = normalizedText.match(/(\d[\d\.,]*)\s*(kw|kW|KW|watts?|W)\b/);
        if (inlinePower) {
            specs['Potencia'] = inlinePower[1] + ' ' + inlinePower[2];
        }
    }

    // Look for CE/certification marks
    if (!specs['Certificación']) {
        const certMatch = normalizedText.match(/aprobado\s*por\s*(?:la\s*)?(CE|IRAM|UL|ETL|CSA)/i);
        if (certMatch) {
            specs['Certificación'] = certMatch[1].toUpperCase();
        }
    }

    return specs;
}

// ============================================
// IMAGE HANDLING
// ============================================

function handleImageFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImages.push(e.target.result);

            // Create thumbnail for storage
            createThumbnail(e.target.result, 200, (thumbDataUrl) => {
                uploadedThumbnails.push(thumbDataUrl);
            });

            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

function createThumbnail(dataUrl, maxWidth, callback) {
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
}

function renderImagePreviews() {
    const container = document.getElementById('imagePreviews');
    let html = '';

    uploadedImages.forEach((src, index) => {
        html += `
            <div class="thumbnail-item">
                <img src="${src}" alt="Foto ${index + 1}">
                <button class="thumbnail-remove" onclick="removeImage(${index})" title="Eliminar">✕</button>
            </div>
        `;
    });

    container.innerHTML = html;

    // Update upload zone state
    const zone = document.getElementById('imageDropZone');
    if (uploadedImages.length > 0) {
        zone.classList.add('has-file');
    } else {
        zone.classList.remove('has-file');
    }
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    uploadedThumbnails.splice(index, 1);
    renderImagePreviews();
}

// ============================================
// SPEC EDITING
// ============================================

function renderSpecsEditor(specs) {
    const editor = document.getElementById('specsEditor');
    editor.innerHTML = '';

    for (const [key, value] of Object.entries(specs)) {
        addSpecRow(key, value);
    }

    // If no specs found, add empty rows
    if (Object.keys(specs).length === 0) {
        addSpecRow('', '');
        addSpecRow('', '');
        addSpecRow('', '');
    }
}

function renderSpecsEditorFromTemplate(template) {
    const editor = document.getElementById('specsEditor');
    editor.innerHTML = '';

    template.forEach(field => {
        const row = document.createElement('div');
        row.className = 'spec-edit-row';
        row.innerHTML = `
            <input type="text" class="spec-key-input" value="${escapeHtml(field.key)}" placeholder="Especificación">
            <input type="text" class="spec-value-input" value="" placeholder="${escapeHtml(field.placeholder)}">
            <button class="btn-remove-small" onclick="this.parentElement.remove()" title="Eliminar">✕</button>
        `;
        editor.appendChild(row);
    });
}

function addSpecRow(key, value) {
    const editor = document.getElementById('specsEditor');
    const row = document.createElement('div');
    row.className = 'spec-edit-row';
    row.innerHTML = `
        <input type="text" class="spec-key-input" value="${escapeHtml(key)}" placeholder="Ej: Potencia, Peso, Material...">
        <input type="text" class="spec-value-input" value="${escapeHtml(value)}" placeholder="Ej: 1500W, 5kg, Acero inoxidable...">
        <button class="btn-remove-small" onclick="this.parentElement.remove()" title="Eliminar">✕</button>
    `;
    editor.appendChild(row);
}

function collectSpecs() {
    const rows = document.querySelectorAll('.spec-edit-row');
    const specs = {};

    rows.forEach(row => {
        const key = row.querySelector('.spec-key-input').value.trim();
        const value = row.querySelector('.spec-value-input').value.trim();
        if (key && value) {
            specs[key] = value;
        }
    });

    return specs;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// PLACA GENERATION (DYNAMIC)
// ============================================

function getContextForCategory(category) {
    const cat = category.toLowerCase();

    if (cat.includes('calef') || cat.includes('estufa') || cat.includes('hongo') || cat.includes('calor')) {
        return CATEGORY_CONTEXTS.calefaccion;
    }
    if (cat.includes('cocina') || cat.includes('horno') || cat.includes('parrilla') || cat.includes('anafe')) {
        return CATEGORY_CONTEXTS.cocina;
    }
    if (cat.includes('electr') || cat.includes('comput') || cat.includes('audio') || cat.includes('video') || cat.includes('celular')) {
        return CATEGORY_CONTEXTS.electronica;
    }
    if (cat.includes('herram') || cat.includes('taladro') || cat.includes('sierra') || cat.includes('soldad')) {
        return CATEGORY_CONTEXTS.herramientas;
    }
    if (cat.includes('jardín') || cat.includes('jardin') || cat.includes('riego') || cat.includes('exterior') || cat.includes('piscina')) {
        return CATEGORY_CONTEXTS.jardin;
    }
    if (cat.includes('hogar') || cat.includes('mueble') || cat.includes('decoración') || cat.includes('decoracion') || cat.includes('baño')) {
        return CATEGORY_CONTEXTS.hogar;
    }
    if (cat.includes('deporte') || cat.includes('fitness') || cat.includes('gym') || cat.includes('bici')) {
        return CATEGORY_CONTEXTS.deportes;
    }

    return CATEGORY_CONTEXTS.default;
}

function findSpecValue(specs, keys) {
    for (const key of keys) {
        for (const [specKey, specValue] of Object.entries(specs)) {
            if (specKey.toLowerCase().includes(key.toLowerCase())) {
                return specValue;
            }
        }
    }
    return null;
}

function generatePlacas() {
    const name = productData.name;
    const specs = productData.specs;
    const ctx = getContextForCategory(productData.category);

    // Extract useful values from specs
    const materials = findSpecValue(specs, ['material', 'materiales', 'construcción', 'acabado']) || 'premium finish';
    const dimensions = findSpecValue(specs, ['dimensiones', 'altura', 'tamaño', 'medidas', 'largo', 'ancho']) || '';
    const model = findSpecValue(specs, ['modelo', 'referencia', 'código', 'sku']) || '';
    const certs = findSpecValue(specs, ['certificación', 'certificaciones', 'norma', 'aprobación']) || '';
    const warranty = findSpecValue(specs, ['garantía', 'garantia']) || '12 meses';
    const weight = findSpecValue(specs, ['peso']) || '';
    const power = findSpecValue(specs, ['potencia', 'consumo', 'voltaje', 'watts']) || '';
    const color = findSpecValue(specs, ['color', 'colores']) || '';
    const capacity = findSpecValue(specs, ['capacidad', 'volumen', 'litros']) || '';

    // Build a brief spec string for prompts
    const specBrief = [materials, dimensions, color, power].filter(Boolean).join(', ');

    return [
        {
            number: 1,
            title: "Hero Shot — Lifestyle",
            prompt: `Professional lifestyle photography: ${name} in use, ${ctx.setting}, ${ctx.lighting}, high-end commercial advertisement style, photorealistic, 4K resolution, magazine quality composition`,
            purpose: "Aspiración y contexto de uso — la primera impresión que vende",
            conversion: "~40% de los compradores siguen scrolleando después de esta imagen",
            visualSpecs: `Iluminación ${ctx.mood}, producto en uso real, ambiente ${ctx.environment}`
        },
        {
            number: 2,
            title: "Producto 360° — Vista Completa",
            prompt: `Product photography: ${name}, pure white background, professional studio lighting from 3 angles, ${specBrief || 'all details visible'}, sharp focus, elegant minimalist composition, e-commerce style, 1200x1200px, 4K`,
            purpose: "Confianza — el comprador ve exactamente qué recibe",
            conversion: "~35% continúan al siguiente slide",
            visualSpecs: `Fondo blanco puro, iluminación tri-direccional, vista completa 360° del ${name}`
        },
        {
            number: 3,
            title: "Detalle Técnico — Close-Up",
            prompt: `Extreme close-up macro photography: ${name} key feature detail, ${materials} texture visible, ${color ? color + ' color,' : ''} professional studio lighting, technical precision, sharp focus, documentary style, 4K`,
            purpose: "Calidad y seguridad — demuestra construcción premium",
            conversion: "Reduce dudas sobre calidad de materiales",
            visualSpecs: `Macro del componente principal, textura de ${materials}, detalle técnico visible`
        },
        {
            number: 4,
            title: "Certificaciones y Specs",
            prompt: `Clean infographic design, white background, ${model ? 'model ' + model + ',' : ''} ${certs ? certs + ' certification mark,' : ''} ${power ? power + ' specification,' : ''} organized grid layout, official documentation style, corporate aesthetic, technical data sheet, 4K`,
            purpose: "Credibilidad normativa — datos técnicos oficiales",
            conversion: "Credibilidad máxima para compradores técnicos",
            visualSpecs: `${model ? 'Modelo: ' + model + '. ' : ''}${certs ? 'Certificación: ' + certs + '. ' : ''}${power ? 'Potencia: ' + power + '. ' : ''}Especificaciones técnicas en formato infográfico`
        },
        {
            number: 5,
            title: "Controles e Interfaz",
            prompt: `Close-up detail: ${name} controls and user interface, ${materials} housing, clear visibility of buttons/dials/display, sharp macro photography, instruction manual style, easy to understand, 4K`,
            purpose: "Usabilidad — muestra que es fácil de usar",
            conversion: "Reduce objeción 'será complicado de usar'",
            visualSpecs: `Detalle de controles, botones, perillas o pantalla del ${name}, claridad de uso`
        },
        {
            number: 6,
            title: "Escala con Persona",
            prompt: `Lifestyle photograph: ${name} next to person for scale reference, ${ctx.setting.split(',')[0]}, ${dimensions ? 'product dimensions approximately ' + dimensions + ',' : ''} realistic proportions visible, natural pose, ${ctx.lighting}, 4K`,
            purpose: "Proporción real — el comprador entiende el tamaño",
            conversion: "Reduce objeción 'no sé si me sirve el tamaño'",
            visualSpecs: `${dimensions ? 'Dimensiones: ' + dimensions + '. ' : ''}${weight ? 'Peso: ' + weight + '. ' : ''}Persona como referencia de escala`
        },
        {
            number: 7,
            title: "Instalación / Armado",
            prompt: `How-to photography: ${name} unboxed with all included accessories and parts visible, organized flat lay on clean surface, step-by-step setup context, modern residential setting, clear instructional style, 4K`,
            purpose: "Practicidad — muestra que viene listo o es fácil de armar",
            conversion: "Reduce objeción 'será difícil de instalar/armar'",
            visualSpecs: `Contenido de la caja, accesorios incluidos, disposición ordenada flat-lay`
        },
        {
            number: 8,
            title: "Materiales y Durabilidad",
            prompt: `Extreme macro photography: ${name} construction details, ${materials} surfaces, professional industrial finish visible, premium build quality evident, craftsmanship close-up, technical documentation style, 4K`,
            purpose: "Durabilidad — justifica la inversión",
            conversion: "Reduce objeción 'no va a durar'",
            visualSpecs: `Macro de ${materials}, acabados, soldaduras o ensambles, construcción robusta`
        },
        {
            number: 9,
            title: "Uso Comercial / Social Proof",
            prompt: `Professional photography: multiple ${name} units in ${ctx.commercialScene}, professional environment, satisfied users visible, ${ctx.lighting}, commercial hospitality style, luxury venue, 4K`,
            purpose: "Prueba social y uso B2B — validación profesional",
            conversion: "Validación: 'si los profesionales lo usan, es bueno'",
            visualSpecs: `Múltiples unidades en uso, ambiente profesional/comercial, clientes satisfechos`
        },
        {
            number: 10,
            title: "Garantía y CTA Final",
            prompt: `Professional corporate warranty seal design, circular badge with DELHI brand logo, '${warranty} Guarantee' text, certification mark style, metallic gold and silver effect, premium aesthetic, official trust badge, 4K`,
            purpose: "Cierre de venta — garantía + confianza + llamada a la acción",
            conversion: "Convierte visitantes en compradores",
            visualSpecs: `Sello de garantía ${warranty}, logo DELHI, datos de contacto, llamada a la acción final`
        }
    ];
}

// ============================================
// FLOW CONTROL
// ============================================

async function analyzeProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = document.getElementById('price').value.trim();

    if (!name || !category) {
        alert('Completá el Nombre y la Categoría del producto');
        return;
    }

    productData.name = name;
    productData.category = category;
    productData.price = price;
    productData.id = Date.now();
    productData.imageCount = uploadedImages.length;

    // Show loading
    const loadingEl = document.getElementById('loadingIndicator');
    const analyzeBtn = document.getElementById('analyzeBtn');
    loadingEl.style.display = 'block';
    analyzeBtn.disabled = true;

    let specs = {};
    extractionMethod = '';

    // ── PATH DECISION ──
    const hasApiKey = !!getApiKey();
    const hasPDF = !!pdfFile;

    if (hasPDF) {
        // Extract text from PDF first
        try {
            document.getElementById('loadingIndicator').querySelector('p').textContent = 'Extrayendo texto del PDF...';
            analyzeBtn.textContent = '⏳ Leyendo PDF...';
            extractedText = await extractPDFText(pdfFile);
        } catch (err) {
            console.error('Error extracting PDF:', err);
            extractedText = '';
        }

        if (extractedText && hasApiKey) {
            // PATH 1: IA extraction
            try {
                document.getElementById('loadingIndicator').querySelector('p').textContent = '🤖 Analizando con IA... (puede tardar 15-30 seg)';
                analyzeBtn.textContent = '🤖 IA analizando...';
                const aiSpecs = await openAIExtractSpecs(extractedText, name, category);
                if (aiSpecs && Object.keys(aiSpecs).length > 0) {
                    specs = aiSpecs;
                    extractionMethod = 'ia';
                } else {
                    // AI failed, fallback to regex
                    specs = parseSpecsFromText(extractedText);
                    extractionMethod = 'regex';
                }
            } catch (err) {
                console.error('AI extraction failed, falling back to regex:', err);
                specs = parseSpecsFromText(extractedText);
                extractionMethod = 'regex';
            }
        } else if (extractedText) {
            // PATH 2: Regex extraction (no API key)
            specs = parseSpecsFromText(extractedText);
            extractionMethod = 'regex';
        }
    }

    if (!hasPDF || Object.keys(specs).length === 0) {
        // PATH 3: Manual form (no PDF or no specs extracted)
        extractionMethod = 'manual';
    }

    productData.specs = specs;

    // Hide loading
    loadingEl.style.display = 'none';
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = '🔍 Analizar y Extraer Especificaciones';

    // Show extraction badge
    const badge = document.getElementById('extractionBadge');
    const desc = document.getElementById('specsDescription');
    if (extractionMethod === 'ia') {
        badge.innerHTML = '<span class="extraction-badge badge-ia">🤖 Extraído con IA</span>';
        desc.textContent = 'La IA extrajo estas especificaciones del manual. Revisá y editá lo que necesites.';
        if (productData.resumen) {
            desc.textContent += ' Resumen: ' + productData.resumen;
        }
    } else if (extractionMethod === 'regex') {
        badge.innerHTML = '<span class="extraction-badge badge-regex">🔍 Extracción básica</span>';
        desc.textContent = 'Se detectaron algunas specs del PDF. Revisá y completá lo que falte. Configurá la API de OpenAI (⚙️) para extracción inteligente.';
    } else {
        badge.innerHTML = '<span class="extraction-badge badge-manual">✍️ Formulario manual</span>';
        desc.textContent = 'Completá las especificaciones del producto. Los campos están adaptados a la categoría "' + category + '".';
    }

    // Render specs editor
    if (extractionMethod === 'manual') {
        // Show category-specific template fields
        const template = getTemplateForCategory(category);
        renderSpecsEditorFromTemplate(template);
    } else {
        renderSpecsEditor(specs);
    }

    // Show PDF text preview if available
    const pdfSection = document.getElementById('pdfTextSection');
    if (extractedText) {
        pdfSection.style.display = 'block';
        document.getElementById('pdfTextPreview').textContent = extractedText;
    } else {
        pdfSection.style.display = 'none';
    }

    updateProgress(1, 2);
    switchStepContent(2);
}

function goToStep3() {
    // Collect edited specs
    productData.specs = collectSpecs();

    if (Object.keys(productData.specs).length === 0) {
        if (!confirm('No hay especificaciones cargadas. ¿Querés continuar sin specs? Los prompts serán más genéricos.')) {
            return;
        }
    }

    // Generate dynamic placas
    productData.placas = generatePlacas();

    // Display
    displayPlacas();
    updateProgress(2, 3);
    switchStepContent(3);
}

function goToStep4() {
    displayFinalSummary();
    updateProgress(3, 4);
    switchStepContent(4);
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function displayPlacas() {
    const placasOutput = document.getElementById('placasOutput');
    document.getElementById('placasProductName').textContent = productData.name;

    // Show reference images
    if (uploadedImages.length > 0) {
        const refSection = document.getElementById('referenceImages');
        refSection.style.display = 'block';
        const refGrid = document.getElementById('referenceImageGrid');
        refGrid.innerHTML = uploadedImages.map((src, i) =>
            `<img src="${src}" alt="Referencia ${i + 1}" title="Foto de referencia ${i + 1}">`
        ).join('');
    }

    let html = '';
    productData.placas.forEach(placa => {
        html += `
            <div class="placa-card">
                <div class="placa-header">
                    <div>
                        <div class="placa-number">Imagen ${placa.number} de 10</div>
                        <div class="placa-title">${placa.title}</div>
                    </div>
                    <button class="btn-copy" onclick="copyPrompt(this, ${placa.number - 1})">📋 Copiar Prompt</button>
                </div>
                <div class="placa-text"><strong>Propósito:</strong> ${placa.purpose}</div>
                <div class="placa-text"><strong>Conversión esperada:</strong> ${placa.conversion}</div>
                <div class="placa-prompt-box">
                    <div class="placa-prompt-label">Prompt para ChatGPT / Nano Banana</div>
                    <div class="placa-prompt-text" id="prompt-${placa.number - 1}">${placa.prompt}</div>
                </div>
                <div class="placa-specs">
                    <p><strong>Detalles visuales:</strong> ${placa.visualSpecs}</p>
                </div>
            </div>
        `;
    });

    placasOutput.innerHTML = html;
}

function copyPrompt(button, index) {
    const promptText = productData.placas[index].prompt;
    navigator.clipboard.writeText(promptText).then(() => {
        button.classList.add('copied');
        button.textContent = '✅ Copiado!';
        setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = '📋 Copiar Prompt';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        button.classList.add('copied');
        button.textContent = '✅ Copiado!';
        setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = '📋 Copiar Prompt';
        }, 2000);
    });
}

function displayFinalSummary() {
    const summary = document.getElementById('finalSummary');
    const specCount = Object.keys(productData.specs).length;

    let specsHtml = '';
    for (const [key, value] of Object.entries(productData.specs)) {
        specsHtml += `
            <div class="spec-box">
                <div class="spec-label">${escapeHtml(key)}</div>
                <div class="spec-value">${escapeHtml(value)}</div>
            </div>
        `;
    }

    summary.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
            <div class="spec-box">
                <div class="spec-label">Producto</div>
                <div class="spec-value">${escapeHtml(productData.name)}</div>
            </div>
            <div class="spec-box">
                <div class="spec-label">Categoría</div>
                <div class="spec-value">${escapeHtml(productData.category)}</div>
            </div>
            <div class="spec-box">
                <div class="spec-label">Precio</div>
                <div class="spec-value">${escapeHtml(productData.price || 'No definido')}</div>
            </div>
            <div class="spec-box">
                <div class="spec-label">Placas Generadas</div>
                <div class="spec-value">10/10 ✓</div>
            </div>
            <div class="spec-box">
                <div class="spec-label">Especificaciones</div>
                <div class="spec-value">${specCount} detectadas</div>
            </div>
            <div class="spec-box">
                <div class="spec-label">Fotos Cargadas</div>
                <div class="spec-value">${uploadedImages.length} fotos</div>
            </div>
        </div>
        <h4 style="margin-bottom: 0.75rem; font-size: 14px;">Especificaciones del Producto</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem;">
            ${specsHtml || '<p style="color: #999; font-size: 13px;">Sin especificaciones cargadas</p>'}
        </div>
    `;
}

// ============================================
// SAVE & HISTORY
// ============================================

function saveProductFinal() {
    if (!productData.name) {
        alert('Por favor completá los datos del producto');
        return;
    }

    const productToSave = {
        id: Date.now(),
        name: productData.name,
        category: productData.category,
        price: productData.price,
        specs: { ...productData.specs },
        placas: productData.placas.map(p => ({ ...p })),
        thumbnails: uploadedThumbnails.slice(0, 5), // Max 5 thumbnails to save space
        imageCount: uploadedImages.length,
        createdAt: new Date().toLocaleString()
    };

    allProducts.push(productToSave);

    try {
        localStorage.setItem('mlProducts', JSON.stringify(allProducts));
    } catch (e) {
        // If localStorage is full, try without thumbnails
        console.warn('localStorage full, saving without thumbnails');
        productToSave.thumbnails = [];
        localStorage.setItem('mlProducts', JSON.stringify(allProducts));
    }

    alert('✅ Producto "' + productData.name + '" guardado exitosamente en Historial');
    resetForm();
}

function resetForm() {
    // Reset state
    productData = {
        id: null,
        name: '',
        category: '',
        price: '',
        specs: {},
        placas: [],
        imageCount: 0
    };
    uploadedImages = [];
    uploadedThumbnails = [];
    pdfFile = null;
    extractedText = '';

    // Reset form fields
    document.getElementById('productName').value = '';
    document.getElementById('category').value = '';
    document.getElementById('price').value = '';

    // Reset PDF zone
    removePDF();

    // Reset image zone
    document.getElementById('imagePreviews').innerHTML = '';
    document.getElementById('imageDropZone').classList.remove('has-file');
    document.getElementById('imageInput').value = '';

    // Reset steps
    document.querySelectorAll('.step-content').forEach(el => el.style.display = 'none');
    document.getElementById('step1-content').style.display = 'block';

    // Reset progress
    document.querySelectorAll('.progress-step').forEach(el => {
        el.classList.remove('active', 'completed');
    });
    document.getElementById('step1').classList.add('active');

    // Reset reference images
    const refSection = document.getElementById('referenceImages');
    if (refSection) refSection.style.display = 'none';
}

// ============================================
// UI NAVIGATION
// ============================================

function switchStepContent(step) {
    document.querySelectorAll('.step-content').forEach(el => el.style.display = 'none');
    document.getElementById(`step${step}-content`).style.display = 'block';
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(current, next) {
    document.getElementById(`step${current}`).classList.add('completed');
    document.getElementById(`step${next}`).classList.add('active');
}

function switchView(view) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(view).classList.add('active');

    document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    if (view === 'history') {
        loadHistory();
    }
}

// ============================================
// HISTORY
// ============================================

function loadHistory() {
    const container = document.getElementById('historyContainer');
    allProducts = JSON.parse(localStorage.getItem('mlProducts')) || [];

    if (allProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 No hay productos guardados aún</p>
                <p style="font-size: 13px; color: #999; margin-top: 0.5rem;">Completá el flujo de creación para guardar tu primer producto</p>
            </div>
        `;
        return;
    }

    let html = '<div class="history-grid">';

    allProducts.forEach((product, index) => {
        const thumbHtml = product.thumbnails && product.thumbnails.length > 0
            ? `<img src="${product.thumbnails[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:6px 6px 0 0;margin:-1.5rem -1.5rem 1rem;width:calc(100% + 3rem);">`
            : '';

        html += `
            <div class="history-card" onclick="viewProductDetail(${index})">
                ${thumbHtml}
                <h4>${escapeHtml(product.name)}</h4>
                <p><strong>Categoría:</strong> ${escapeHtml(product.category)}</p>
                <p><strong>Precio:</strong> ${escapeHtml(product.price || 'N/A')}</p>
                <p><strong>Specs:</strong> ${Object.keys(product.specs || {}).length} especificaciones</p>
                <p><strong>Placas:</strong> ${product.placas ? product.placas.length : 10}/10 ✓</p>
                <p class="history-date">📅 ${product.createdAt}</p>
                <div class="history-actions">
                    <button class="btn-sm btn-secondary" onclick="event.stopPropagation(); deleteProduct(${index})">🗑 Eliminar</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function viewProductDetail(index) {
    const product = allProducts[index];
    const modal = document.getElementById('productModal');
    const body = document.getElementById('modalBody');

    let specsHtml = '';
    if (product.specs && Object.keys(product.specs).length > 0) {
        specsHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem;">';
        for (const [key, value] of Object.entries(product.specs)) {
            specsHtml += `<div class="spec-box"><div class="spec-label">${escapeHtml(key)}</div><div class="spec-value">${escapeHtml(value)}</div></div>`;
        }
        specsHtml += '</div>';
    } else {
        specsHtml = '<p style="color:#999; font-size:13px;">Sin especificaciones</p>';
    }

    let placasHtml = '';
    if (product.placas && product.placas.length > 0) {
        product.placas.forEach(placa => {
            placasHtml += `
                <div class="placa-card" style="margin-bottom: 1rem;">
                    <div class="placa-number">Imagen ${placa.number}</div>
                    <div class="placa-title">${placa.title}</div>
                    <div class="placa-prompt-box">
                        <div class="placa-prompt-label">Prompt</div>
                        <div class="placa-prompt-text">${placa.prompt}</div>
                    </div>
                </div>
            `;
        });
    }

    let thumbsHtml = '';
    if (product.thumbnails && product.thumbnails.length > 0) {
        thumbsHtml = '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">';
        product.thumbnails.forEach((src, i) => {
            thumbsHtml += `<img src="${src}" style="width:100px;height:100px;object-fit:cover;border-radius:6px;" alt="Foto ${i + 1}">`;
        });
        thumbsHtml += '</div>';
    }

    body.innerHTML = `
        <h3>📦 ${escapeHtml(product.name)}</h3>

        <div class="modal-section">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.5rem;">
                <div class="spec-box"><div class="spec-label">Categoría</div><div class="spec-value">${escapeHtml(product.category)}</div></div>
                <div class="spec-box"><div class="spec-label">Precio</div><div class="spec-value">${escapeHtml(product.price || 'N/A')}</div></div>
                <div class="spec-box"><div class="spec-label">Creado</div><div class="spec-value">${product.createdAt}</div></div>
            </div>
        </div>

        ${thumbsHtml ? '<div class="modal-section"><h4>Fotos del Producto</h4>' + thumbsHtml + '</div>' : ''}

        <div class="modal-section">
            <h4>Especificaciones</h4>
            ${specsHtml}
        </div>

        <div class="modal-section">
            <h4>Las 10 Placas</h4>
            ${placasHtml}
        </div>
    `;

    modal.style.display = 'flex';
}

function closeModal(event) {
    if (event.target === document.getElementById('productModal')) {
        document.getElementById('productModal').style.display = 'none';
    }
}

function closeModalDirect() {
    document.getElementById('productModal').style.display = 'none';
}

function deleteProduct(index) {
    const product = allProducts[index];
    if (confirm(`¿Eliminar "${product.name}" del historial?`)) {
        allProducts.splice(index, 1);
        localStorage.setItem('mlProducts', JSON.stringify(allProducts));
        loadHistory();
    }
}
