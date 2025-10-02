# 🥗 Smart Meal - Meal Planner & Grocery Helper

> Inteligentny planer posiłków z automatyczną listą zakupów i śledzeniem wagi

[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?logo=angular)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20.2-007ACC)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**🚀 Demo na żywo**: [smart-meal-five.vercel.app](https://smart-meal-five.vercel.app/planner)

---

## 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcjonalności](#-funkcjonalności)
- [Stack technologiczny](#-stack-technologiczny)
- [Architektura](#-architektura)
- [Instalacja](#-instalacja)
- [Użycie](#-użycie)
- [Screenshoty](#-screenshoty)
- [Planowane ulepszenia](#-planowane-ulepszenia)
- [Wnioski](#-wnioski)
- [Licencja](#-licencja)

---

## 🎯 O projekcie

**SmartMeal** to kompleksowa aplikacja do planowania posiłków zbudowana w Angular 20+ z wykorzystaniem PrimeNG. Aplikacja umożliwia:

- Planowanie posiłków na cały tydzień
- Automatyczne generowanie listy zakupów
- Śledzenie wagi i postępów
- Przeglądanie statystyk żywieniowych
- Zarządzanie bazą przepisów

Projekt został stworzony jako demonstracja nowoczesnych wzorców w Angular, wykorzystując **standalone components** i **signals** do reaktywnego zarządzania stanem.

---

## ✨ Funkcjonalności

### 📅 Planer Posiłków
- Planowanie śniadań, lunchu, obiadów i przekąsek na cały tydzień
- Nawigacja po tygodniach (poprzedni/następny/bieżący)
- Wizualizacja dziennej i tygodniowej liczby kalorii
- Możliwość usuwania i zamiany posiłków

### 📖 Biblioteka Przepisów
- 6 przykładowych przepisów z pełnymi informacjami
- Filtrowanie po typie posiłku (śniadanie, lunch, obiad, przekąska)
- Filtrowanie po tagach dietetycznych (wegetariańskie, wegańskie, bezglutenowe, bez laktozy)
- Szczegółowy widok przepisu z krokami przygotowania

### 🛒 Lista Zakupów
- Automatyczne agregowanie składników z zaplanowanych posiłków
- Grupowanie po kategoriach (białko, warzywa, owoce, zboża, nabiał)
- Zaznaczanie zakupionych produktów
- Podsumowanie: wszystkie produkty / do kupienia / kupione

### ⚖️ Śledzenie Wagi
- Dodawanie pomiarów wagi z datą i notatkami
- Obliczanie zmiany wagi (kg i %)
- Historia pomiarów w tabeli
- Statystyki: aktualna waga, zmiana, liczba pomiarów

### 📊 Statystyki
- Wykresy kalorii na każdy dzień tygodnia
- Wykres kołowy makroskładników (białko, węglowodany, tłuszcze)
- Wykres liniowy historii wagi
- Karty statystyk: zaplanowane posiłki, średnie kalorie, pomiary wagi

### 🌓 System Motywów
- Tryb ciemny i jasny
- Przełączanie za pomocą jednego przycisku
- Zapisywanie preferencji w localStorage
- Płynne przejścia między motywami

---

## 🛠️ Stack technologiczny

### Frontend
- **Framework**: Angular 20.3
- **UI Library**: PrimeNG 20.2 + PrimeIcons
- **Język**: TypeScript 5.9 (strict mode)
- **Wykresy**: Chart.js 4.5 (przez PrimeNG)
- **Stylowanie**: Custom CSS z CSS Variables
- **Ikony**: PrimeIcons 7.0

### Narzędzia deweloperskie
- **Build Tool**: Angular CLI 20.3
- **Bundler**: esbuild (Angular 20+)
- **Linter**: ESLint (konfiguracja Angular)
- **Formatter**: Prettier
- **Testing**: Jasmine + Karma
- **Deployment**: Vercel

### Wzorce i praktyki
- ✅ Standalone Components (bez NgModules)
- ✅ Signals dla reaktywnego stanu
- ✅ Lazy Loading tras
- ✅ Service Layer
- ✅ TypeScript Strict Mode
- ✅ Computed signals dla pochodnych wartości
- ✅ LocalStorage dla persystencji danych

---

## 🏗️ Architektura

### Struktura projektu (obecna)

```
src/app/
├── core/
│   ├── models/           # Modele danych (Recipe, MealPlan, Weight)
│   └── services/         # Serwisy biznesowe (6 serwisów)
├── features/             # Moduły funkcjonalne (6 komponentów)
│   ├── meal-planner/
│   ├── recipes/
│   ├── shopping-list/
│   ├── weight-tracker/
│   └── statistics/
├── shared/
│   └── components/       # Komponenty współdzielone (RecipeCard)
├── data/
│   └── recipes.data.ts   # Dane testowe
├── app.component.ts      # Główny komponent aplikacji
├── app.routes.ts         # Konfiguracja routingu
└── app.config.ts         # Konfiguracja aplikacji
```

### Kluczowe serwisy

#### MealPlannerService
- Zarządzanie tygodniowymi planami posiłków
- Nawigacja między tygodniami
- Obliczanie wartości odżywczych
- Persystencja w localStorage

#### RecipeService
- Zarządzanie bazą przepisów
- Filtrowanie i wyszukiwanie
- Reactive state z computed signals

#### ShoppingListService
- Automatyczne agregowanie składników
- Grupowanie po kategoriach
- Zarządzanie statusem zakupów

#### WeightTrackerService
- Śledzenie pomiarów wagi
- Obliczanie zmian i trendów
- Historia pomiarów

#### ThemeService
- Przełączanie między trybami
- Zapisywanie preferencji
- Synchronizacja z DOM

---

## 💻 Instalacja

### Wymagania
- Node.js 18+ lub 20+
- npm 9+ lub yarn

### Kroki instalacji

```bash
# Sklonuj repozytorium
git clone https://github.com/yourusername/smart-meal.git
cd smart-meal

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm start

# Aplikacja dostępna pod: http://localhost:4200
```

### Dostępne komendy

```bash
# Uruchom dev server
npm start

# Zbuduj wersję produkcyjną
npm run build

# Uruchom testy jednostkowe
npm test

# Uruchom linter
ng lint

# Format kodu
npx prettier --write .
```

---

## 📖 Użycie

### 1. Planowanie posiłków

```typescript
// Nawiguj do /planner
// 1. Wybierz dzień i typ posiłku (np. Poniedziałek - Śniadanie)
// 2. Kliknij "Dodaj posiłek"
// 3. Wybierz przepis z biblioteki
// 4. Posiłek zostanie dodany do planu
```

### 2. Przeglądanie listy zakupów

```typescript
// Nawiguj do /shopping
// Lista automatycznie zawiera składniki z zaplanowanych posiłków
// Zaznacz kupione produkty
```

### 3. Śledzenie wagi

```typescript
// Nawiguj do /weight
// Dodaj pomiar wagi:
weightService.addEntry(75.5, new Date(), 'Po treningu');
```

### 4. Analiza statystyk

```typescript
// Nawiguj do /stats
// Zobacz wykresy kalorii, makroskładników i historii wagi
```
---

## 🚀 Planowane ulepszenia

### 1. Struktura plików i organizacja

**Problem**: Płaska struktura w niektórych obszarach

**Proponowana struktura**:
```
src/app/
├── core/
│   ├── models/
│   ├── services/
│   ├── guards/
│   ├── interceptors/
│   └── utils/
├── shared/
│   ├── components/
│   │   ├── ui/           # Komponenty UI wielokrotnego użytku
│   │   ├── forms/        # Komponenty formularzy
│   │   └── layout/       # Komponenty układu
│   ├── directives/
│   ├── pipes/
│   └── validators/
├── features/
│   ├── meal-planner/
│   │   ├── components/
│   │   │   ├── meal-planner.component.ts
│   │   │   ├── day-card/
│   │   │   ├── meal-slot/
│   │   │   └── week-navigation/
│   │   ├── services/
│   │   └── models/
│   └── [pozostałe moduły...]
└── data/
    └── constants/
```

### 2. Architektura Grid i Stylów

**Problemy**:
- Style grid inline w szablonach
- Powtarzające się wzorce CSS
- Duplikacja media queries

**Ulepszenia**:

```css
/* Tworzenie klas narzędziowych */
.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-4);
}

.grid-responsive-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

/* System breakpointów responsywnych */
@custom-media --mobile (max-width: 640px);
@custom-media --tablet (max-width: 1024px);
@custom-media --desktop (min-width: 1025px);

/* Skala odstępów */
:root {
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
}
```

**System modułów SCSS**:
```scss
styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
├── layout/
│   ├── _grid.scss
│   └── _containers.scss
└── themes/
    ├── _dark.scss
    └── _light.scss
```

### 3. Modularność komponentów

**Problemy**:
- Duże pliki komponentów (np. `meal-planner.component.ts` - 300+ linii)
- Mieszane odpowiedzialności
- Ograniczona możliwość ponownego użycia

**Proponowana refaktoryzacja**:

```typescript
// Podział meal-planner na mniejsze komponenty

// week-navigation.component.ts
@Component({
  selector: 'app-week-navigation',
  template: `...`,
  standalone: true
})
export class WeekNavigationComponent {
  @Output() previousWeek = new EventEmitter<void>();
  @Output() nextWeek = new EventEmitter<void>();
  @Output() currentWeek = new EventEmitter<void>();
  @Input() weekRange!: string;
}

// day-card.component.ts
@Component({
  selector: 'app-day-card',
  template: `...`,
  standalone: true
})
export class DayCardComponent {
  @Input() day!: DayOfWeek;
  @Input() dayPlan!: DayPlan;
  @Output() mealAdded = new EventEmitter<MealEvent>();
  @Output() mealRemoved = new EventEmitter<MealEvent>();
}

// meal-slot.component.ts
@Component({
  selector: 'app-meal-slot',
  template: `...`,
  standalone: true
})
export class MealSlotComponent {
  @Input() mealType!: MealType;
  @Input() recipe?: Recipe;
  @Output() addMeal = new EventEmitter<void>();
  @Output() removeMeal = new EventEmitter<void>();
}
```

### 4. Dodatkowe ulepszenia architektoniczne

#### A. Ulepszone zarządzanie stanem

```typescript
// Rozważenie Signals Store lub NgRx SignalStore
import { signalStore, withState, withMethods } from '@ngrx/signals';

export const MealPlanStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    addMeal: (day: DayOfWeek, mealType: MealType, recipeId: string) => {
      // Niezmienne aktualizacje stanu z computed selectors
    }
  }))
);
```

#### B. Wzorzec Smart/Presentation Component

```typescript
// Smart (Container) Component
@Component({
  selector: 'app-meal-planner-container',
  template: `
    <app-meal-planner-presentation
      [weekPlan]="weekPlan()"
      [recipes]="recipes()"
      (mealAdded)="onMealAdded($event)"
      (mealRemoved)="onMealRemoved($event)">
    </app-meal-planner-presentation>
  `
})
export class MealPlannerContainerComponent {
  // Logika i serwisy
}

// Presentation (Dumb) Component
@Component({
  selector: 'app-meal-planner-presentation',
  // Czysty UI z Inputs/Outputs
})
export class MealPlannerPresentationComponent {
  @Input() weekPlan!: WeekPlan;
  @Output() mealAdded = new EventEmitter();
}
```

#### C. Infrastruktura testów

```typescript
// Dodanie kompleksowych testów
describe('MealPlannerService', () => {
  it('powinien dodać posiłek do odpowiedniego dnia i slotu', () => {
    // Testy jednostkowe z TestBed
  });
});

describe('MealPlannerComponent', () => {
  it('powinien wyświetlić 7 kart dni', () => {
    // Testy komponentów z harnesses
  });
});
```

#### D. Optymalizacje wydajności

```typescript
// Virtual scrolling dla dużych list
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Funkcje TrackBy
trackByRecipeId(index: number, recipe: Recipe) {
  return recipe.id;
}
```

#### E. Dostępność (a11y)

```html
<!-- Dodanie etykiet ARIA i nawigacji klawiaturą -->
<button 
  aria-label="Dodaj posiłek do poniedziałkowego śniadania"
  (click)="addMeal()"
  (keydown.enter)="addMeal()">
</button>

<!-- Zarządzanie focusem -->
<app-meal-dialog [trapFocus]="true">
```

### 5. Rozszerzenia funkcjonalności

- **🔐 Integracja z backendem**: Zastąpienie LocalStorage przez REST API
- **👤 Uwierzytelnianie**: Wsparcie wielu użytkowników z Auth0/Firebase
- **🔄 Szablony posiłków**: Zapisywanie i ponowne używanie tygodniowych planów
- **🍽️ Własne przepisy**: CRUD dla przepisów tworzonych przez użytkownika
- **📱 PWA**: Wsparcie offline i możliwość instalacji
- **📧 Wysyłanie list zakupów**: Wysyłka list mailem
- **📊 Zaawansowana analityka**: Trendy żywieniowe, wskaźniki różnorodności
- **🔔 Powiadomienia**: Przypomnienia o przygotowaniu posiłków
- **🌐 i18n**: Wsparcie wielu języków (obecnie tylko polski)
- **🎨 Zdjęcia przepisów**: Upload własnych zdjęć
- **📤 Export/Import**: Przenoszenie danych (JSON/CSV)

---

## 📊 Metryki jakości kodu

| Metryka | Obecnie | Cel |
|---------|---------|-----|
| Rozmiar komponentu | 100-400 linii | <150 linii |
| Pokrycie testami | 0% | >80% |
| Rozmiar bundla | ~500KB | <400KB |
| Wynik Lighthouse | ? | >90 |

---

## 🎓 Wnioski

### Co działa dobrze

1. **Signals są potężne**: Nowoczesny reaktywny stan jest czystszy niż RxJS w prostych przypadkach
2. **Theming PrimeNG**: CSS variables sprawiają, że motywowanie jest proste
3. **Standalone components**: Brak NgModules upraszcza architekturę
4. **Type safety**: Strict TypeScript wychwytuje błędy wcześnie
5. **LocalStorage**: Prosta persystencja działa dobrze dla MVP

### Czego się nauczyliśmy

1. **Wcześniejszy refactoring**: Podział komponentów zapobiega powstawaniu dużych plików
2. **Systematyczne stylowanie**: Utility classes i design tokens od początku
3. **Testy od początku**: TDD pomaga w architekturze
4. **Feature-based structure**: Łatwiejsza nawigacja i skalowanie

### Co można było zrobić lepiej

1. **Modularność**: Mniejsze, bardziej skoncentrowane komponenty od początku
2. **Testowanie**: Brak testów utrudnia refactoring
3. **Dokumentacja**: Więcej komentarzy w kodzie i README od startu
4. **Accessibility**: Rozważenie a11y od początku projektu

---

## 🤝 Wkład w projekt

Zapraszamy do zgłaszania:
- 🐛 Błędów (Issues)
- 💡 Propozycji funkcjonalności (Feature Requests)
- 🔧 Pull Requestów

### Proces PR

1. Fork repozytorium
2. Utwórz branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

---

## 👨‍💻 Autor

**Twoje Imię**
- GitHub: [@FrontJSack](https://github.com/FrontJSack)
- LinkedIn: [Jacek Leszczyński](https://www.linkedin.com/in/jacek-leszczynskidev/)

---

## 🙏 Podziękowania

- [Angular Team](https://angular.io/) za wspaniały framework
- [PrimeNG](https://primeng.org/) za bibliotekę komponentów UI
- [Chart.js](https://www.chartjs.org/) za wykresy
- Społeczność open source za inspirację

---

## 📚 Dodatkowe zasoby

- [Angular Documentation](https://angular.dev)
- [PrimeNG Documentation](https://primeng.org/installation)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**⭐ Jeśli projekt Ci się podoba, zostaw gwiazdkę na GitHubie!**

---

<div align="center">
  <sub>Zbudowane z ❤️ używając Angular i PrimeNG</sub>
</div>
