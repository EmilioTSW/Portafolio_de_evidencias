    /* ==================== VARIABLES GLOBALES ==================== */
let points = [];
let currentRange = 10;

/* ==================== CONSTANTES MATEMÁTICAS ==================== */
const CONSTANTS = {
  // Constantes básicas
  'π': Math.PI,
  'pi': Math.PI,
  'e': Math.E,
  // Número áureo (phi)
  'φ': (1 + Math.sqrt(5)) / 2,
  'phi': (1 + Math.sqrt(5)) / 2,
  // Tau (2π)
  'τ': 2 * Math.PI,
  'tau': 2 * Math.PI,
  // Logaritmos naturales
  'ln2': Math.LN2,
  'ln10': Math.LN10,
  // Raíces cuadradas comunes
  '√2': Math.sqrt(2),
  '√3': Math.sqrt(3),
  '√5': Math.sqrt(5),
  '√7': Math.sqrt(7),
  '√8': Math.sqrt(8),
  '√10': Math.sqrt(10),
  '√11': Math.sqrt(11),
  '√12': Math.sqrt(12),
  '√13': Math.sqrt(13),
  '√15': Math.sqrt(15),
  '√17': Math.sqrt(17),
  '√19': Math.sqrt(19),
  '√20': Math.sqrt(20),
  // Raíces cuadradas negativas
  '-√2': -Math.sqrt(2),
  '-√3': -Math.sqrt(3),
  '-√5': -Math.sqrt(5)
};

/* =========== FUNCIÓN PARA CONVERTIR TEXTO EN NÚMERO =========== */
function parseNumber(input) {
  input = input.trim().replace(/\s+/g, '');

  if (CONSTANTS.hasOwnProperty(input)) {
    return CONSTANTS[input];
  }

  let processedInput = input;
  for (const [symbol, value] of Object.entries(CONSTANTS)) {
    const regex = new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processedInput = processedInput.replace(regex, value.toString());
  }

  if (input.includes('/') && !input.includes('*') && !input.includes('+') && !input.includes('-', 1)) {
    const parts = input.split('/');
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
  }

  if (input.startsWith('√') && !input.includes('*') && !input.includes('+') && !input.includes('-', 1)) {
    const radicand = parseFloat(input.slice(1));
    if (!isNaN(radicand) && radicand >= 0) {
      return Math.sqrt(radicand);
    }
  }

  if (input.startsWith('-√') && !input.includes('*') && !input.includes('+')) {
    const radicand = parseFloat(input.slice(2));
    if (!isNaN(radicand) && radicand >= 0) {
      return -Math.sqrt(radicand);
    }
  }

  if (input.includes('sqrt(')) {
    const match = input.match(/sqrt\(([^)]+)\)/);
    if (match) {
      const innerExpression = match[1];
      let innerValue;
      try {
        if (innerExpression.includes('/')) {
          const parts = innerExpression.split('/');
          if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
              innerValue = num / den;
            }
          }
        } else {
          const safeChars = /^[0-9+\-*/.() ]+$/;
          if (safeChars.test(innerExpression)) {
            innerValue = Function('"use strict"; return (' + innerExpression + ')')();
          } else {
            innerValue = parseFloat(innerExpression);
          }
        }
        if (!isNaN(innerValue) && innerValue >= 0) {
          return Math.sqrt(innerValue);
        }
      } catch (e) {}
    }
  }

  try {
    processedInput = processedInput.replace(/\^/g, '**');
    const safeChars = /^[0-9+\-*/.() ]+$/;
    if (safeChars.test(processedInput)) {
      const result = Function('"use strict"; return (' + processedInput + ')')();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
    }
  } catch (e) {}

  const num = parseFloat(processedInput);
  if (!isNaN(num)) {
    return num;
  }

  return null;
}

