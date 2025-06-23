import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="min-h-screen">
      {/* Hero Section */}
      <section
        class="hero min-h-[70vh] bg-base-200"
        style="background-image: url('https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center;"
      >
        <div class="hero-overlay bg-opacity-60"></div>
        <div class="hero-content text-center text-neutral-content">
          <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">Calendula</h1>
            <p class="mb-5">
              Професионално озеленяване и поддръжка на частни имоти и паркове. Мониторинг на
              дейностите и управление на задачите.
            </p>
            <a href="/register" class="btn btn-primary">
              Започнете сега
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section class="py-16 bg-base-100">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Нашите услуги</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="card bg-base-200 shadow-xl">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Озеленяване"
                  class="h-48 w-full object-cover"
                />
              </figure>
              <div class="card-body">
                <h3 class="card-title">Озеленяване</h3>
                <p>
                  Професионално озеленяване на частни имоти, градини и паркове. Създаваме красиви и
                  устойчиви зелени пространства.
                </p>
              </div>
            </div>
            <div class="card bg-base-200 shadow-xl">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Поддръжка"
                  class="h-48 w-full object-cover"
                />
              </figure>
              <div class="card-body">
                <h3 class="card-title">Поддръжка</h3>
                <p>
                  Редовна поддръжка на зелени площи, включително косене на трева, подрязване на
                  храсти и дървета, и контрол на плевели.
                </p>
              </div>
            </div>
            <div class="card bg-base-200 shadow-xl">
              <figure>
                <img
                  src="https://images.unsplash.com/photo-1704198983998-b53528d84c59?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Ландшафтен дизайн"
                  class="h-48 w-full object-cover"
                />
              </figure>
              <div class="card-body">
                <h3 class="card-title">Ландшафтен дизайн</h3>
                <p>
                  Проектиране на градини и паркове, съобразени с вашите предпочитания и особеностите
                  на терена.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="py-16 bg-base-200">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Система за управление</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Календар на задачите</h3>
                <p>
                  Нашата система предоставя удобен календар за планиране и проследяване на всички
                  дейности по поддръжка на вашите обекти.
                </p>
                <ul class="list-disc list-inside mt-4">
                  <li>Планиране на задачи</li>
                  <li>Автоматични напомняния</li>
                  <li>Преглед по дни, седмици и месеци</li>
                </ul>
                <div class="card-actions justify-end mt-4">
                  <a href="/calendar" class="btn btn-primary">
                    Научете повече
                  </a>
                </div>
              </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Отчети и рапорти</h3>
                <p>
                  Получавайте подробни отчети за извършените дейности, използваните материали и
                  графин на посещенията.
                </p>
                <ul class="list-disc list-inside mt-4">
                  <li>Подробни рапорти за дейностите</li>
                  <li>Статистика за изпълнението</li>
                  <li>Формат за принтиране</li>
                </ul>
                <div class="card-actions justify-end mt-4">
                  <a href="/reports" class="btn btn-primary">
                    Научете повече
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/*<section class="py-16 bg-base-100">*/}
      {/*  <div class="container mx-auto px-4">*/}
      {/*    <h2 class="text-3xl font-bold text-center mb-12">Какво казват нашите клиенти</h2>*/}
      {/*    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">*/}
      {/*      <div class="card bg-base-200 shadow-xl">*/}
      {/*        <div class="card-body">*/}
      {/*          <div class="flex items-center mb-4">*/}
      {/*            <div class="avatar">*/}
      {/*              <div class="w-12 rounded-full">*/}
      {/*                <img src="https://i.pravatar.cc/150?img=1" alt="Клиент" />*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*            <div class="ml-4">*/}
      {/*              <h3 class="font-bold">Иван Петров</h3>*/}
      {/*              <p class="text-sm">Собственик на вила</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p>*/}
      {/*            "Изключително съм доволен от работата на ДворЧек. Градината ми никога не е*/}
      {/*            изглеждала по-добре, а чрез системата им винаги знам какви дейности са извършени."*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div class="card bg-base-200 shadow-xl">*/}
      {/*        <div class="card-body">*/}
      {/*          <div class="flex items-center mb-4">*/}
      {/*            <div class="avatar">*/}
      {/*              <div class="w-12 rounded-full">*/}
      {/*                <img src="https://i.pravatar.cc/150?img=5" alt="Клиент" />*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*            <div class="ml-4">*/}
      {/*              <h3 class="font-bold">Мария Иванова</h3>*/}
      {/*              <p class="text-sm">Управител на жилищен комплекс</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p>*/}
      {/*            "Системата за мониторинг на ДворЧек значително улесни управлението на зелените*/}
      {/*            площи в нашия комплекс. Препоръчвам ги горещо!"*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div class="card bg-base-200 shadow-xl">*/}
      {/*        <div class="card-body">*/}
      {/*          <div class="flex items-center mb-4">*/}
      {/*            <div class="avatar">*/}
      {/*              <div class="w-12 rounded-full">*/}
      {/*                <img src="https://i.pravatar.cc/150?img=8" alt="Клиент" />*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*            <div class="ml-4">*/}
      {/*              <h3 class="font-bold">Георги Димитров</h3>*/}
      {/*              <p class="text-sm">Собственик на хотел</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p>*/}
      {/*            "Благодарение на ДворЧек, градината на нашия хотел винаги е в перфектно състояние.*/}
      {/*            Календарът на задачите и отчетите са изключително полезни."*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* CTA Section */}
      <section class="py-16 bg-primary text-primary-content">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-6">Готови ли сте да трансформирате вашата градина?</h2>
          <p class="mb-8 max-w-2xl mx-auto">
            Свържете се с нас днес, за да обсъдим как можем да помогнем за озеленяването и
            поддръжката на вашия имот.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/register" class="btn btn-secondary">
              Регистрирайте се
            </a>
            <a href="#contact" class="btn btn-outline btn-secondary">
              Свържете се с нас
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        class="footer footer-center md:footer p-10 bg-neutral text-neutral-content flex flex-col md:flex-row md:justify-between"
        id="contact"
      >
        {/*<div class="md:text-left">*/}
        {/*  <span class="footer-title">Услуги</span>*/}
        {/*  <a class="link link-hover">Озеленяване</a>*/}
        {/*  <a class="link link-hover">Поддръжка</a>*/}
        {/*  <a class="link link-hover">Ландшафтен дизайн</a>*/}
        {/*  <a class="link link-hover">Напоителни системи</a>*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  <span class="footer-title">Компания</span>*/}
        {/*  <a class="link link-hover">За нас</a>*/}
        {/*  <a class="link link-hover">Контакти</a>*/}
        {/*  <a class="link link-hover">Кариери</a>*/}
        {/*  <a class="link link-hover">Блог</a>*/}
        {/*</div>*/}
        {/*<div class="md:text-left mt-8 md:mt-0">*/}
        {/*  <span class="footer-title">Контакти</span>*/}
        {/*  /!*<p>ул. "Зелена градина" 123</p>*!/*/}
        {/*  /!*<p>гр. София, 1000</p>*!/*/}
        {/*  /!*<p>Тел: +359 88 888 8888</p>*!/*/}
        {/*  /!*<p>Email: info@dvorcheck.bg</p>*!/*/}
        {/*</div>*/}
      </footer>
      <footer class="footer flex flex-col sm:flex-row items-center justify-between px-10 py-4 border-t bg-neutral text-neutral-content border-base-300">
        <div class="text-center sm:text-left mb-4 sm:mb-0">
          <p>Calendula © 2025 - Всички права запазени</p>
        </div>
        <div class="flex justify-center">
          <div class="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Calendula - Озеленяване и поддръжка на градини",
  meta: [
    {
      name: "description",
      content:
        "Професионално озеленяване и поддръжка на частни имоти и паркове. Система за мониторинг на дейностите, календар на задачите и отчети.",
    },
  ],
};
