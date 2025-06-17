import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import {
  pb,
  setAuthToken,
  clearAuthToken,
  setUserInfo,
} from "~/utils/pocketbase";

export default component$(() => {
  const navigate = useNavigate();
  const usernameSignal = useSignal("");
  const passwordSignal = useSignal("");
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);
  const isLoggedIn = useSignal(false);
  const userEmail = useSignal("");

  const handleLogout = $(() => {
    // Clear auth token and user info
    clearAuthToken();
    localStorage.removeItem("userEmail");
    isLoggedIn.value = false;
    // Redirect to home page
    navigate("/");
  });

  const handleLogin = $(async () => {
    errorSignal.value = "";
    isLoading.value = true;

    try {
      if (!usernameSignal.value || !passwordSignal.value) {
        errorSignal.value = "Please enter both username and password";
        isLoading.value = false;
        return;
      }

      try {
        // Use PocketBase client for authentication
        const authData = await pb
          .collection("users")
          .authWithPassword(usernameSignal.value, passwordSignal.value);

        console.log("Login successful:", authData);

        // Store auth token and user email
        setAuthToken(pb.authStore.token);
        localStorage.setItem("userEmail", usernameSignal.value);

        //Store user info
        setUserInfo({
          id: authData.record.id,
          type: authData.record.type,
          name: authData.record.name,
          avatar: authData.record.avatar,
          parent: authData.record.parent || null,
        });

        // Redirect to calendar page
        window.location.href = "/calendar";
      } catch (err: any) {
        errorSignal.value = err.message || "Authentication failed";
        console.error("Login error:", err);
      }
    } catch (error) {
      console.error("Login error:", error);
      errorSignal.value = "An error occurred during login. Please try again.";
    } finally {
      isLoading.value = false;
    }
  });

  // Focus on username field when component loads
  useVisibleTask$(() => {
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
      usernameInput.focus();
    }
  });

  return (
    <div class="flex min-h-screen items-center justify-center bg-base-200">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold text-center mb-6">
            {isLoggedIn.value ? "User Information" : "Login"}
          </h2>

          {errorSignal.value && (
            <div class="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorSignal.value}</span>
            </div>
          )}

          {isLoggedIn.value ? (
            <div class="space-y-6">
              <div class="flex justify-center mb-4">
                <div class="avatar">
                  <div class="w-24 rounded-full">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.value)}&background=random`}
                      alt="User avatar"
                    />
                  </div>
                </div>
              </div>

              <div class="text-center">
                <h3 class="text-lg font-semibold mb-2">Email:</h3>
                <p class="text-gray-600 mb-6">{userEmail.value}</p>
              </div>

              <div class="form-control">
                <button onClick$={handleLogout} class="btn btn-primary">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form
              preventdefault:submit
              onSubmit$={handleLogin}
              class="space-y-4"
            >
              <div class="form-control">
                <label class="label" for="username">
                  <span class="label-text">Email</span>
                </label>
                <input
                  id="username"
                  type="email"
                  class="input input-bordered w-full"
                  value={usernameSignal.value}
                  onInput$={(e) =>
                    (usernameSignal.value = (
                      e.target as HTMLInputElement
                    ).value)
                  }
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div class="form-control">
                <label class="label" for="password">
                  <span class="label-text">Password</span>
                </label>
                <input
                  id="password"
                  type="password"
                  class="input input-bordered w-full"
                  value={passwordSignal.value}
                  onInput$={(e) =>
                    (passwordSignal.value = (
                      e.target as HTMLInputElement
                    ).value)
                  }
                  required
                />
                <label class="label">
                  <a href="#" class="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>

              <div class="form-control mt-6">
                <button
                  type="submit"
                  class={`btn btn-primary ${isLoading.value ? "loading" : ""}`}
                  disabled={isLoading.value}
                >
                  {isLoading.value ? "Logging in..." : "Login"}
                </button>
              </div>

              <div class="text-center mt-4">
                <p>
                  Don't have an account?{" "}
                  <a href="/register" class="link link-primary">
                    Register
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login to your account or view your profile",
    },
  ],
};
