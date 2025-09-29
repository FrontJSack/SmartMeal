# 🥗 Smart Meal Planner & Grocery Helper

Aplikacja webowa (MVP) napisana w **Angular**, która pomaga
użytkownikowi w prosty i intuicyjny sposób planować zdrowe posiłki na
cały tydzień oraz generować automatyczną listę zakupów.

## 🎯 Cel projektu

Celem aplikacji jest ułatwienie zdrowego odżywiania poprzez: -
zmniejszenie stresu związanego z planowaniem posiłków, - wspieranie
regularnych, zbilansowanych posiłków, - oszczędność czasu przy zakupach
dzięki automatycznej liście produktów, - motywowanie użytkownika do
świadomego podejścia do odżywiania i monitorowania postępów zdrowotnych.

## ✨ Funkcjonalności MVP

-   **Planer posiłków na tydzień** -- wybór i zapisywanie posiłków na
    każdy dzień.
-   **Lista zakupów generowana automatycznie** na podstawie wybranego
    planu.
-   **Możliwość oznaczania produktów jako już posiadanych** w domu.
-   **Liczenie kalorii dla każdego przepisu i sumowanie kalorii dla
    całego dnia**.
-   **Śledzenie makroskładników** (białko, węglowodany, cukry, tłuszcze)
    dla posiłków i dni.
-   **Cotygodniowe ważenie użytkownika** -- wybór dnia tygodnia i
    zapisywanie wagi.
-   **Strona statystyk**, na której użytkownik może zobaczyć:
    -   ile posiłków zjadł z pomocą aplikacji,
    -   łączną ilość kalorii, białek, cukrów w wybranym miesiącu lub
        przedziale czasu,
    -   zmianę wagi od początku korzystania z aplikacji
        (utrata/przyrost).

## 🧩 Architektura i komponenty

Projekt oparty o **Angular** i **RxJS** dla zarządzania stanem
aplikacji.

Struktura aplikacji: - `/plan` -- widok planera posiłków (grid
tygodniowy) - `/recipes` -- lista przepisów z możliwością filtrowania -
`/shopping-list` -- automatyczna lista zakupów - `/stats` -- strona
statystyk i postępów użytkownika - `/weight` -- formularz do
cotygodniowego ważenia

Komponenty: - `MealCardComponent` -- prezentacja pojedynczego przepisu z
kalorycznością i makroskładnikami - `MealPlannerComponent` --
zarządzanie planem tygodniowym i sumowanie kalorii -
`ShoppingListComponent` -- lista zakupów z możliwością odhaczania
produktów - `RecipeFilterComponent` -- filtry (wege, szybkie,
bezglutenowe) - `StatsComponent` -- wykresy i statystyki zjedzonych
posiłków, kalorii i zmian wagi - `WeightTrackerComponent` --
wprowadzanie wagi i prezentacja historii

## 🖌️ UX/UI

-   **Przyjazna kolorystyka** inspirowana naturą (pastele, biel, zielone
    akcenty)
-   **Karty przepisów** z nazwą, zdjęciem, czasem przygotowania i
    kalorycznością
-   **Flow w 3 krokach**: wybierz posiłki → zatwierdź plan → pobierz
    listę zakupów
-   **Dashboard postępów** -- widok statystyk z wykresami zmian wagi i
    spożycia kalorii

## 🚀 Technologie

-   **Angular** -- framework frontendowy
-   **RxJS** -- zarządzanie stanem i reakcje asynchroniczne
-   **SCSS / TailwindCSS** -- stylowanie i layout
-   **TypeScript** -- typowanie i bezpieczeństwo kodu
-   **Chart.js lub ngx-charts** -- wizualizacja danych (wykresy w sekcji
    statystyk)

## 🧠 Dlaczego warto?

Projekt pokazuje: - umiejętność zaprojektowania intuicyjnego i
użytecznego interfejsu, - dbałość o UX/UI, - dobrą organizację
komponentów i zarządzania stanem, - czysty i czytelny kod frontendowy, -
umiejętność pracy z danymi i ich wizualizacji.

## 🔮 Możliwe rozszerzenia w przyszłości

-   Logowanie i personalizacja planu.
-   Możliwość dodawania własnych przepisów.
-   Integracja z API sklepów (np. do zamówień online).
-   Sugestie posiłków na podstawie preferencji i historii użytkownika.
-   Cele kaloryczne i powiadomienia przypominające o ważeniu lub
    posiłkach.

------------------------------------------------------------------------

👩‍💻 **Autor:** \[Jacek Leszczyński]\
📅 **Wersja MVP:** 0.1
