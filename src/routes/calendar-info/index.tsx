import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="prose max-w-none">
        <h1 class="text-3xl font-bold mb-6">Календар на задачите</h1>

        <div class="bg-base-200 p-6 rounded-lg mb-8">
          <p class="text-lg">
            Календарът на задачите е мощен инструмент за планиране и проследяване на всички дейности по поддръжка на вашите обекти.
            Той ви позволява да организирате работата си ефективно и да не пропускате важни задачи.
          </p>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Основни функционалности</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Планиране на задачи</h3>
              <p>
                Създавайте и планирайте задачи за всеки от вашите обекти. Задайте дата, час, продължителност и отговорник за всяка задача.
              </p>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Автоматични напомняния</h3>
              <p>
                Получавайте автоматични напомняния за предстоящи задачи, за да не пропуснете важни дейности по поддръжка.
              </p>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Различни изгледи</h3>
              <p>
                Преглеждайте задачите си по дни, седмици или месеци, според вашите нужди. Филтрирайте задачите по статус или тип.
              </p>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Интеграция с отчети</h3>
              <p>
                Задачите от календара автоматично се интегрират с модула за отчети, позволявайки ви да генерирате подробни справки за извършената работа.
              </p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Как да използвате календара</h2>

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
              <p class="text-sm md:text-base">Отидете на страницата "Календар" от главното меню</p>
            </div>
          </div>
          <div class="step step-primary">
            <div class="mt-4">
              <h3 class="font-bold">Стъпка 3</h3>
              <p class="text-sm md:text-base">Кликнете върху дата, за да създадете нова задача</p>
            </div>
          </div>
          <div class="step step-primary">
            <div class="mt-4">
              <h3 class="font-bold">Стъпка 4</h3>
              <p class="text-sm md:text-base">Попълнете детайлите за задачата и запазете</p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-8 mb-4">Предимства на използването на календара</h2>

        <ul class="list-disc list-inside mb-8 space-y-2">
          <li>Подобрена организация на работата</li>
          <li>По-добро планиране на ресурсите</li>
          <li>Намаляване на риска от пропуснати задачи</li>
          <li>Улеснено проследяване на извършените дейности</li>
          <li>Подобрена комуникация между членовете на екипа</li>
        </ul>

        <div class="bg-primary text-primary-content p-6 rounded-lg mb-8">
          <h2 class="text-2xl font-bold mb-4">Готови ли сте да започнете?</h2>
          <p class="mb-4">
            Регистрирайте се сега, за да получите достъп до календара на задачите и всички останали функционалности на системата.
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
  title: "Календар на задачите - Документация | Calendula",
  meta: [
    {
      name: "description",
      content: "Научете как да използвате календара на задачите в Calendula за по-ефективно планиране и проследяване на дейностите по поддръжка на вашите обекти.",
    },
  ],
};
