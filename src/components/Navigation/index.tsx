import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import {
  clearAuthToken,
  isLoggedIn as checkIsLoggedIn,
  clearUserInfo,
} from "~/utils/pocketbase";

import logo from "~/../public/logo.svg";

export const Navigation = component$(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMenuOpen = useSignal(false);
  const isLoggedIn = useSignal(false);

  // Check if user is logged in
  useVisibleTask$(() => {
    // Use the utility function to check if the user is logged in
    isLoggedIn.value = checkIsLoggedIn();
  });

  const handleLogout = $(() => {
    // Clear auth token and user data
    clearAuthToken();
    clearUserInfo();
    localStorage.removeItem("userEmail");
    isLoggedIn.value = false;
    // Redirect to home page
    navigate("/");
  });

  return (
    <div class="navbar bg-base-100 shadow-md">
      <div class="navbar-start">
        <div class="dropdown">
          <div
            tabIndex={0}
            role="button"
            class="btn btn-ghost lg:hidden"
            onClick$={() => (isMenuOpen.value = !isMenuOpen.value)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {!isMenuOpen.value && (
            <ul
              tabIndex={0}
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a
                  href="/"
                  class={location.url.pathname === "/" ? "active" : ""}
                >
                  Home
                </a>
              </li>
              {!isLoggedIn.value ? (
                <>
                  <li>
                    <a
                      href="/calendar"
                      class={
                        location.url.pathname === "/calendar" ? "active" : ""
                      }
                    >
                      Calendar
                    </a>
                  </li>
                  <li>
                    <a
                      href="/login"
                      class={location.url.pathname === "/login" ? "active" : ""}
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/register"
                      class={
                        location.url.pathname === "/register" ? "active" : ""
                      }
                    >
                      Register
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="/tasks"
                      class={
                        location.url.pathname.startsWith("/tasks")
                          ? "active"
                          : ""
                      }
                    >
                      Tasks
                    </a>
                  </li>
                  <li>
                    <a
                      href="/reports"
                      class={
                        location.url.pathname.startsWith("/reports")
                          ? "active"
                          : ""
                      }
                    >
                      Reports
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick$={handleLogout}>
                      Logout
                    </a>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
        <a href="/" class="flex items-center text-xl">
          <img src={logo} width="50" height="50" />
          ГрадинАп
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a href="/" class={location.url.pathname === "/" ? "active" : ""}>
              Home
            </a>
          </li>
          {!isLoggedIn.value ? (
            <li>
              <a
                href="/login"
                class={location.url.pathname === "/login" ? "active" : ""}
              >
                Login
              </a>
            </li>
          ) : (
            <>
              <li>
                <a
                  href="/calendar"
                  class={location.url.pathname === "/calendar" ? "active" : ""}
                >
                  Calendar
                </a>
              </li>
              <li>
                <a
                  href="/tasks"
                  class={
                    location.url.pathname.startsWith("/tasks") ? "active" : ""
                  }
                >
                  Tasks
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  class={
                    location.url.pathname.startsWith("/reports") ? "active" : ""
                  }
                >
                  Reports
                </a>
              </li>
              <li>
                <a href="#" onClick$={handleLogout}>
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      <div class="navbar-end">
        {isLoggedIn.value && (
          <div class="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://ui-avatars.com/api/?name=User"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="#">Profile</a>
              </li>
              <li>
                <a href="#">Settings</a>
              </li>
              <li>
                <a href="#" onClick$={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});