/* ==================== FUNCIONES DE CLASIFICACIÓN ==================== */
function classifyNumber(num, originalInput) {
  if (num > 0 && Number.isInteger(num)) {
    return 'naturals';
  }

  if (Number.isInteger(num)) {
    return 'integers';
  }

  const irrationalConstants = [
    'π', 'pi', 'e', 'φ', 'phi', 'τ', 'tau', 'ln2', 'ln10',
    '√2', '√3', '√5', '√7', '√8', '√10', '√11',
    '√12', '√13', '√15', '√17', '√19', '√20',
    '-√2', '-√3', '-√5'
  ];

  if (irrationalConstants.includes(originalInput)) {
    return 'irrationals';
  }

  if (originalInput.includes('sqrt(')) {
    const sqrtMatch = originalInput.match(/sqrt\(([^)]+)\)/);
    if (sqrtMatch) {
      const innerExpression = sqrtMatch[1];
      let innerValue;
      try {
        if (innerExpression.includes('/')) {
          const parts = innerExpression.split('/');
          if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
              innerValue = num / den;
            }
          }
        } else {
          innerValue = parseFloat(innerExpression);
        }
        if (!isNaN(innerValue) && innerValue >= 0) {
          const sqrtResult = Math.sqrt(innerValue);
          if (Number.isInteger(sqrtResult)) {
            if (sqrtResult > 0) {
              return 'naturals';
            } else if (sqrtResult === 0) {
              return 'integers';
            }
          } else {
            return 'irrationals';
          }
        }
      } catch (e) {
        return 'irrationals';
      }
    }
  }

  if (originalInput.includes('√')) {
    return 'irrationals';
  }

  if (originalInput.includes('*') || originalInput.includes('+') || originalInput.includes('-') || originalInput.includes('/')) {
    const irrationalSymbols = ['π', 'pi', 'e', 'φ', 'phi', 'τ', 'tau', '√', 'sqrt'];
    const containsIrrationals = irrationalSymbols.some(symbol => originalInput.includes(symbol));
    if (containsIrrationals) {
      const specialRationalCases = [
        /π\/π/, /pi\/pi/, /e\/e/, /φ\/φ/, /phi\/phi/, /τ\/τ/, /tau\/tau/, /√2\/√2/, /√3\/√3/, /√5\/√5/,
        /π-π/, /pi-pi/, /e-e/, /φ-φ/, /phi-phi/,
        /2\*π\/τ/, /τ\/2\*π/
      ];
      const isSpecialRational = specialRationalCases.some(pattern => pattern.test(originalInput.replace(/\s/g, '')));
      if (isSpecialRational) {
        if (num > 0 && Number.isInteger(num)) {
          return 'naturals';
        }
        if (Number.isInteger(num)) {
          return 'integers';
        }
        return 'rationals';
      }
      return 'irrationals';
    }
  }

  if (originalInput.includes('/')) {
    return 'rationals';
  }

  return 'rationals';
}

function getClassificationName(classification) {
  const names = {
    'naturals': 'ℕ (Naturales)',
    'integers': 'ℤ (Enteros)',
    'rationals': 'ℚ (Racionales)',
    'irrationals': 'ℝ-ℚ (Irracionales)'
  };
  return names[classification] || 'No clasificado';
}

/* ==================== FUNCIONES DE INTERFAZ DE USUARIO ==================== */
function addNumber() {
  const input = document.getElementById('numberInput').value;
  if (!input) {
    alert('Por favor ingresa un número.');
    return;
  }
  const value = parseNumber(input);
  if (value === null) {
    alert('Formato de número no válido. Ejemplos válidos: sqrt(7), 2*π, 1/e, √2, -1/2, φ');
    return;
  }
  if (Math.abs(value) > currentRange) {
    alert(`El número está fuera del rango actual (-${currentRange} a ${currentRange}).`);
    return;
  }
  const existingPoint = points.find(p => Math.abs(p.value - value) < 0.0001);
  if (existingPoint) {
    alert('Este número ya ha sido agregado.');
    return;
  }

  const classification = classifyNumber(value, input);

  const point = {
    id: Date.now(),
    value: value,
    label: input,
    classification: classification
  };

  points.push(point);
  points.sort((a, b) => a.value - b.value);

  updateDisplay();
  document.getElementById('numberInput').value = '';
}

function addPresetNumber(input) {
  document.getElementById('numberInput').value = input;
  addNumber();
}

function updateDisplay() {
  renderNumberLine();
  renderPointsList();
  updateDistanceCalculators();
}

function renderNumberLine() {
  const numberLine = document.getElementById('numberLine');
  numberLine.innerHTML = '<div class="line"></div>';

  const range = 20; // -10 a 10
  const centerOffset = range / 2;

  for (let i = -10; i <= 10; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick';
    const position = ((i + centerOffset) / range) * 100;
    tick.style.left = `${position}%`;
    numberLine.appendChild(tick);

    if (i % 2 === 0) {
      const label = document.createElement('span');
      label.className = 'tick-label';
      label.textContent = i;
      label.style.left = `${position}%`;
      numberLine.appendChild(label);
    }
  }

  points.forEach(point => {
    if (Math.abs(point.value) <= currentRange) {
      const pointElement = document.createElement('div');
      pointElement.className = `number-point ${point.classification}`;
      const position = ((point.value + centerOffset) / range) * 100;
      pointElement.style.left = `${position}%`;
      pointElement.dataset.id = point.id;
      pointElement.dataset.value = point.value;
      pointElement.dataset.label = point.label;
      pointElement.title = `${point.label} (${point.value.toFixed(4)}) - ${getClassificationName(point.classification)}`;
      numberLine.appendChild(pointElement);

      const labelElement = document.createElement('span');
      labelElement.className = 'point-label';
      labelElement.textContent = point.label;
      labelElement.style.left = `${position}%`;
      numberLine.appendChild(labelElement);
    }
  });
}

