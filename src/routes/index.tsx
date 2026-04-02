import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";

export const useHostname = routeLoader$(({ url }) => {
  return url.hostname;
});

export default component$(() => {
  const hostname = useHostname();
  const isGardenExpert = hostname.value === "gardenexpert.hopto.org";

  return (
    <div class="min-h-screen">
      {/* Hero Section */}
      <section
        class="hero min-h-[70vh] bg-base-200"
        style={
          isGardenExpert
            ? "background-image: url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center;"
            : "background-image: url('https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center;"
        }
      >
        <div class="hero-overlay bg-opacity-60"></div>
        <div class="hero-content text-center text-neutral-content">
          <div class="max-w-md">
            <h1 class="mb-5 text-2xl sm:text-4xl md:text-5xl font-bold">
              {isGardenExpert ? "Garden Expert" : <>Calendula App <br /> & <br /> Miron Style Garden</>}
            </h1>
            <p class="mb-5 text-sm sm:text-base">
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
      <section class="py-8 sm:py-12 md:py-16 bg-base-100">
        <div class="container mx-auto px-3 sm:px-4">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Нашите услуги</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
      <section class="py-8 sm:py-12 md:py-16 bg-base-200">
        <div class="container mx-auto px-3 sm:px-4">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Система за управление</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
                  <a href="/calendar-info" class="btn btn-primary">
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
                  <a href="/reports-info" class="btn btn-primary">
                    Научете повече
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-8 sm:py-12 md:py-16 bg-secondary text-primary-content">
        <div class="container mx-auto px-3 sm:px-4 text-center">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-6">Готови ли сте да трансформирате вашата градина?</h2>
          <p class="mb-8 max-w-2xl mx-auto">
            Свържете се с нас днес, за да обсъдим как можем да помогнем за озеленяването и
            поддръжката на вашия имот.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/register" class="btn btn-success">
              Регистрирайте се
            </a>
            <a href="#contact" class="btn btn-outline">
              Свържете се с нас
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        class="footer md:footer p-4 sm:p-6 md:p-10 bg-neutral text-neutral-content flex flex-col md:flex-row md:justify-between"
        id="contact"
      >
        <span class="footer-title -mb-10">Контакти</span>
        {!isGardenExpert && (
          <div class="md:text-left mt-8 md:mt-0">
            <span class="footer-title">Calendula App</span>
            <p>гр. Пловдив, 4000</p>
            <p>Тел. +359877202617</p>
            <p>Email: s.p.germanov@gmail.com</p>
          </div>
        )}
        <div class="md:text-left mt-8 md:mt-0">
          <span class="footer-title">{isGardenExpert ? "Garden Expert" : "Miron Style Garden"}</span>
          <p>гр. Пловдив, 4000</p>
          <p>Тел. {isGardenExpert ? "+359 888 123 456" : "+359895606248"}</p>
          <p>Email: {isGardenExpert ? "info@gardenexpert.bg" : "pindevmiroslav@gmail.com"}</p>
        </div>
      </footer>
      <footer class="footer flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-10 py-4 border-t bg-neutral text-neutral-content border-base-300">
        <div class="text-center sm:text-left mb-4 sm:mb-0">
          <p>{isGardenExpert ? "Garden Expert" : "Calendula"} &copy; 2025 - Всички права запазени</p>
        </div>
        <div class="flex justify-center">
          <div class="grid grid-flow-col gap-4">
            <a href="#">
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
            <a href="#">
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
            <a href="#">
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
