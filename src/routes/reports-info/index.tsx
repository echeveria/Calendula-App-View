import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="prose max-w-none">
        <h1 class="text-3xl font-bold mb-6">Отчети и рапорти</h1>

        <div class="bg-base-200 p-6 rounded-lg mb-8">
          <p class="text-lg">
            Модулът за отчети и рапорти предоставя подробна информация за извършените дейности, използваните материали и графика на посещенията.
            Той ви позволява да следите прогреса на работата и да анализирате ефективността на вашите процеси.
          </p>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Основни функционалности</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Подробни рапорти за дейностите</h3>
              <p>
                Получавайте детайлни отчети за всички извършени дейности по обектите, включително информация за времето, изпълнителите и използваните материали.
              </p>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Статистика за изпълнението</h3>
              <p>
                Анализирайте ефективността на работата чрез различни статистически показатели, графики и диаграми, показващи тенденции и модели.
              </p>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Формат за принтиране</h3>
              <p>
                Експортирайте отчетите в различни формати, подходящи за принтиране или споделяне с клиенти и партньори.
              </p>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Персонализирани отчети</h3>
              <p>
                Създавайте персонализирани отчети според вашите нужди, избирайки периоди, обекти и типове дейности, които искате да включите.
              </p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Как да използвате отчетите</h2>

        <div class="steps steps-vertical lg:steps-horizontal w-full mb-8">
          <div class="step step-primary">
            <div class="mt-4">
              <h3 class="font-bold">Стъпка 1</h3>
              <p class="text-sm md:text-base">Влезте в системата с вашия акаунт</p>
            </div>
          </div>
          <div class="step step-primary">
            <div class="mt-4">
              <h3 class="font-bold">Стъпка 2</h3>
              <p class="text-sm md:text-base">Отидете на страницата "Рапорти" от главното меню</p>
            </div>
          </div>
          <div class="step step-primary">
            <div class="mt-4">
              <h3 class="font-bold">Стъпка 3</h3>
              <p class="text-sm md:text-base">Изберете типа отчет и периода, който ви интересува</p>
            </div>
          </div>
          <div class="step step-primary">
            <div class="mt-4">
              <h3 class="font-bold">Стъпка 4</h3>
              <p class="text-sm md:text-base">Генерирайте отчета и експортирайте го при необходимост</p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Предимства на използването на отчетите</h2>

        <ul class="list-disc list-inside mb-8 space-y-2">
          <li>Подобрена прозрачност на извършените дейности</li>
          <li>По-добро планиране на бъдещи дейности</li>
          <li>Оптимизиране на разходите и ресурсите</li>
          <li>Улеснена комуникация с клиенти и партньори</li>
          <li>Бързо идентифициране на проблеми и възможности за подобрение</li>
        </ul>

        <div class="bg-primary text-primary-content p-6 rounded-lg mb-8">
          <h2 class="text-2xl font-bold mb-4">Готови ли сте да започнете?</h2>
          <p class="mb-4">
            Регистрирайте се сега, за да получите достъп до модула за отчети и рапорти и всички останали функционалности на системата.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="/register" class="btn btn-secondary">
              Регистрирайте се
            </a>
            <a href="/login" class="btn btn-outline btn-secondary">
              Вход
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Отчети и рапорти - Документация | Calendula",
  meta: [
    {
      name: "description",
      content: "Научете как да използвате модула за отчети и рапорти в Calendula за по-ефективно проследяване и анализ на дейностите по поддръжка на вашите обекти.",
    },
  ],
};
