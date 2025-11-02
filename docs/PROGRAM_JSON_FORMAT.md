# Training Program JSON Format

## 📋 Overview

The `program` field in the Training model stores the curriculum as a JSON string. This allows for rich, structured program data that the ProgramAccordion component can display beautifully.

---

## 📝 JSON Structure

### Complete Example

```json
[
  {
    "title": "Introduction à la gestion de projet",
    "duration": "2 heures",
    "description": "Découvrez les bases de la gestion de projet et les concepts fondamentaux",
    "lessons": [
      {
        "title": "Qu'est-ce qu'un projet ?",
        "duration": "30min",
        "type": "video",
        "isFree": true
      },
      {
        "title": "Les phases d'un projet",
        "duration": "45min",
        "type": "video"
      },
      {
        "title": "Quiz d'évaluation",
        "duration": "15min",
        "type": "quiz"
      }
    ],
    "objectives": [
      "Comprendre la définition d'un projet",
      "Identifier les différentes phases",
      "Maîtriser le vocabulaire de base"
    ]
  },
  {
    "title": "Planification et organisation",
    "duration": "3 heures",
    "description": "Apprenez à planifier et organiser efficacement vos projets",
    "lessons": [
      {
        "title": "Définir les objectifs SMART",
        "duration": "40min",
        "type": "video"
      },
      {
        "title": "Créer un planning avec MS Project",
        "duration": "1h20min",
        "type": "video"
      },
      {
        "title": "Exercice pratique",
        "duration": "1h",
        "type": "document"
      }
    ],
    "objectives": [
      "Définir des objectifs SMART",
      "Utiliser MS Project",
      "Créer un planning réaliste"
    ]
  },
  {
    "title": "Gestion des risques",
    "duration": "2.5 heures",
    "description": "Identifiez et gérez les risques de vos projets",
    "lessons": [
      {
        "title": "Identifier les risques",
        "duration": "45min",
        "type": "video"
      },
      {
        "title": "Matrice des risques",
        "duration": "30min",
        "type": "video"
      },
      {
        "title": "Plan de mitigation",
        "duration": "45min",
        "type": "video"
      },
      {
        "title": "Cas pratique",
        "duration": "30min",
        "type": "quiz"
      }
    ],
    "objectives": [
      "Identifier les risques potentiels",
      "Évaluer l'impact des risques",
      "Créer un plan de mitigation"
    ]
  }
]
```

---

## 📐 Field Definitions

### Module Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Module title |
| `duration` | string | ✅ Yes | Total duration (e.g., "2 heures", "3h30") |
| `description` | string | ❌ No | Module description |
| `lessons` | array | ❌ No | Array of lesson objects |
| `objectives` | array | ❌ No | Array of learning objectives (strings) |

### Lesson Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Lesson title |
| `duration` | string | ❌ No | Lesson duration (e.g., "30min", "1h20") |
| `type` | string | ❌ No | Lesson type: "video", "quiz", "document" |
| `isFree` | boolean | ❌ No | If true, shows "Aperçu gratuit" badge |

---

## 🎨 How It Displays

### ProgramAccordion Component

The component renders:
- ✅ Module number badge
- ✅ Module title and duration
- ✅ Lesson count
- ✅ Expandable/collapsible sections
- ✅ Lesson icons based on type:
  - 🎥 Video → PlayCircle icon
  - ✅ Quiz → CheckCircle icon
  - 📄 Document → FileText icon
- ✅ "Aperçu gratuit" badge for free lessons
- ✅ Module objectives list

---

## 💾 How to Store in Database

### When Creating/Editing a Training

```javascript
// In your admin form or API endpoint
const programData = [
  {
    title: "Module 1",
    duration: "2 heures",
    description: "Description du module",
    lessons: [
      { title: "Leçon 1", duration: "30min", type: "video" }
    ],
    objectives: ["Objectif 1", "Objectif 2"]
  }
];

// Convert to JSON string before saving
const training = await prisma.training.create({
  data: {
    title: "Formation en gestion de projet",
    // ... other fields
    program: JSON.stringify(programData), // ← Store as JSON string
    // ... other fields
  }
});
```

### When Reading from Database

The ProgramAccordion component automatically handles parsing:

```javascript
// In ProgramAccordion.jsx (already implemented)
const parsedProgram = typeof program === 'string' 
  ? JSON.parse(program)  // Parse if string
  : program;             // Use as-is if already object
```

---

## 🔧 Admin Interface Recommendations

### Option 1: JSON Editor
```jsx
<textarea
  value={programJSON}
  onChange={(e) => setProgramJSON(e.target.value)}
  placeholder="Paste JSON program here"
  rows={20}
/>
```

### Option 2: Form Builder (Better UX)
```jsx
<div>
  {modules.map((module, index) => (
    <div key={index}>
      <input value={module.title} onChange={...} />
      <input value={module.duration} onChange={...} />
      
      {module.lessons.map((lesson, i) => (
        <div key={i}>
          <input value={lesson.title} onChange={...} />
          <select value={lesson.type} onChange={...}>
            <option value="video">Vidéo</option>
            <option value="quiz">Quiz</option>
            <option value="document">Document</option>
          </select>
        </div>
      ))}
      
      <button onClick={() => addLesson(index)}>
        Ajouter une leçon
      </button>
    </div>
  ))}
  
  <button onClick={addModule}>
    Ajouter un module
  </button>
</div>
```

---

## ✅ Validation Rules

### Required Fields
- Each module MUST have `title` and `duration`
- Each lesson MUST have `title`

### Recommended
- Include at least 3-5 modules per training
- Each module should have 3-6 lessons
- Add objectives for better learning outcomes
- Mark at least one lesson as `isFree` for preview

### Duration Format
- Use French format: "30min", "1h", "2h30", "3 heures"
- Be consistent within the same training

---

## 📊 Example Programs by Category

### Management de Projet
```json
[
  {
    "title": "Fondamentaux de la gestion de projet",
    "duration": "4 heures",
    "lessons": [...]
  },
  {
    "title": "Outils et méthodologies",
    "duration": "6 heures",
    "lessons": [...]
  }
]
```

### Banque et Finance
```json
[
  {
    "title": "Introduction à l'analyse financière",
    "duration": "3 heures",
    "lessons": [...]
  },
  {
    "title": "Ratios et indicateurs",
    "duration": "4 heures",
    "lessons": [...]
  }
]
```

---

## 🚀 Quick Start

### 1. Copy the JSON template above
### 2. Modify titles, durations, and lessons
### 3. Validate JSON (use jsonlint.com)
### 4. Save to database as string: `JSON.stringify(program)`
### 5. The ProgramAccordion will display it beautifully!

---

## 🐛 Troubleshooting

### "Programme détaillé à venir" shows
- Check if `program` field is null or empty
- Verify JSON is valid
- Ensure it's stored as a string in DB

### Accordion doesn't expand
- Check browser console for errors
- Verify JSON structure matches schema
- Ensure all required fields are present

### Icons don't show
- Check `type` field values: "video", "quiz", or "document"
- Case-sensitive: use lowercase

---

*Last updated: November 1, 2025*