function renderPointsList() {
  const pointsList = document.getElementById('pointsList');
  pointsList.innerHTML = '';
  if (points.length === 0) {
    pointsList.innerHTML = `
      <div class="empty-state">
        <p>Agrega números para ver su clasificación automática aquí</p>
        <small>Los puntos aparecerán ordenados de menor a mayor</small>
      </div>`;
    return;
  }

  points.forEach(point => {
    const listItem = document.createElement('div');
    listItem.className = `point-item`;
    listItem.innerHTML = `
      <span><strong>${point.label}</strong> (≈ ${point.value.toFixed(4)})</span>
      <span class="classification-tag ${point.classification}">${getClassificationName(point.classification)}</span>
    `;
    pointsList.appendChild(listItem);
  });
}

function updateDistanceCalculators() {
  const selectA = document.getElementById('pointA-items');
  const selectB = document.getElementById('pointB-items');
  const selectedA = document.getElementById('pointA-selected');
  const selectedB = document.getElementById('pointB-selected');

  selectA.innerHTML = '<div data-value="">Selecciona un punto</div>';
  selectB.innerHTML = '<div data-value="">Selecciona un punto</div>';
  selectedA.textContent = 'Selecciona un punto';
  selectedB.textContent = 'Selecciona un punto';
  selectedA.dataset.value = '';
  selectedB.dataset.value = '';

  points.forEach(point => {
    const optionA = document.createElement('div');
    optionA.dataset.value = point.value;
    optionA.textContent = `${point.label} (≈ ${point.value.toFixed(2)})`;
    selectA.appendChild(optionA);

    const optionB = document.createElement('div');
    optionB.dataset.value = point.value;
    optionB.textContent = `${point.label} (≈ ${point.value.toFixed(2)})`;
    selectB.appendChild(optionB);
  });
}

function calculateDistance() {
  const pointASelected = document.getElementById('pointA-selected');
  const pointBSelected = document.getElementById('pointB-selected');
  const valA = parseFloat(pointASelected.dataset.value);
  const valB = parseFloat(pointBSelected.dataset.value);
  const resultDiv = document.getElementById('distanceResult');

  if (isNaN(valA) || isNaN(valB)) {
    alert('Por favor selecciona dos puntos válidos.');
    return;
  }

  const distance = Math.abs(valA - valB);

  const labelA = points.find(p => Math.abs(p.value - valA) < 0.0001)?.label || valA.toFixed(2);
  const labelB = points.find(p => Math.abs(p.value - valB) < 0.0001)?.label || valB.toFixed(2);

  resultDiv.innerHTML = `
    <div class="distance-result">
      <div><strong>Distancia entre:</strong> |${labelA} - ${labelB}|</div>
      <div><strong>Valores:</strong> |${valA.toFixed(4)} - ${valB.toFixed(4)}|</div>
      <div><strong>Resultado:</strong> ${distance.toFixed(4)}</div>
    </div>
  `;
}

function clearAll() {
  points = [];
  document.getElementById('numberInput').value = '';
  updateDisplay();
  document.getElementById('distanceResult').innerHTML = `
    <div class="distance-placeholder">
      <div><strong>Calculadora de Distancias</strong></div>
      <div>Los resultados aparecerán aquí</div>
    </div>
  `;
}

// Configuración de los menús desplegables personalizados
function setupCustomSelects() {
  document.querySelectorAll('.custom-select').forEach(container => {
    const selected = container.querySelector('.select-selected');
    const items = container.querySelector('.select-items');
    const inputElement = container.id === 'pointA-container'
      ? document.getElementById('pointA-selected')
      : document.getElementById('pointB-selected');

    selected.addEventListener('click', function(e) {
      e.stopPropagation();
      document.querySelectorAll('.select-items.show').forEach(item => {
        if (item !== items) {
          item.classList.remove('show');
        }
      });
      items.classList.toggle('show');
    });

    items.addEventListener('click', function(e) {
      if (e.target.tagName === 'DIV' && e.target.dataset.value !== undefined) {
        const value = e.target.dataset.value;
        inputElement.textContent = e.target.textContent;
        inputElement.dataset.value = value;
        items.classList.remove('show');
      }
    });
  });

  window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
      document.querySelectorAll('.select-items').forEach(item => {
        item.classList.remove('show');
      });
    }
  });
}

// Inicializar
setupCustomSelects();
updateDisplay();
