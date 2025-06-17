import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { pb } from "~/utils/pocketbase";

export default component$(() => {
  const emailSignal = useSignal("");
  const passwordSignal = useSignal("");
  const confirmPasswordSignal = useSignal("");
  const nameSignal = useSignal("");
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);

  const handleRegister = $(async () => {
    errorSignal.value = "";
    isLoading.value = true;

    try {
      if (
        !emailSignal.value ||
        !passwordSignal.value ||
        !confirmPasswordSignal.value ||
        !nameSignal.value
      ) {
        errorSignal.value = "Please fill in all fields";
        isLoading.value = false;
        return;
      }

      if (passwordSignal.value !== confirmPasswordSignal.value) {
        errorSignal.value = "Passwords do not match";
        isLoading.value = false;
        return;
      }

      try {
        // Use PocketBase client for user creation
        const data = await pb.collection("users").create({
          email: emailSignal.value,
          password: passwordSignal.value,
          passwordConfirm: confirmPasswordSignal.value,
          name: nameSignal.value,
        });

        console.log("Registration successful:", data);
        // Redirect to login page
        window.location.href = "/login";
      } catch (err: any) {
        errorSignal.value = err.message || "Registration failed";
        console.error("Registration error:", err);
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorSignal.value =
        "An error occurred during registration. Please try again.";
    } finally {
      isLoading.value = false;
    }
  });

  // Focus on name field when component loads
  useVisibleTask$(() => {
    const nameInput = document.getElementById("name");
    if (nameInput) {
      nameInput.focus();
    }
  });

  return (
    <div class="flex min-h-screen items-center justify-center bg-base-200">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold text-center mb-6">
            Register
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

          <form
            preventdefault:submit
            onSubmit$={handleRegister}
            class="space-y-4"
          >
            <div class="form-control">
              <label class="label" for="name">
                <span class="label-text">Full Name</span>
              </label>
              <input
                id="name"
                type="text"
                class="input input-bordered w-full"
                value={nameSignal.value}
                onInput$={(e) =>
                  (nameSignal.value = (e.target as HTMLInputElement).value)
                }
                placeholder="John Doe"
                required
              />
            </div>

            <div class="form-control">
              <label class="label" for="email">
                <span class="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                class="input input-bordered w-full"
                value={emailSignal.value}
                onInput$={(e) =>
                  (emailSignal.value = (e.target as HTMLInputElement).value)
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
                  (passwordSignal.value = (e.target as HTMLInputElement).value)
                }
                required
              />
            </div>

            <div class="form-control">
              <label class="label" for="confirmPassword">
                <span class="label-text">Confirm Password</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                class="input input-bordered w-full"
                value={confirmPasswordSignal.value}
                onInput$={(e) =>
                  (confirmPasswordSignal.value = (
                    e.target as HTMLInputElement
                  ).value)
                }
                required
              />
            </div>

            <div class="form-control mt-6">
              <button
                type="submit"
                class={`btn btn-primary ${isLoading.value ? "loading" : ""}`}
                disabled={isLoading.value}
              >
                {isLoading.value ? "Registering..." : "Register"}
              </button>
            </div>

            <div class="text-center mt-4">
              <p>
                Already have an account?{" "}
                <a href="/login" class="link link-primary">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Register",
  meta: [
    {
      name: "description",
      content: "Create a new account",
    },
  ],
};
